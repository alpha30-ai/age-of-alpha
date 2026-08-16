import { PrismaClient } from '@prisma/client';
import https from 'https';

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
  if (!settings || !settings.geminiApiKey) {
    console.log('No key found in DB');
    return;
  }
  
  const apiKey = settings.geminiApiKey.trim();
  console.log('Found key starting with:', apiKey.substring(0, 10) + '...');
  
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${apiKey}`,
    method: 'GET',
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200) {
        const json = JSON.parse(data);
        const supportedModels = json.models
          .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
          .map((m: any) => m.name);
        console.log('Supported generateContent Models:', supportedModels.join(', '));
      } else {
        console.error('Error fetching models:', res.statusCode, data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.end();
}

main().catch(console.error).finally(() => prisma.$disconnect());
