const fs = require('fs');
const path = require('path');

const dirToScan = [
  path.join(__dirname, '..', 'src', 'components')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Backgrounds
  content = content.replace(/bg-\[#050505\]/g, 'bg-abyss');
  content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-stone-dark');
  content = content.replace(/bg-\[#111\]/g, 'bg-stone');
  content = content.replace(/bg-\[#020202\]/g, 'bg-abyss');
  content = content.replace(/bg-\[#000000\]/g, 'bg-abyss');
  content = content.replace(/from-\[#050505\]/g, 'from-abyss');
  content = content.replace(/via-\[#050505\]/g, 'via-abyss');
  content = content.replace(/to-\[#050505\]/g, 'to-abyss');
  content = content.replace(/from-\[#111\]/g, 'from-stone');
  content = content.replace(/from-\[#020202\]/g, 'from-abyss');
  content = content.replace(/via-\[#020202\]/g, 'via-abyss');
  
  // Text colors
  content = content.replace(/text-white/g, 'text-silver-ash');
  content = content.replace(/hover:text-white/g, 'hover:text-silver-ash');
  content = content.replace(/group-hover:text-white/g, 'group-hover:text-silver-ash');
  content = content.replace(/from-white/g, 'from-silver-ash');
  content = content.replace(/from-\[#fff\]/g, 'from-silver-ash');
  content = content.replace(/to-\[#555\]/g, 'to-silver-ash-light');
  
  // Borders
  content = content.replace(/border-white\/10/g, 'border-silver-ash/10');
  content = content.replace(/border-white\/5/g, 'border-silver-ash/5');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

dirToScan.forEach(dir => walkDir(dir));
