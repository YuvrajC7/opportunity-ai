async function test() {
  const prompt = encodeURIComponent('Write a 1-sentence summary of: I am an AI agent testing a free API.');
  const res = await fetch(`https://text.pollinations.ai/prompt/${prompt}`);
  const text = await res.text();
  console.log(text);
}
test();
