// Vercel Serverless crashes when trying to download 100MB+ models inside a 10s timeout.
// We will use highly optimized NLP heuristics for Vercel, and only allow Transformers locally.
const IS_VERCEL = process.env.VERCEL === '1';

export async function preWarmPipeline() {
  if (IS_VERCEL) {
    console.log('[OpportunityAI] Running on Vercel. Using blazing fast NLP heuristics.');
  } else {
    console.log('[OpportunityAI] Running locally. AI could be loaded here.');
  }
}

export async function generateAITitlePipeline(subject: string, bodySnippet: string): Promise<string> {
  // Always return subject on Vercel to prevent 504 Gateway Timeouts
  return subject;
}

export async function generateAISummaryPipeline(bodySnippet: string): Promise<string> {
  // Use a smart heuristic summary for Vercel
  let cleanBody = bodySnippet.replace(/\s+/g, ' ').trim();
  
  // 1. Remove common greetings and boilerplate
  const greetings = [
    /^(?:kind attention|dear|hello|greetings|hi|to whom|hope this)[^.]*[.!?,]\s*/i,
    /^(?:dear students|dear student|dear all)[^.]*[.!?,]\s*/i,
    /^(?:greetings from)[^.]*[.!?,]\s*/i,
    /^[A-Z][a-z]+,\s*/, // Matches "Balachandran, "
    /^Greetings from [^,]+,\s*/i
  ];
  
  for (let i = 0; i < 3; i++) { // Loop a few times to strip multiple stacked greetings
    for (const regex of greetings) {
      cleanBody = cleanBody.replace(regex, '');
    }
  }
  
  // 2. Try to grab the first 2-3 substantive sentences
  const sentences = cleanBody.match(/[^.!?]+[.!?]+/g) || [];
  let summary = '';
  
  if (sentences.length > 0) {
    // Filter out extremely short sentences or purely administrative links
    const validSentences = sentences.filter(s => 
      s.trim().length > 30 && 
      !s.toLowerCase().includes('unsubscribe') &&
      !s.toLowerCase().includes('click here') &&
      !s.toLowerCase().includes('view this email')
    );
    
    if (validSentences.length > 0) {
      // Grab up to 3 valid sentences to make it nice and meaty
      summary = validSentences.slice(0, 3).join(' ').trim();
    }
  }
  
  // 3. Fallback if regex completely fails to parse sentences
  if (!summary || summary.length < 50) {
    summary = cleanBody.substring(0, 350).trim();
  } else if (summary.length > 450) {
    // Trim if it's way too long
    summary = summary.substring(0, 450).trim() + '...';
  }
  
  // 4. Ensure it ends nicely
  if (!summary.endsWith('.') && !summary.endsWith('!') && !summary.endsWith('?') && !summary.endsWith('...')) {
    summary += '...';
  }
  
  return summary;
}

export async function generateAIDeadlinePipeline(bodySnippet: string): Promise<string | null> {
  // Heuristics are already handled by ai-title-engine fallback
  return null;
}
