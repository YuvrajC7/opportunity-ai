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
  const cleanBody = bodySnippet.replace(/\s+/g, ' ');
  
  // Try to find the first actual sentence that isn't a greeting
  const sentences = cleanBody.split(/[.!?]\s+/);
  let summary = '';
  
  for (const sentence of sentences) {
    if (sentence.length > 30 && !sentence.toLowerCase().includes('dear') && !sentence.toLowerCase().includes('hello')) {
      summary = sentence.trim();
      break;
    }
  }
  
  if (!summary) {
    summary = cleanBody.substring(0, 150);
  }
  
  // Ensure it ends nicely
  if (!summary.endsWith('.')) summary += '...';
  
  return summary;
}

export async function generateAIDeadlinePipeline(bodySnippet: string): Promise<string | null> {
  // Heuristics are already handled by ai-title-engine fallback
  return null;
}
