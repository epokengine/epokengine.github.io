import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../dist');
const files = fs.readdirSync(root, { recursive: true }).filter(f => f.endsWith('.html'));
const errors = [];
let checked = 0;
const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (!html.includes('<title>') || !html.includes('name="description"') || !html.includes('id="main"')) errors.push(`${file}: missing metadata or main target`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${file}: duplicate IDs`);
  for (const [, attr, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const href = decode(raw);
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
    const url = new URL(href, `https://uniqoengine.github.io/${file.replaceAll('\\', '/')}`);
    let target = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) { errors.push(`${file}: missing ${attr} ${href}`); continue; }
    checked++;
    if (url.hash && target.endsWith('.html')) {
      const content = fs.readFileSync(target, 'utf8');
      if (!content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) errors.push(`${file}: missing anchor ${href}`);
    }
  }
}
const search = JSON.parse(fs.readFileSync(path.join(root, 'assets/search.json'), 'utf8'));
for (const query of ['textures', 'collision', 'mcp', 'blueprint']) if (!search.some(d => `${d.title} ${d.text}`.toLowerCase().includes(query))) errors.push(`Search index missing ${query}`);
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!homepage.includes('id="blueprints"') || !homepage.includes('/media/docs/images/blueprint-editor.png')) errors.push('Homepage is missing the real Blueprint editor showcase');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${files.length} pages, ${checked} local links/assets and ${search.length} searchable guides.`);
