import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const file = new URL('../.env', import.meta.url);
try {
  writeFileSync(file, `# Local development only. Never commit this file.\nMIDNIGHT_NETWORK=local\nMIDNIGHT_PROOF_SERVER=http://127.0.0.1:6300\nVOICEPROOF_DATABASE_PASSWORD=${randomBytes(32).toString('hex')}\n`, { flag: 'wx', mode: 0o600 });
  console.log('Created .env with a local database password. No wallet or issuer keys were created.');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('Preserved existing .env. Check .env.example for required variables.');
}
