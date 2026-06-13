const { pipeline } = require('@huggingface/transformers');

async function test() {
  try {
    console.log('Loading local model pipeline...');
    const generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M', { dtype: 'q8' });
    
    const prompt = `Extract the organization and opportunity type (e.g., Internship, Hackathon, Workshop) from this email and output a 3-5 word title.

Email: Dear Students, VIT, in collaboration with National University of Singapore is pleased to invite you to participate in the NUS Summer Workshop in Data Science.
Title:`;
    
    console.log('Generating inference...');
    const result = await generator(prompt, { max_new_tokens: 15 });
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
