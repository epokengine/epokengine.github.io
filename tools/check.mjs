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
    const url = new URL(href, `https://epokengine.github.io/${file.replaceAll('\\', '/')}`);
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
const primerExemptions = new Set(['license', 'credits', 'runtime-credits']);
for (const item of search) {
  const slug = item.url.split('/').filter(Boolean).at(-1);
  if (item.api || primerExemptions.has(slug)) continue;
  const route = item.url.replace(/^\/+|\/+$/g, '');
  const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
  const primer = html.indexOf('class="guide-primer"');
  if (primer < 0 || !html.includes('class="mental-model"') || !html.includes('class="concept-flow"') || !html.includes('class="field-note"')) errors.push(`${slug}: missing beginner explanation, mental model, diagram or field note`);
  if (html.indexOf('<h1') > primer) errors.push(`${slug}: beginner overview appears before the guide title`);
}
for (const query of ['textures', 'collision', 'mcp', 'blueprint', 'vfx', 'marker', 'cancellation']) if (!search.some(d => `${d.title} ${d.text}`.toLowerCase().includes(query))) errors.push(`Search index missing ${query}`);
const apiSearch = JSON.parse(fs.readFileSync(path.join(root, 'assets/api-search.json'), 'utf8'));
for (const query of ['epok::raycast', 'psyqo::gpu', 'sendprimitive', 'memory card']) if (!apiSearch.some(d => `${d.title} ${d.text}`.toLowerCase().includes(query))) errors.push(`API search index missing ${query}`);
const catalog = JSON.parse(fs.readFileSync(path.join(root, '../content/docs/api/catalog.json'), 'utf8'));
const callableGroups = new Set(catalog.callables.map(item => `${item.family}|${item.qualified}`)).size;
const propertyGroups = new Set(catalog.properties.map(item => `${item.family}|${item.qualified}`)).size;
const namespaces = new Set([...catalog.types, ...catalog.callables, ...catalog.properties].map(item => `${item.family}|${item.namespace || item.family}`)).size;
const expectedApiPages = catalog.modules.length + catalog.types.length + callableGroups + propertyGroups + namespaces + 3;
if (apiSearch.length !== expectedApiPages) errors.push(`Expected ${expectedApiPages} API search entries, found ${apiSearch.length}`);
if (!fs.readFileSync(path.join(root, 'docs/api/index.html'), 'utf8').includes('data-api-search')) errors.push('API homepage is missing dedicated symbol search');
for (const item of apiSearch) {
  const route = item.url.replace(/^\/+|\/+$/g, '');
  const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
  if (!['Index', 'API family', 'Namespace'].includes(item.kind) && !html.includes('class="api-code"')) errors.push(`${item.title}: missing code example`);
  if (['Function', 'Function template', 'Method', 'Constructor', 'Destructor', 'Conversion operator', 'Field', 'Variable', 'Enum value'].includes(item.kind) && !html.includes('Trade-offs and warnings')) errors.push(`${item.title}: missing trade-offs and warnings`);
}
const documentationIndex = fs.readFileSync(path.join(root, 'docs/index.html'), 'utf8');
for (const slug of ['features', 'content-browser', 'play', 'blueprints-tutorial', 'vfx-editor', 'timelines', 'spell-tutorial', 'blueprints-vfx-troubleshooting']) {
  if (!documentationIndex.includes(`/docs/${slug}/`) || !search.some(d => d.url === `/docs/${slug}/`)) errors.push(`Learning guide is not discoverable: ${slug}`);
}
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [slug, image] of [['vfx-editor', 'vfx-editor.png'], ['spell-tutorial', 'blueprint-fireball.png']]) {
  if (!fs.readFileSync(path.join(root, `docs/${slug}/index.html`), 'utf8').includes(`/media/docs/images/${image}`)) errors.push(`Guide is missing its editor capture: ${slug}`);
}
if (!homepage.includes('id="blueprints"') || !homepage.includes('/docs/blueprints/')) errors.push('Homepage is missing Blueprint documentation access');
if (!homepage.includes('/docs/features/') || !homepage.includes('/docs/content-browser/') || !homepage.includes('/docs/play/')) errors.push('Homepage is missing access to the feature catalog, Content Browser or Play guides');
if (!homepage.includes('<a href="/docs/api/"')) errors.push('Main navigation is missing the API Reference link');
if (!homepage.includes('/media/resources/branding/epok-lockup.png')) errors.push('Homepage is missing the Epok Engine wordmark');
if (!homepage.includes('Linux x86_64')) errors.push('Homepage is missing Linux x86_64 support');
if (!documentationIndex.includes('Linux x86_64')) errors.push('Documentation index is missing Linux x86_64 support');
const gettingStarted = fs.readFileSync(path.join(root, 'docs/getting-started/index.html'), 'utf8');
if (!gettingStarted.includes('setup-linux.sh')) errors.push('Getting started is missing the Linux setup command');
for (const file of [...files, 'assets/search.json']) {
  const built = fs.readFileSync(path.join(root, file), 'utf8');
  if (/uniqu?o|unicore|eraengine/i.test(built)) errors.push(`${file}: obsolete engine branding`);
  for (const obsolete of ['Windows x64 and macOS Apple Silicon', 'Windows x64 + macOS Apple Silicon <span>', 'Linux provisioning is not implemented']) {
    if (built.includes(obsolete)) errors.push(`${file}: obsolete two-platform claim: ${obsolete}`);
  }
}
for (const image of ['epok-editor.png', 'epok-scene-view.png', 'epok-blueprints.png']) {
  if (!homepage.includes(`/assets/captures/${image}`)) errors.push(`Homepage is missing ${image}`);
}
if (!homepage.includes('/media/docs/images/forest-dialogue.png')) errors.push('Homepage must retain the ForestTest gameplay capture');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${files.length} pages, ${checked} local links/assets and ${search.length} searchable guides.`);
