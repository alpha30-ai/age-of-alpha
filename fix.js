const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Solid background buttons
  content = content.replace(/bg-gradient-to-r from-\[var\(--theme-primary\)\] to-\[var\(--theme-secondary\)\]/g, 'bg-magma hover:bg-magma-light');
  content = content.replace(/bg-\[var\(--theme-primary\)\]/g, 'bg-magma hover:bg-magma-light');
  
  // Text colors
  content = content.replace(/text-\[var\(--theme-primary\)\]/g, 'text-magma');
  content = content.replace(/text-\[var\(--theme-secondary\)\]/g, 'text-milky-blue');
  
  // Border colors
  content = content.replace(/border-\[var\(--theme-primary\)\]/g, 'border-magma');
  
  // Shadows
  content = content.replace(/shadow-\[0_0_20px_rgba\(var\(--theme-primary-rgb\),0\.3\)\]/g, 'shadow-[0_0_20px_rgba(230,74,25,0.3)] shadow-magma/30');
  content = content.replace(/shadow-\[0_0_15px_rgba\(var\(--theme-primary-rgb\),0\.2\)\]/g, 'shadow-[0_0_15px_rgba(230,74,25,0.2)] shadow-magma/20');

  // Accents
  content = content.replace(/accent-\[var\(--theme-primary\)\]/g, 'accent-magma');

  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
}

const filesToFix = [
  'src/app/admin/chapters/page.tsx',
  'src/app/admin/chapters/new/page.tsx',
  'src/app/admin/chapters/[id]/page.tsx',
  'src/app/admin/videos/page.tsx',
  'src/app/admin/videos/new/page.tsx',
  'src/app/admin/videos/[id]/page.tsx',
  'src/app/admin/characters/CharacterClient.tsx',
  'src/components/ui/FileUploadInput.tsx',
  'src/app/admin/AdminSidebar.tsx'
];

filesToFix.forEach(file => {
  replaceInFile(path.join(process.cwd(), file));
});
