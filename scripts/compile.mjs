import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { delimiter, resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
// The upstream 0.31.1 wrapper leaves dirname unquoted and fails on paths with spaces.
const compiler = resolve(root, '.tools/compactc/compactc.bin');
const args = process.argv.slice(2);
if (args.some((arg) => arg !== '--skip-zk')) {
  throw new Error('Usage: node scripts/compile.mjs [--skip-zk]');
}
const result = spawnSync(compiler, [
  ...args, 'contracts/counter.compact', 'contracts/managed/counter',
], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    XDG_CACHE_HOME: resolve(root, '.tools/cache'),
    PATH: `${resolve(root, '.tools/compactc')}${delimiter}${process.env.PATH ?? ''}`,
  },
});
if (result.error) console.error('Install Compact with: bash scripts/setup-compact.sh', result.error.message);
process.exit(result.status ?? 1);
