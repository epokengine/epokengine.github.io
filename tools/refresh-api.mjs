// Import generated documentation, never runtime binaries or uncommitted gameplay.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const engine = path.resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('Usage: node tools/refresh-api.mjs <isolated-engine-worktree>');
const manifestPath = path.join(root, 'content-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const tree = revision => execFileSync('git', ['rev-parse', `${revision}^{tree}`], {cwd:engine,encoding:'utf8'}).trim();
if (tree('HEAD') !== tree(manifest.commit)) throw new Error('API source tree does not match the synced documentation revision');
const coverage = JSON.parse(fs.readFileSync(path.join(engine, 'docs/api/coverage.json'), 'utf8'));
if (coverage.modules.some(module => module.diagnostics.length)) throw new Error('Resolve API extraction diagnostics before publishing');
const files = fs.readdirSync(path.join(engine, 'docs/api'), {recursive:true}).filter(file => /\.(md|json)$/.test(file));
for (const file of files) {
  const relative = `docs/api/${file.replaceAll('\\', '/')}`;
  const dest = path.join(root, 'content', relative);
  fs.mkdirSync(path.dirname(dest), {recursive:true});
  fs.copyFileSync(path.join(engine, 'docs/api', file), dest);
  if (!manifest.files.includes(relative)) manifest.files.push(relative);
}
manifest.files.sort();
manifest.api_generation = {
  source_commit: manifest.commit,
  generator: 'tools/generate-api-reference.py',
  generator_sha256: createHash('sha256').update(fs.readFileSync(path.join(engine, 'tools/generate-api-reference.py'))).digest('hex'),
  fixture: 'tools/api-fixtures/debug-hud.hh',
  fixture_sha256: createHash('sha256').update(fs.readFileSync(path.join(root, 'tools/api-fixtures/debug-hud.hh'))).digest('hex'),
  note: 'Regenerated from the pinned source tree with all Debug HUD declarations enabled for documentation only. See the website audit notes.',
};
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Imported ${files.length} generated API documents from ${manifest.commit.slice(0,7)}.`);
