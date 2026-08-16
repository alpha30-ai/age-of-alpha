const fs = require('fs');
const https = require('https');

// Extract API Key
const envContent = fs.readFileSync('.env', 'utf8');
const keyMatch = envContent.match(/GOOGLE_API_KEY\s*=\s*"?([^"\n]+)"?/);
if (!keyMatch) {
  console.log('No key found');
  process.exit(1);
}
const apiKey = keyMatch[1].trim();

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
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name);
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
