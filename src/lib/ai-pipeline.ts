import { pipeline, env } from '@huggingface/transformers';

// Setup Transformers.js for Next.js / Vercel Serverless
env.allowLocalModels = false;
env.useBrowserCache = false;

// Using a very small 77M parameter model for extremely fast cold starts
const MODEL_NAME = 'Xenova/LaMini-Flan-T5-77M';

let generator: any = null;

// Timeout promise wrapper to prevent Vercel 10s function limit crashes
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`[OpportunityAI] ⚠️ AI Pipeline hit ${ms}ms timeout, using fallback.`);
      resolve(fallback);
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

async function getGenerator() {
  if (!generator) {
    try {
      console.log(`[OpportunityAI] Loading local lightweight model: ${MODEL_NAME}`);
      generator = await pipeline('text2text-generation', MODEL_NAME);
    } catch (err) {
      console.error('[OpportunityAI] Error loading local model:', err);
    }
  }
  return generator;
}

export async function preWarmPipeline() {
  await getGenerator();
}

export async function generateAITitlePipeline(subject: string, bodySnippet: string): Promise<string> {
  const gen = await getGenerator();
  if (!gen) return subject;

  try {
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 150).join(' ');
    const prompt = `Write a short 3-word professional title for this email: ${cleanBody}`;

    const generatePromise = gen(prompt, {
      max_new_tokens: 15,
      temperature: 0.1,
    });
    
    // Hard 5-second timeout for title to prevent Vercel crashes
    const res: any = await withTimeout(generatePromise, 5000, null);
    if (!res) return subject;
    
    let title = res[0].generated_text.trim();
    if (title.length > 5 && title.length < 100) return title;
    return subject;
  } catch (err) {
    console.error("[OpportunityAI] Local AI Title Error:", err);
    return subject;
  }
}

export async function generateAISummaryPipeline(bodySnippet: string): Promise<string> {
  const gen = await getGenerator();
  const fallback = bodySnippet.substring(0, 200) + '...';
  if (!gen) return fallback;

  try {
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 200).join(' ');
    const prompt = `Write a brief 1-sentence professional summary for this email: ${cleanBody}`;

    const generatePromise = gen(prompt, {
      max_new_tokens: 100,
      temperature: 0.2,
    });
    
    // Hard 7-second timeout for summary (Vercel max is 10s)
    const res: any = await withTimeout(generatePromise, 7000, null);
    if (!res) return fallback;

    let summary = res[0].generated_text.trim();
    return summary;
  } catch (err) {
    console.error('[OpportunityAI] Local AI Summary Error:', err);
    return fallback;
  }
}

export async function generateAIDeadlinePipeline(bodySnippet: string): Promise<string | null> {
  const gen = await getGenerator();
  if (!gen) return null;

  try {
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 200).join(' ');
    const prompt = `Extract the application deadline date from this email. Return 'none' if no deadline is mentioned. Email: ${cleanBody}`;

    const generatePromise = gen(prompt, {
      max_new_tokens: 20,
      temperature: 0.1,
    });
    
    // Hard 4-second timeout for deadline
    const res: any = await withTimeout(generatePromise, 4000, null);
    if (!res) return null;

    let output = res[0].generated_text.trim();
    if (!output || output.toLowerCase().includes('none') || output.length < 4) return null;
    
    const parsed = new Date(output);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
    return null;
  } catch (err) {
    console.error('[OpportunityAI] Local AI Deadline Error:', err);
    return null;
  }
}
