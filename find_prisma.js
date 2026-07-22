const fs = require('fs');
const path = require('path');

function searchForPrisma(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      searchForPrisma(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('new PrismaClient()') && !fullPath.includes('src\\lib\\prisma.ts')) {
        console.log('FOUND IN:', fullPath);
      }
    }
  }
}

searchForPrisma(path.join(process.cwd(), 'src'));
