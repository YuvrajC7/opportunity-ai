const { pipeline } = require('@huggingface/transformers');

async function run() {
  console.log('Loading pipeline...');
  const generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', { dtype: 'q8' });

  const emails = [
    "Due to the expansion of our team requirements, we are excited to announce a Second Call for Online Interview for the Website & Tech Committee of graVITas 2026.",
    "A key highlight is the celebration of National Space Day... In this regard, the Bharat Space Education Research Centre is pleased to announce the Def-Space Summer Internship 2026...",
    "Amazon is hiring Software Development Engineer interns for Summer 2026. Apply through the careers portal."
  ];

  for (const text of emails) {
    const messages = [
      { role: 'system', content: 'You are an expert at reading emails and extracting a short 3 to 5 word professional title. Always output ONLY the title, nothing else.' },
      { role: 'user', content: `Extract the organization name and the program type from this email to create a concise title.\n\nEmail:\n${text}` }
    ];

    const prompt = generator.tokenizer.apply_chat_template(messages, {
      tokenize: false,
      add_generation_prompt: true,
    });

    const result = await generator(prompt, {
      max_new_tokens: 15,
      temperature: 0.1,
      do_sample: false
    });
    
    console.log(`\nEmail: ${text.substring(0, 50)}...`);
    // The result includes the prompt, so we have to split it out
    const generated = result[0].generated_text.split('<|im_start|>assistant\n')[1] || result[0].generated_text;
    console.log(`Title: ${generated.trim()}`);
  }
}

run();
