import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const steps = [
  ['run', 'check'],
  ['run', 'build'],
  ['run', 'site:assemble'],
  ['run', 'site:links']
];

for (const args of steps) {
  console.log(`\n==> ${npmCmd} ${args.join(' ')}`);
  const res = spawnSync(npmCmd, args, {
    cwd: v6Root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }
  });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

console.log('\nOK : chaîne verify complète réussie.');
