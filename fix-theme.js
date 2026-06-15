const fs = require('fs');
const path = require('path');

const replacements = {
  '#06060E': '#050505', // bg-base
  '#0F0F23': '#0A0A0A', // bg-surface
  '#1A1A2E': '#111111', // bg-card
  '#222240': '#1A1A1A', // bg-card-hover
  '#7C3AED': '#06D6A0', // primary
  '#8B5CF6': '#48E5C2', // primary-light
  '#6D28D9': '#04A77B', // primary-dark
  '#F72585': '#118AB2', // accent-pink -> secondary blue
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [oldHex, newHex] of Object.entries(replacements)) {
      // regex for case insensitive match
      const regex = new RegExp(oldHex, 'gi');
      content = content.replace(regex, newHex);
    }
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
