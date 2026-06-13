import { pipeline, env } from '@huggingface/transformers';

// Configure environment for server-side Next.js
env.allowLocalModels = false;
env.useBrowserCache = false;

class PipelineSingleton {
  static task = 'text2text-generation';
  // Using a LaMini instruction-tuned model which is heavily optimized for zero-shot tasks
  static model = 'Xenova/LaMini-Flan-T5-248M';
  static instance: any = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // @ts-ignore
      this.instance = pipeline(this.task, this.model, { 
        dtype: 'q8',
        progress_callback 
      });
    }
    return this.instance;
  }
}

export async function preWarmPipeline() {
  console.log('[OpportunityAI] 🚀 Pre-warming Local AI Pipeline...');
  await PipelineSingleton.getInstance();
  console.log('[OpportunityAI] ✅ Local AI Pipeline ready!');
}

export async function generateAITitlePipeline(subject: string, bodySnippet: string): Promise<string> {
  try {
    const generator = await PipelineSingleton.getInstance();
    
    // Read deep into the email body - up to 350 words (~500 tokens)
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 350).join(' ');
    
    const prompt = `Write a short 3-word title summarizing this email.\nEmail: ${cleanBody}\nTitle:`;

    const result = await generator(prompt, {
      max_new_tokens: 25, // Increased to prevent cutting off in the middle
      temperature: 0.1, // Near deterministic
      do_sample: false
    });
    
    if (result && result.length > 0 && result[0].generated_text) {
      let title = result[0].generated_text.trim();
      
      // The model sometimes returns the entire prompt + the new text, so we extract just the end
      if (title.includes('Title:')) {
        const parts = title.split('Title:');
        title = parts[parts.length - 1].trim();
      }
      
      // Strip out any hallucinated prefixes (e.g., if it outputs "Professional Title: XYZ")
      title = title.replace(/^[^:]*:\s*/, '');
      title = title.replace(/^["']|["']$/g, '');
      
      if (title.length > 5 && title.length < 100) {
        return title;
      }
    }
    
    return subject;
  } catch (err) {
    console.error("Local ML Pipeline Error:", err);
    return subject;
  }
}

export async function generateAISummaryPipeline(bodySnippet: string): Promise<string> {
  try {
    const generator = await PipelineSingleton.getInstance();
    
    // Read up to 400 words
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 400).join(' ');
    
    const prompt = `Write a brief, complete 2-sentence professional summary of this opportunity email.\nEmail: ${cleanBody}\nSummary:`;

    const result = await generator(prompt, {
      max_new_tokens: 150, // Increased to allow complete sentences
      temperature: 0.2,
      do_sample: false
    });
    
    let summary = result[0].generated_text.trim();
    summary = summary.replace(/^.*?(?:Summary|Description):\s*/i, '');
    
    // Clean up dangling sentences if it got cut off or went on a tangent
    const lastPunctuation = Math.max(summary.lastIndexOf('.'), summary.lastIndexOf('!'), summary.lastIndexOf('?'));
    if (lastPunctuation > 0 && lastPunctuation < summary.length - 1) {
      // Only trim if the trailing part is longer than 5 chars (to avoid killing valid acronyms or ellipses)
      if (summary.length - lastPunctuation > 5) {
         summary = summary.substring(0, lastPunctuation + 1);
      }
    }
    
    return summary;
  } catch (error) {
    console.error('[OpportunityAI] Local AI Summary Pipeline failed:', error);
    return bodySnippet.substring(0, 200) + '...'; // fallback
  }
}

export async function generateAIDeadlinePipeline(bodySnippet: string): Promise<string | null> {
  try {
    const generator = await PipelineSingleton.getInstance();
    
    // Feed up to 500 words so the model can read the ENTIRE email
    const cleanBody = bodySnippet.replace(/\s+/g, ' ').split(' ').slice(0, 500).join(' ');
    
    const prompt = `Read this email carefully. Find ONLY the application deadline or registration deadline date. Do NOT return event dates, course start dates, or course end dates. Return ONLY the deadline date in the format "Month Day, Year". If no application deadline is mentioned, return "none".\nEmail: ${cleanBody}\nApplication Deadline:`;

    const result = await generator(prompt, {
      max_new_tokens: 30,
      temperature: 0.1,
      do_sample: false
    });
    
    let output = result[0].generated_text.trim();
    
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
    
    // Try common patterns the model might output: "June 10, 2026", "10 June 2026", "10/06/2026"
    const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    const monthShort = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    
    // Pattern: "Month Day, Year" or "Month Day Year"
    const mdyMatch = output.match(/([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})/);
    if (mdyMatch) {
      const d = new Date(`${mdyMatch[1]} ${mdyMatch[2]}, ${mdyMatch[3]}`);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    
    // Pattern: "Day Month Year"
    const dmyMatch = output.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s*(\d{4})/);
    if (dmyMatch) {
      const d = new Date(`${dmyMatch[2]} ${dmyMatch[1]}, ${dmyMatch[3]}`);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    
    // Pattern: DD/MM/YYYY or DD-MM-YYYY
    const numMatch = output.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (numMatch) {
      const d = new Date(parseInt(numMatch[3]), parseInt(numMatch[2]) - 1, parseInt(numMatch[1]));
      if (!isNaN(d.getTime())) return d.toISOString();
    }

    console.log(`[OpportunityAI] AI Deadline extraction could not parse: "${output}"`);
    return null;
  } catch (error) {
    console.error('[OpportunityAI] AI Deadline Pipeline failed:', error);
    return null;
  }
}

