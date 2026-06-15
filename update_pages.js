const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Yuvraj/Desktop/OppurtunityAI/src/app';
const files = ['privacy', 'terms', 'dpa', 'privacy-audit', 'api-status'].map(f => path.join(dir, f, 'page.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-3xl md:text-5xl font-black text-white/g, 'text-4xl md:text-6xl font-black text-[#06D6A0]');
  content = content.replace(/text-xl font-bold text-white/g, 'text-2xl font-bold text-[#06D6A0]');
  content = content.replace(/text-sm leading-relaxed/g, 'text-lg leading-relaxed');
  content = content.replace(/text-sm text-slate-500/g, 'text-base text-slate-500');
  fs.writeFileSync(file, content);
});

let cssPath = path.join(dir, 'globals.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('::selection')) {
  cssContent += '\n\n::selection {\n  background-color: var(--accent-green);\n  color: #000;\n}\n';
  fs.writeFileSync(cssPath, cssContent);
}
console.log("Updates applied successfully.");
