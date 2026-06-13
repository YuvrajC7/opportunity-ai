import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client dynamically at runtime
// This prevents Next.js from baking in an empty key at build time
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
}

// We use the extremely fast and cheap flash model
const MODEL_NAME = 'gemini-1.5-flash';

export async function preWarmPipeline() {
  if (!getGenAI()) {
    console.log('[OpportunityAI] ⚠️ GEMINI_API_KEY is missing. Using NLP heuristics only.');
    return;
  }
  console.log('[OpportunityAI] ✅ Gemini API Client initialized!');
}

export async function generateAITitlePipeline(subject: string, bodySnippet: string): Promise<string> {
  const genAI = getGenAI();
  if (!genAI) return subject;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Read deep into the email body - up to 350 words
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 350).join(' ');
    
    const prompt = `Write a short 3-word title summarizing this opportunity email.\nEmail: ${cleanBody}\nTitle:`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 15,
        temperature: 0.1, // Near deterministic
      }
    });
    
    let title = result.response.text().trim();
    
    // Strip out any hallucinated prefixes (e.g., if it outputs "Professional Title: XYZ")
    title = title.replace(/^[^:]*:\s*/, '');
    title = title.replace(/^["']|["']$/g, '');
    
    if (title.length > 5 && title.length < 100) {
      return title;
    }
    
    return subject;
  } catch (err) {
    console.error("[OpportunityAI] Gemini API Title Error:", err);
    return subject;
  }
}

export async function generateAISummaryPipeline(bodySnippet: string): Promise<string> {
  const genAI = getGenAI();
  if (!genAI) return bodySnippet.substring(0, 200) + '...';

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Read up to 400 words
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 400).join(' ');
    
    const prompt = `Write a brief, complete 2-sentence professional summary of this opportunity email.\nEmail: ${cleanBody}\nSummary:`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.2,
      }
    });
    
    let summary = result.response.text().trim();
    summary = summary.replace(/^.*?(?:Summary|Description):\s*/i, '');
    
    // Clean up dangling sentences
    const lastPunctuation = Math.max(summary.lastIndexOf('.'), summary.lastIndexOf('!'), summary.lastIndexOf('?'));
    if (lastPunctuation > 0 && lastPunctuation < summary.length - 1) {
      if (summary.length - lastPunctuation > 5) {
         summary = summary.substring(0, lastPunctuation + 1);
      }
    }
    
    return summary;
  } catch (error) {
    console.error('[OpportunityAI] Gemini API Summary Error:', error);
    return bodySnippet.substring(0, 200) + '...'; // fallback
  }
}

export async function generateAIDeadlinePipeline(bodySnippet: string): Promise<string | null> {
  const genAI = getGenAI();
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Feed up to 500 words so the model can read the ENTIRE email
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 500).join(' ');
    
    const prompt = `Read this email carefully. Find ONLY the application deadline or registration deadline date. Do NOT return event dates, course start dates, or course end dates. Return ONLY the deadline date in the format "Month Day, Year". If no application deadline is mentioned, return "none".\nEmail: ${cleanBody}\nApplication Deadline:`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 30,
        temperature: 0.1,
      }
    });
    
    let output = result.response.text().trim();
    
    // Strip prompt echoes
    if (output.includes('Application Deadline:')) {
      output = output.split('Application Deadline:').pop()!.trim();
    }
    if (output.includes('Deadline:')) {
      output = output.split('Deadline:').pop()!.trim();
    }
    
    // Clean artifacts
    output = output.replace(/^["']|["']$/g, '').trim();
    
    // If model says none / no deadline / not mentioned
    if (!output || output.toLowerCase().includes('none') || output.toLowerCase().includes('not mentioned') || output.toLowerCase().includes('no deadline') || output.length < 4) {
      return null;
    }
    
    // Try to parse the date the model returned
    const parsed = new Date(output);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    
    // Try common patterns the model might output
    const mdyMatch = output.match(/([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})/);
    if (mdyMatch) {
      const d = new Date(`${mdyMatch[1]} ${mdyMatch[2]}, ${mdyMatch[3]}`);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    
    const dmyMatch = output.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s*(\d{4})/);
    if (dmyMatch) {
      const d = new Date(`${dmyMatch[2]} ${dmyMatch[1]}, ${dmyMatch[3]}`);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    
    const numMatch = output.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (numMatch) {
      const d = new Date(parseInt(numMatch[3]), parseInt(numMatch[2]) - 1, parseInt(numMatch[1]));
      if (!isNaN(d.getTime())) return d.toISOString();
    }

    console.log(`[OpportunityAI] AI Deadline extraction could not parse: "${output}"`);
    return null;
  } catch (error) {
    console.error('[OpportunityAI] Gemini API Deadline Error:', error);
    return null;
  }
}
