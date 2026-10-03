import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
let failures = 0;
function check(label, command, args) {
  console.log(`\n${label}`);
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', timeout: 15_000 });
  const ok = !result.error && result.status === 0;
  console.log(`${ok ? 'OK' : 'MISSING'} ${label}${result.error ? `: ${result.error.message}` : ''}`);
  if (!ok) failures++;
}
check('Node', process.execPath, ['--version']);
check('Compact CLI', `${root}.tools/bin/compact`, ['--version']);
check('Compact compiler', `${root}.tools/compactc/compactc.bin`, ['--version']);
check('Expected Compact runtime', `${root}.tools/compactc/compactc.bin`, ['--runtime-version']);
for (const name of ['typescript', '@midnight-ntwrk/midnight-js-contracts', '@midnight-ntwrk/midnight-js-protocol']) {
  try {
    require.resolve(name);
    console.log(`OK ${name}`);
  } catch {
    failures++;
    console.log(`MISSING ${name}: run npm ci`);
  }
}
check('Python verifier dependencies', `${root}.tools/venv/bin/python`, ['-m', 'pip', 'check']);
check('Docker Compose', 'docker', ['compose', 'version']);
check('Docker daemon', 'docker', ['info', '--format', '{{.ServerVersion}}']);
check('Compose', 'docker', ['compose', 'config', '--quiet']);
if (failures) console.log('See docs/development.md. Docker is required for the integration environment.');
process.exitCode = failures ? 1 : 0;
