const fs = require('fs');
const path = require('path');

const files = [
  'src/app/chapters/page.tsx',
  'src/app/characters/page.tsx',
  'src/app/chat/page.tsx',
  'src/app/community/page.tsx',
  'src/app/novels/page.tsx',
  'src/app/videos/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import
  content = content.replace(/import\s+MaintenanceGuard\s+from\s+['"]@\/components\/layout\/MaintenanceGuard['"];?\n?/g, '');

  // Remove <MaintenanceGuard> and </MaintenanceGuard>
  content = content.replace(/<MaintenanceGuard>\s*/g, '');
  content = content.replace(/\s*<\/MaintenanceGuard>/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
