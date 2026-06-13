const { pipeline } = require('@huggingface/transformers');

async function run() {
  console.log('Loading QA pipeline...');
  const qa = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad', { dtype: 'q8' });

  const emails = [
    "Dear Students, Please apply if you are eligible. Logo Applications have launched for the 2027 cohort of McCall MacBain Scholars! Up to 30 full scholarships and 100 additional awards will be offered to",
    "Dear all students, Master of Social Work (MSW) admission flyer. - Revised Last Date to Apply 8-6-2026. With regards, Dr. Selvam V Professor and Dean School of Social Sciences and Languages VIT, Vellore",
    "Dear Students, VIT, in collaboration with National University of Singapore, - Asia's #1 University and Ranked #8 in the QS World University Rankings is pleased to invite you to participate in the",
    "Due to the expansion of our team requirements, we are excited to announce a Second Call for Online Interview for the Website & Tech Committee of graVITas 2026."
  ];

  for (const text of emails) {
    console.log(`\nEmail: ${text.substring(0, 70)}...`);
    
    let resultOrg = await qa({
      question: "What is the name of the organization, university, or company?",
      context: text
    });
    
    let resultProg = await qa({
      question: "What is the name of the program, internship, or scholarship?",
      context: text
    });

    console.log(`Org: ${resultOrg.answer} (score: ${resultOrg.score.toFixed(2)})`);
    console.log(`Prog: ${resultProg.answer} (score: ${resultProg.score.toFixed(2)})`);
  }
}

run();
