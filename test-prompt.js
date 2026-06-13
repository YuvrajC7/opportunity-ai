const { pipeline } = require('@huggingface/transformers');

async function run() {
  console.log('Loading pipeline...');
  const generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M', { dtype: 'q8' });

  const emails = [
    "Due to the expansion of our team requirements, we are excited to announce a Second Call for Online Interview for the Website & Tech Committee of graVITas 2026.",
    "A key highlight is the celebration of National Space Day... In this regard, the Bharat Space Education Research Centre is pleased to announce the Def-Space Summer Internship 2026...",
    "Amazon is hiring Software Development Engineer interns for Summer 2026. Apply through the careers portal."
  ];

  for (const text of emails) {
    const prompt = `Write a short 3-word title summarizing this email.\nEmail: ${text}\nTitle:`;

    const result = await generator(prompt, {
      max_new_tokens: 15,
      temperature: 0.1,
      do_sample: false
    });
    console.log(`\nEmail: ${text.substring(0, 50)}...`);
    console.log(`Title: ${result[0].generated_text.trim()}`);
  }
}

run();
