// Copy the public site into dist/ for Cloudflare to serve. Wrangler runs this before every deploy.
// Everything at the repository root is public except the files listed here.
import { cpSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const repoOnly = new Set([
  '.git', '.gitignore', '.gitlab-ci.yml', '.nojekyll', '.wrangler',
  'AGENTS.md', 'README.md', 'CNAME', 'dist', 'node_modules', 'scripts', 'wrangler.toml',
]);

rmSync(dist, { recursive: true, force: true });
for (const name of readdirSync(root)) {
  if (!repoOnly.has(name)) cpSync(join(root, name), join(dist, name), { recursive: true });
}
console.log(`Copied the site to ${dist}`);
