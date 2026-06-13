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
  let cleanBody = bodySnippet;

  // 1. Strip Forwarded Message Headers & Meta
  cleanBody = cleanBody.replace(/---------- Forwarded message ---------[\s\S]*?(?:Subject:|Date:)[^\n]*\n/gi, '');
  cleanBody = cleanBody.replace(/(?:From|Date|Subject|To|Cc):\s*[^\n]+\n/gi, '');
  
  // 2. Strip "Please see the mail below" and similar forwarding text
  cleanBody = cleanBody.replace(/^[\s\S]*?(?:Please see the mail below|see the trailing mail|forwarded message)[^\n]*\n/gi, '');

  // 3. Strip Signatures (Everything after "Warm regards", "Best regards", etc.)
  cleanBody = cleanBody.replace(/(?:Warm regards|Best regards|Thanks and regards|Thanks & Regards|Sincerely|Best,|Thanks,)[\s\S]*/gi, '');
  
  // 4. Flatten remaining whitespace
  cleanBody = cleanBody.replace(/\s+/g, ' ').trim();

  // 5. Remove common greetings
  const greetings = [
    /^(?:kind attention|dear|hello|greetings|hi|to whom|hope this)[^.]*[.!?,]\s*/i,
    /^(?:dear students|dear student|dear all)[^.]*[.!?,]\s*/i,
    /^(?:greetings from)[^.]*[.!?,]\s*/i,
    /^[A-Z][a-z]+,\s*/, // Matches "Balachandran, "
  ];
  for (let i = 0; i < 3; i++) {
    for (const regex of greetings) {
      cleanBody = cleanBody.replace(regex, '');
    }
  }

  // 6. Extract sentences
  const sentences = cleanBody.match(/[^.!?]+[.!?]+/g) || [];
  let summary = '';
  
  if (sentences.length > 0) {
    const validSentences = sentences.filter(s => 
      s.trim().length > 30 && 
      !s.toLowerCase().includes('unsubscribe') &&
      !s.toLowerCase().includes('click here') &&
      !s.toLowerCase().includes('forwarded')
    );
    
    if (validSentences.length > 0) {
      summary = validSentences.slice(0, 3).join(' ').trim();
    }
  }
  
  // 7. Fallbacks
  if (!summary || summary.length < 50) {
    summary = cleanBody.substring(0, 350).trim();
  } else if (summary.length > 450) {
    summary = summary.substring(0, 450).trim() + '...';
  }
  
  if (summary && !summary.endsWith('.') && !summary.endsWith('!') && !summary.endsWith('?') && !summary.endsWith('...')) {
    summary += '...';
  }
  
  return summary || "No summary available.";
}

export async function generateAIDeadlinePipeline(bodySnippet: string): Promise<string | null> {
  // Heuristics are already handled by ai-title-engine fallback
  return null;
}
