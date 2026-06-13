const { generateAISummaryPipeline } = require('./src/lib/ai-pipeline.ts'); // Can't require ts directly in node without ts-node

async function run() {
  const { pipeline } = require('@huggingface/transformers');
  const generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M', { dtype: 'q8' });
  const email = `Kind Attention Undergraduate Students! Ming Chi University of Technology, Taiwan has announced the start of the recruitment process for the 2026 MCUT Language and Culture Summer Camp! Objectives: To ensure effective coordination, we kindly request that faculty members or international office staff fill out the Online Registration Link on behalf of the students.`;
  
  const prompt = `Write a brief 2-sentence professional summary of this opportunity email.\nEmail: ${email}\nSummary:`;
  const result = await generator(prompt, { max_new_tokens: 60, temperature: 0.2, do_sample: false });
  console.log(result[0].generated_text);
}
run();
