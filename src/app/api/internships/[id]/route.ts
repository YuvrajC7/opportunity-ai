import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { google } from 'googleapis';
import { extractDeadline, extractSkills, extractCategory, extractApplyLink, extractEmailBody } from '@/lib/utils';
import { generateAITitle, generateAISummary, extractAIDeadline } from '@/lib/ai-title-engine';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;
  
  // @ts-ignore
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    // @ts-ignore
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: id,
      format: 'full'
    });
    
    const payload = email.data.payload;
    const headers = payload?.headers;
    const rawSubject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
    const from = headers?.find(h => h.name === 'From')?.value || 'Unknown';
    const fromName = from.split('<')[0].trim() || from;
    const date = headers?.find(h => h.name === 'Date')?.value || '';
    const snippet = email.data.snippet || '';

    const { plain: bodyData, html: htmlData } = extractEmailBody(payload);

    const applyLink = extractApplyLink(htmlData || bodyData, snippet);
    
    // Generate title using OpportunityAI Title Engine (local LLM + NLP)
    const subject = await generateAITitle(id, rawSubject, bodyData || snippet, fromName);
    
    // AI-powered deadline extraction: model reads the ENTIRE email
    const combinedText = `${rawSubject} ${snippet} ${bodyData}`;
    const keywordFallback = extractDeadline(combinedText);
    const extractedDeadline = await extractAIDeadline(id, bodyData || snippet, keywordFallback);
    const extractedSkills = extractSkills(combinedText);
    const extractedCategory = extractCategory(rawSubject, bodyData || snippet);

    // Generate local ML summary
    const aiSummary = await generateAISummary(id, bodyData || snippet);

    return NextResponse.json({ 
      id: id,
      threadId: email.data.threadId || id,
      subject,
      from,
      snippet,
      summary: aiSummary,
      date,
      applyLink,
      bodyData,
      deadline: extractedDeadline,
      skillsRequired: extractedSkills,
      category: extractedCategory
    });

  } catch (error: any) {
    console.error("Gmail API Single Fetch Error:", error);
    
    // Check if it's an OAuth token expiration error
    if (error.code === 401 || error.message?.includes('invalid authentication credentials')) {
      return NextResponse.json({ error: 'Session Expired', details: 'Your Google authentication token has expired. Please sign out and sign back in.' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to fetch email', details: error.message }, { status: 500 });
  }
}
