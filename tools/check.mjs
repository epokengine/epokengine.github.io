import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../dist');
const files = fs.readdirSync(root, { recursive: true }).filter(f => f.endsWith('.html'));
const errors = [];
const engineRepository = 'https://github.com/epokengine/epok-engine';
const contentManifest = JSON.parse(fs.readFileSync(path.join(root, '../content-manifest.json'), 'utf8'));
if (contentManifest.repository !== engineRepository) errors.push('Engine repository URL is not the current organization URL');
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
for (const query of ['textures', 'collision', 'mcp', 'blueprint', 'lua', 'vfx', 'marker', 'cancellation']) if (!search.some(d => `${d.title} ${d.text}`.toLowerCase().includes(query))) errors.push(`Search index missing ${query}`);
const apiSearch = JSON.parse(fs.readFileSync(path.join(root, 'assets/api-search.json'), 'utf8'));
for (const query of ['epok::raycast', 'psyqo::gpu', 'sendprimitive', 'memory card']) if (!apiSearch.some(d => `${d.title} ${d.text}`.toLowerCase().includes(query))) errors.push(`API search index missing ${query}`);
const catalog = JSON.parse(fs.readFileSync(path.join(root, '../content/docs/api/catalog.json'), 'utf8'));
const callableGroups = new Set(catalog.callables.map(item => `${item.family}|${item.qualified}`)).size;
const propertyGroups = new Set(catalog.properties.map(item => `${item.family}|${item.qualified}`)).size;
const namespaces = new Set([...catalog.types, ...catalog.callables, ...catalog.properties].map(item => `${item.family}|${item.namespace || item.family}`)).size;
const expectedApiPages = catalog.modules.length + catalog.types.length + callableGroups + propertyGroups + namespaces + 3;
if (apiSearch.length !== expectedApiPages) errors.push(`Expected ${expectedApiPages} API search entries, found ${apiSearch.length}`);
const apiHomepage = fs.readFileSync(path.join(root, 'docs/api/index.html'), 'utf8');
if (!apiHomepage.includes('data-api-search')) errors.push('API homepage is missing dedicated symbol search');
if (!apiHomepage.includes('data-api-navigation')) errors.push('API homepage is missing the complete navigation tree');
const apiNavigation = JSON.parse(fs.readFileSync(path.join(root, 'assets/api-navigation.json'), 'utf8'));
const navigationNamespaces = apiNavigation.families.flatMap(family => family.namespaces);
const navigationTypes = navigationNamespaces.flatMap(namespace => namespace.types);
const navigationMembers = navigationNamespaces.flatMap(namespace => [...namespace.functions, ...namespace.properties, ...namespace.types.flatMap(type => type.members)]);
if (apiNavigation.families.length !== 2) errors.push(`Expected 2 API families in navigation, found ${apiNavigation.families.length}`);
if (navigationNamespaces.length !== namespaces) errors.push(`Expected ${namespaces} namespaces in navigation, found ${navigationNamespaces.length}`);
if (navigationTypes.length !== catalog.types.length) errors.push(`Expected ${catalog.types.length} types in navigation, found ${navigationTypes.length}`);
if (navigationMembers.length !== callableGroups + propertyGroups) errors.push(`Expected ${callableGroups + propertyGroups} members in navigation, found ${navigationMembers.length}`);
if (new Set([...navigationTypes, ...navigationMembers].map(item => item.url)).size !== catalog.types.length + callableGroups + propertyGroups) errors.push('API navigation has missing or duplicate symbol routes');
for (const item of apiSearch) {
  const route = item.url.replace(/^\/+|\/+$/g, '');
  const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
  if (!['Index', 'API family', 'Namespace'].includes(item.kind) && !html.includes('class="api-code"')) errors.push(`${item.title}: missing code example`);
  if (['Function', 'Function template', 'Method', 'Constructor', 'Destructor', 'Conversion operator', 'Field', 'Variable', 'Enum value'].includes(item.kind) && !html.includes('Trade-offs and warnings')) errors.push(`${item.title}: missing trade-offs and warnings`);
}
const documentationIndex = fs.readFileSync(path.join(root, 'docs/index.html'), 'utf8');
for (const slug of ['features', 'release-v0.4.0', 'content-browser', 'play', 'blueprints-tutorial', 'lua-tutorial', 'lua-scripting', 'lua-vm-runtime', 'vfx-editor', 'timelines', 'terrain', 'navigation', 'blueprints-vfx-troubleshooting']) {
  if (!documentationIndex.includes(`/docs/${slug}/`) || !search.some(d => d.url === `/docs/${slug}/`)) errors.push(`Learning guide is not discoverable: ${slug}`);
}
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!homepage.includes(`href="${engineRepository}"`) || !homepage.includes(`git clone ${engineRepository}.git Epok`)) errors.push('Homepage source and clone links must use the current engine repository');
const architectureSection = homepage.match(/<section id="architecture"[\s\S]*?<\/section>/)?.[0] || '';
for (const required of ['architecture-diagram', 'architecture-flow', 'Epok Editor', 'Reflect. Cook. Build.', 'Epok Runtime', 'PsyQo / native MIPS', 'NEXT SIGNAL / UNDISCLOSED', 'PSX is the supported game target today;', '/docs/architecture/', 'architecture-caption']) if (!architectureSection.includes(required)) errors.push(`Architecture diagram missing ${required}`);
if (/N64|Nintendo|Sega|Saturn|Dreamcast|GameCube|PS2/i.test(architectureSection)) errors.push('Architecture teaser must not disclose other console names');
if ((architectureSection.match(/class="architecture-stage /g) || []).length !== 3) errors.push('Architecture diagram must retain its three real pipeline stages');
const featureItems = JSON.parse(fs.readFileSync(path.join(root, 'assets/features.json'), 'utf8'));
const updates = JSON.parse(fs.readFileSync(path.join(root, '../feature-updates.json'), 'utf8'));
if (featureItems.length < 180 || (homepage.match(/data-feature data-category=/g) || []).length !== featureItems.length) errors.push('Feature explorer has missing static entries');
if (new Set(featureItems.map(item => item.id)).size !== featureItems.length) errors.push('Feature explorer contains duplicate IDs');
if (featureItems.filter(item => item.fresh).length !== updates.items.length) errors.push('Feature explorer is missing new source-mapped capabilities');
for (const item of featureItems) if (!item.url || !item.sourceUrl || !item.description || !item.category) errors.push(`Incomplete feature entry: ${item.title}`);
for (const required of ['data-feature-query', 'data-feature-category', 'data-feature-new', 'data-feature-reset', 'data-feature-empty', 'aria-label="Scrollable feature results"', '/assets/feature-explorer.js', '<noscript>']) if (!homepage.includes(required)) errors.push(`Missing feature explorer affordance: ${required}`);
const sourceFeatureDoc = fs.readFileSync(path.join(root, '../content/docs/features.md'), 'utf8');
const sourceEntryCount = (sourceFeatureDoc.split('## Known boundaries')[0].match(/^- \*\*/gm) || []).length;
if (featureItems.filter(item => !item.fresh).length !== sourceEntryCount + 7 + 5 + 2) errors.push('A committed feature bullet, CLI family or validation capability was omitted');
for (const slug of ['actors', 'migration-actors', 'worlds-2d', 'scene-blueprints', 'lua-tutorial', 'lua-scripting', 'lua-vm-runtime', 'release-v0.4.0', 'music-sequences', 'native-hud-preview', 'iteration', 'third-person']) {
  if (!documentationIndex.includes(`/docs/${slug}/`) || !search.some(item => item.url === `/docs/${slug}/`)) errors.push(`New guide not discoverable: ${slug}`);
}
for (const item of ['epok::Actor2D', 'epok::SceneScriptActor', 'epok::Camera2D', 'epok::debug_hud::State']) if (!apiSearch.some(entry => entry.title === item)) errors.push(`New API type not indexed: ${item}`);
const coverage = JSON.parse(fs.readFileSync(path.join(root, '../content/docs/api/coverage.json'), 'utf8'));
if (coverage.modules.some(module => module.diagnostics.length)) errors.push('Published API extraction contains diagnostics');
for (const area of ['<header class="header">', '<footer class="footer">']) {
  const html = homepage.slice(homepage.indexOf(area)).split(area.startsWith('<header') ? '</header>' : '</footer>')[0];
  if (!html.includes('https://discord.gg/2wEGxsVhKT') || !html.includes('aria-label="Join the Epok Discord server"') || !html.includes('<svg')) errors.push(`Discord icon/link missing from ${area}`);
}
if ((homepage.match(/data-slide data-title=/g) || []).length !== 3 || !homepage.includes('aria-label="3 of 3"') || !homepage.includes('epok-third-person-editor.png')) errors.push('Homepage gallery must retain both earlier slides and include the Third Person capture');
for (const [slug, obsolete] of [['editor', 'an Epok C++ input API is not implemented yet'], ['editor', 'Adding and removing components arrives in a later'], ['features', 'Auto compile'], ['features', 'Component add/remove and actor rename/duplicate/delete are not yet'], ['features', 'there is no Lua gameplay VM'], ['features', 'Non-native/Lua gameplay execution'], ['third-person', 'template does not attach a character controller']]) {
  if (fs.readFileSync(path.join(root, `docs/${slug}/index.html`), 'utf8').includes(obsolete)) errors.push(`Obsolete claim still visible in ${slug}: ${obsolete}`);
}
for (const [slug, image] of [['vfx-editor', 'vfx-editor.png']]) {
  if (!fs.readFileSync(path.join(root, `docs/${slug}/index.html`), 'utf8').includes(`/media/docs/images/${image}`)) errors.push(`Guide is missing its editor capture: ${slug}`);
}
if (!homepage.includes('id="blueprints"') || !homepage.includes('/docs/blueprints/')) errors.push('Homepage is missing Blueprint documentation access');
if (!homepage.includes('C++ / BLUEPRINTS / LUA') || !homepage.includes('Gameplay in C++20, Blueprints or Lua') || !homepage.includes('/docs/lua-tutorial/') || !homepage.includes('/docs/lua-scripting/')) errors.push('Homepage is missing first-class C++, Blueprint and Lua gameplay messaging');
if (!homepage.includes('id="memory-analyzer"') || !homepage.includes('/assets/captures/epok-memory-analyzer.png') || !homepage.includes('/docs/play/#memory-analyzer')) errors.push('Homepage is missing the Memory Analyzer feature showcase');
if (!homepage.includes('2 MiB Main RAM') || !homepage.includes('512 KiB SPU audio') || !homepage.includes('Runtime heap, stack and scene-transition peaks are not measured')) errors.push('Memory Analyzer showcase is missing its budgets or measurement limitation');
if (!homepage.includes('/docs/features/') || !homepage.includes('/docs/content-browser/') || !homepage.includes('/docs/play/')) errors.push('Homepage is missing access to the feature catalog, Content Browser or Play guides');
const luaTutorial = fs.readFileSync(path.join(root, 'docs/lua-tutorial/index.html'), 'utf8');
for (const required of ['Your first Lua class', 'Spinner:tick', 'Native C++', 'Lua VM — bytecode', 'Lua VM — source', 'FastSpinner.super.tick', 'Common mistakes']) if (!luaTutorial.includes(required)) errors.push(`Lua tutorial is missing ${required}`);
if (!homepage.includes('<a href="/docs/api/"')) errors.push('Main navigation is missing the API Reference link');
if (!homepage.includes('/media/resources/branding/epok-lockup.png')) errors.push('Homepage is missing the Epok Engine wordmark');
if (!homepage.includes('Linux x86_64')) errors.push('Homepage is missing Linux x86_64 support');
if (!documentationIndex.includes('Linux x86_64')) errors.push('Documentation index is missing Linux x86_64 support');
const gettingStarted = fs.readFileSync(path.join(root, 'docs/getting-started/index.html'), 'utf8');
if (!gettingStarted.includes('setup-linux.sh')) errors.push('Getting started is missing the Linux setup command');
for (const file of [...files, 'assets/search.json', 'assets/api-search.json', 'assets/api-navigation.json', 'assets/features.json']) {
  const built = fs.readFileSync(path.join(root, file), 'utf8');
  if (built.includes('github.com/franadoriv/epok-engine')) errors.push(`${file}: obsolete engine repository URL`);
  if (/uniqu?o|unicore|eraengine/i.test(built)) errors.push(`${file}: obsolete engine branding`);
  for (const obsolete of ['Windows x64 and macOS Apple Silicon', 'Windows x64 + macOS Apple Silicon <span>', 'Linux provisioning is not implemented']) {
    if (built.includes(obsolete)) errors.push(`${file}: obsolete two-platform claim: ${obsolete}`);
  }
}
for (const image of ['epok-editor.png', 'epok-scene-view.png', 'epok-blueprints.png', 'epok-memory-analyzer.png']) {
  if (!homepage.includes(`/assets/captures/${image}`)) errors.push(`Homepage is missing ${image}`);
}
if (!homepage.includes('/media/docs/images/forest-dialogue.png')) errors.push('Homepage must retain the ForestTest gameplay capture');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${files.length} pages, ${checked} local links/assets and ${search.length} searchable guides.`);
