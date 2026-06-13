import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { google } from 'googleapis';
import { extractDeadline, extractSkills, extractCategory, extractApplyLink, extractEmailBody } from '@/lib/utils';
import { generateAITitle, generateAISummary, extractAIDeadline, preWarmModel } from '@/lib/ai-title-engine';
import { prisma } from '@/lib/prisma';

// Pre-warm the AI model on server startup
preWarmModel();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  if (!session || !session.accessToken || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found in DB.' }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2();
    // @ts-ignore
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // Look for internship emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: '(internship OR hiring OR apply OR application OR career OR exchange OR "study abroad" OR camp OR opportunity OR hackathon OR workshop) newer_than:30d',
      maxResults: 200
    });

    const messages = response.data.messages || [];
    const emails = [];
    const seenThreads = new Set();
    const seenSubjects = new Set();
    const seenAITitles = new Set();

    // Process in batches of 5 to dramatically speed up network fetches without hitting rate limits
    const BATCH_SIZE = 5;
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (msg) => {
        if (!msg.id) return null;
        
        try {
          const email = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
            format: 'full'
          });
          
          const threadId = email.data.threadId || msg.id;
          
          const payload = email.data.payload;
          const headers = payload?.headers;
          const rawSubject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
          
          const normalizedSubject = rawSubject.toLowerCase().trim().replace(/^(fwd|fw|re):\s*/g, '');
          
          const from = headers?.find(h => h.name === 'From')?.value || 'Unknown';
          const fromName = from.split('<')[0].trim() || from;
          const date = headers?.find(h => h.name === 'Date')?.value || '';
          const snippet = email.data.snippet || '';
          const { html: htmlData, plain: plainBody } = extractEmailBody(payload);
          
          const combinedText = `${rawSubject} ${snippet} ${plainBody || ''}`;
          const lowerCombinedText = combinedText.toLowerCase();

          const extractedCategory = extractCategory(rawSubject, plainBody || snippet);
          if (extractedCategory === 'other') return null;

          // Generate local ML summary on-demand later; use raw snippet for list view
          const subject = await generateAITitle(msg.id, rawSubject, plainBody || snippet, fromName);
          const applyLink = extractApplyLink(htmlData || snippet, snippet);
          
          // AI-powered deadline: the model reads the ENTIRE email to find the real application deadline
          const keywordFallback = extractDeadline(combinedText);
          const extractedDeadline = await extractAIDeadline(msg.id, plainBody || snippet, keywordFallback);
          const extractedSkills = extractSkills(combinedText);

          // Save to database
          await prisma.opportunity.upsert({
            where: { sourceEmailId: msg.id },
            update: {
              title: subject,
              company: fromName,
              snippet: snippet,
              date: date,
              applyLink: applyLink,
              deadline: extractedDeadline,
              category: extractedCategory,
              skillsRequired: extractedSkills,
              userId: user.id
              // stipend can be added if extracted
            },
            create: {
              sourceEmailId: msg.id,
              threadId,
              title: subject,
              company: fromName,
              snippet: snippet,
              date: date,
              applyLink: applyLink,
              deadline: extractedDeadline,
              category: extractedCategory,
              skillsRequired: extractedSkills,
              userId: user.id
            }
          });

          return {
            id: msg.id,
            threadId,
            normalizedSubject,
            emailData: {
              id: msg.id,
              threadId,
              subject,
              from,
              snippet: snippet, 
              date,
              applyLink,
              deadline: extractedDeadline,
              skillsRequired: extractedSkills,
              category: extractedCategory
            }
          };
        } catch (err) {
          return null; // Skip if single fetch fails
        }
      });

      const results = await Promise.all(batchPromises);
      
      for (const result of results) {
        if (!result) continue;
        
        if (seenThreads.has(result.threadId)) continue;
        if (seenSubjects.has(result.normalizedSubject)) continue;
        
        // 3. Smart Semantic Deduplication using AI Title
        // If the AI resolves multiple different emails down to the exact same core title 
        // (e.g. 'NUS Internship 2026'), it's the exact same opportunity.
        // Because Gmail returns newest emails first, keeping the first one we see 
        // guarantees we only show the MOST RECENT update.
        const normalizedAITitle = result.emailData.subject.toLowerCase().trim();
        if (seenAITitles.has(normalizedAITitle)) continue;
        
        seenThreads.add(result.threadId);
        seenSubjects.add(result.normalizedSubject);
        seenAITitles.add(normalizedAITitle);
        
        emails.push(result.emailData);
      }
    }

    return NextResponse.json({ emails });
  } catch (error: any) {
    console.error("Gmail API Error:", error);
    
    // Check if it's an OAuth token expiration error
    if (error.code === 401 || error.message?.includes('invalid authentication credentials')) {
      return NextResponse.json({ error: 'Session Expired', details: 'Your Google authentication token has expired. Please sign out and sign back in.' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to fetch emails', details: error.message }, { status: 500 });
  }
}
