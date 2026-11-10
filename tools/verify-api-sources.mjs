// Verify the checked-in API snapshot against committed engine and SDK blobs.
// This is read-only and does not run the generator or touch an active build.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

if (!process.argv[2]) throw new Error('Usage: node tools/verify-api-sources.mjs <engine-checkout>');
const root = path.resolve(import.meta.dirname, '..');
const engine = path.resolve(process.argv[2]);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content-manifest.json'), 'utf8'));
const coverage = JSON.parse(fs.readFileSync(path.join(root, 'content/docs/api/coverage.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'content/docs/api/catalog.json'), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
// The generator hashes working-tree bytes, including Git's Windows line endings.
const matchesHash = (bytes, expected) =>
  sha(bytes) === expected || sha(Buffer.from(bytes.toString('utf8').replace(/\r?\n/g, '\r\n'), 'utf8')) === expected;
const blob = (cwd, revision, file) => execFileSync('git', ['show', `${revision}:${file}`], { cwd, maxBuffer: 16 * 1024 * 1024 });
const errors = [];
const sourceLines = new Map();
const descriptors = new Map(catalog.modules.map(module => [`${module.family}|${module.header}`, module]));
if (descriptors.size !== catalog.modules.length || coverage.modules.length !== catalog.modules.length) errors.push('Catalog and coverage module sets disagree');
for (const module of coverage.modules) {
  const key = `${module.family}|${module.header}`;
  const descriptor = descriptors.get(key);
  if (!descriptor) { errors.push(`${key}: missing catalog module`); continue; }
  for (const group of ['types', 'callables', 'properties']) {
    const count = catalog[group].filter(item => item.family === module.family && item.module === descriptor.module).length;
    // Type summaries include forward declarations; catalog.types keeps the
    // preferred definition once. Callable and property counts are comparable.
    if (group === 'types') {
      if (count > descriptor.types) errors.push(`${key}: indexed types exceed extracted declarations`);
    } else if (count !== module[group] || count !== descriptor[group]) errors.push(`${key}: ${group} count disagrees with extracted coverage`);
  }
  if (module.diagnostics.length) errors.push(`${module.family}/${module.header}: extraction diagnostics`);
  if (module.family === 'epok') {
    const bytes = blob(engine, manifest.commit, `runtime/${module.header}`);
    if (descriptor.source !== `runtime/${module.header}`) errors.push(`${key}: runtime source path mismatch`);
    if (!matchesHash(bytes, module.source_sha256)) errors.push(`${module.header}: runtime source hash mismatch`);
    sourceLines.set(key, bytes.toString('utf8').split(/\r?\n/).length);
  } else if (module.family === 'psyqo') {
    const marker = `/blob/${coverage.nugget_revision}/`;
    if (!descriptor?.source.includes(marker)) { errors.push(`${module.header}: SDK revision mismatch`); continue; }
    const bytes = blob(path.join(engine, 'third_party/nugget'), coverage.nugget_revision, descriptor.source.split(marker)[1]);
    if (!matchesHash(bytes, module.source_sha256)) errors.push(`${module.header}: SDK source hash mismatch`);
    sourceLines.set(key, bytes.toString('utf8').split(/\r?\n/).length);
  } else errors.push(`Unknown API family: ${module.family}`);
}
for (const group of ['types', 'callables', 'properties']) {
  if (catalog.totals[group] !== catalog[group].length) errors.push(`${group}: catalog total mismatch`);
  for (const symbol of catalog[group]) {
    const key = `${symbol.family}|${symbol.header}`;
    const descriptor = descriptors.get(key);
    if (!descriptor || symbol.source !== descriptor.source || symbol.module !== descriptor.module) errors.push(`${symbol.qualified}: inconsistent source module`);
    if (!Number.isInteger(symbol.line) || symbol.line < 1 || symbol.line > (sourceLines.get(key) || 0)) errors.push(`${symbol.qualified}: source line outside pinned header`);
  }
}
if (catalog.nugget_revision !== coverage.nugget_revision) errors.push('Catalog and coverage disagree on SDK revision');
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Verified ${coverage.modules.length} API modules against engine ${manifest.commit.slice(0, 7)} and Nugget ${coverage.nugget_revision.slice(0, 7)}.`);
