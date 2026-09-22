import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { marked } from 'marked';
import { buildApiReference } from './api-reference.mjs';
import { buildFeatureExplorer, expandFeatureGuide, correctWebMarkdown } from './feature-explorer.mjs';
import { architectureSection } from './architecture-section.mjs';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'dist');
const content = path.join(root, 'content');
const assetHash = createHash('sha1');
for (const asset of ['site.css', 'site.js', 'gallery.js', 'feature-explorer.js', 'architecture.css']) assetHash.update(fs.readFileSync(path.join(root, 'assets', asset)));
const assetVersion = assetHash.digest('hex').slice(0, 12);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content-manifest.json'), 'utf8'));
// The released engine version, synced from the engine's own VERSION file, so the
// documentation and API reference always state the revision they describe.
const engineVersion = fs.readFileSync(path.join(content, 'VERSION'), 'utf8').trim();
const guideNotes = JSON.parse(fs.readFileSync(path.join(root, 'web-guide-notes.json'), 'utf8'));
const repo = manifest.repository;
const origin = 'https://epokengine.github.io';
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const groups = [
  ['Start here', [['getting-started', 'Getting started'], ['features', 'Complete feature catalog'], ['release-v0.4.0', "What's new in v0.4.0"], ['projects', 'Projects'], ['editor', 'The editor'], ['content-browser', 'Content Browser'], ['settings', 'Settings'], ['formats', 'File formats & migration']]],
  ['Create your world', [['blockout', 'Blockout modeling'], ['terrain', 'Terrain'], ['third-person', 'Third Person template'], ['worlds-2d', '2D worlds, 3D worlds & UI'], ['static-mesh-import', 'Importing models'], ['skeletal', 'Skeletal characters'], ['textures', 'Textures']]],
  ['Render & animate', [['lighting', 'Lighting & shadows'], ['environment-effects', 'Environment effects'], ['palette-animation', 'Palette animation']]],
  ['Build gameplay', [['actors', 'Actors & Components'], ['migration-actors', 'Existing projects & Actors'], ['scene-blueprints', 'Scene Blueprints'], ['blueprints-tutorial', 'Your first Blueprint'], ['blueprints', 'Blueprint reference'], ['lua-tutorial', 'Your first Lua class'], ['lua-scripting', 'Lua scripting reference'], ['scripting', 'C++ scripting'], ['gameplay-api', 'Gameplay API'], ['input-collision', 'Input & collision'], ['navigation', 'Navigation & agents'], ['runtime-services', 'Runtime services'], ['camera-resources', 'Cameras'], ['resources', 'Shared resources'], ['memory-card', 'Memory Card']]],
  ['Timelines & VFX', [['vfx-editor', 'Using the VFX editor'], ['timelines', 'Timeline reference'], ['sprites-particles', 'Sprites & particles'], ['blueprints-vfx-troubleshooting', 'Blueprint & VFX troubleshooting']]],
  ['Sound & interface', [['music-sequences', 'Audio playback & MIDI music'], ['native-music', 'Native music'], ['assets', 'Assets & audio'], ['hud', 'HUD & UI'], ['native-hud-preview', 'Procedural UI preview']]],
  ['Build, run & ship', [['iteration', 'Build, measure & iterate'], ['play', 'Play targets & loading'], ['performance', 'Performance'], ['runtime-performance', 'PSX runtime hot paths'], ['streaming', 'Geometry streaming'], ['runtime', 'Standalone runtime'], ['release-process', 'Release process']]],
  ['Extend & understand', [['lua-vm-runtime', 'Lua VM runtime'], ['mcp', 'AI / MCP'], ['architecture', 'Architecture'], ['testing', 'Testing']]],
  ['API reference', [['api', 'C++ API reference'], ['api/epok', 'Epok runtime API'], ['api/psyqo', 'PsyQo API']]],
  ['Project', [['license', 'License'], ['credits', 'Third-party notices'], ['runtime-credits', 'Runtime notices']]],
];
const special = { architecture: 'knowledge/architecture.md', resources: 'knowledge/maintainers/resources.md', testing: 'knowledge/maintainers/testing.md', runtime: 'runtime/README.md', 'release-v0.4.0': 'docs/releases/v0.4.0.md', api: 'docs/api/index.md', 'api/epok': 'docs/api/epok.md', 'api/psyqo': 'docs/api/psyqo.md', license: 'LICENSE', credits: 'THIRD_PARTY_NOTICES.md', 'runtime-credits': 'runtime/THIRD_PARTY_NOTICES.md' };
const docs = groups.flatMap(([group, entries]) => entries.map(([slug, label]) => ({ slug, label, group, file: special[slug] || `docs/${slug}.md`, api: slug === 'api' || slug.startsWith('api/') })));
const apiCatalog = JSON.parse(fs.readFileSync(path.join(content, 'docs/api/catalog.json'), 'utf8'));
const guideDocs = docs.filter(doc => !doc.api);
const webArticles = new Map([
  ['actors', 'src/gui.rs'], ['third-person', 'templates/ThirdPersonController.cpp'],
  ['worlds-2d', 'runtime/world2d.hpp'], ['scene-blueprints', 'src/editor.rs'],
  ['music-sequences', 'docs/assets.md'], ['native-hud-preview', 'docs/native-hud-preview.md'],
  ['iteration', 'docs/play.md'], ['lua-tutorial', 'docs/lua-scripting.md'],
]);
Object.assign(guideNotes, JSON.parse(fs.readFileSync(path.join(root, 'articles/guide-notes.json'), 'utf8')));
const noteExemptions = new Set(['license', 'credits', 'runtime-credits']);
for (const doc of docs) {
  if (!doc.api && !noteExemptions.has(doc.slug) && !guideNotes[doc.slug]) throw new Error(`Missing beginner guide notes for ${doc.slug}`);
}
const routes = new Map(docs.map(d => [d.file, `/docs/${d.slug}/`]));
for (const module of apiCatalog.modules) routes.set(`docs/api/${module.family}/${module.module}.md`, `/docs/api/${module.family}/${module.module}/`);
routes.set('README.md', '/');
function write(file, text) {
  if (file === 'index.html') text = text.replace('</head>', `<link rel="stylesheet" href="/assets/architecture.css?v=${assetVersion}"><script src="/assets/feature-explorer.js?v=${assetVersion}" defer></script></head>`);
  const dest = path.join(out, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, text);
}
function urlFor(href, file) {
  if (!href || /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return href;
  const [base, hash = ''] = href.split('#');
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), base));
  const suffix = hash ? `#${hash}` : '';
  if (routes.has(resolved)) return routes.get(resolved) + suffix;
  if (manifest.files.includes(resolved) && /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(resolved)) return `/media/${resolved}${suffix}`;
  return `${repo}/blob/${manifest.commit}/${resolved}${suffix}`;
}
function render(markdown, file) {
  const headings = [], counts = new Map();
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const html = this.parser.parseInline(tokens);
    const label = html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
    const base = label.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const n = counts.get(base) || 0; counts.set(base, n + 1);
    const id = base + (n ? `-${n}` : '');
    if (depth === 2 || depth === 3) headings.push({ id, label, depth });
    return `<h${depth} id="${esc(id)}">${html}</h${depth}>\n`;
  };
  renderer.link = function ({ href, title, tokens }) { return `<a href="${esc(urlFor(href, file))}"${title ? ` title="${esc(title)}"` : ''}>${this.parser.parseInline(tokens)}</a>`; };
  renderer.image = ({ href, text, title }) => `<img src="${esc(urlFor(href, file))}" alt="${esc(text)}" loading="lazy"${title ? ` title="${esc(title)}"` : ''}>`;
  renderer.html = ({ text }) => text.replace(/(src|href)="([^"]+)"/g, (_, attr, value) => `${attr}="${esc(urlFor(value, file))}"`);
  const html = marked.parse(markdown, { renderer, gfm: true });
  return { html, headings };
}
function guidePrimer(doc) {
  const note = guideNotes[doc.slug];
  if (!note) return '';
  const flow = note.flow.map((step, index) => `<li><span class="flow-number mono">${String(index + 1).padStart(2, '0')}</span><span>${esc(step)}</span></li>`).join('');
  const details = note.details.map(detail => `<li>${esc(detail)}</li>`).join('');
  return `<section class="guide-primer" aria-label="Beginner overview"><p class="eyebrow">START WITH THE BIG PICTURE</p><h2>What does this part of Epok do?</h2><p class="primer-lead">${esc(note.plain)}</p><aside class="mental-model"><p class="primer-label">A useful mental model</p><p>${esc(note.analogy)}</p></aside><ol class="concept-flow" aria-label="Feature flow">${flow}</ol><div class="primer-details"><h3>What is happening under the hood?</h3><ul>${details}</ul></div><p class="field-note"><strong>Field note:</strong> ${esc(note.tip)}</p></section>`;
}
function header(active = '') {
  return `<a class="skip" href="#main">Skip to content</a><header class="header"><div class="header-inner"><a class="brand" href="/" aria-label="Epok home"><img src="/media/resources/branding/epok.png" width="36" height="36" alt=""><span>Epok Engine</span></a><nav aria-label="Main navigation"><a href="/#features">Features</a><a href="/docs/" aria-label="Documentation" ${active === 'docs' ? 'aria-current="page"' : ''}>Documentation</a><a href="/docs/api/" ${active === 'api' ? 'aria-current="page"' : ''}>API Reference</a>${discordLink()}<a class="github" href="${repo}">GitHub <span aria-hidden="true">↗</span></a></nav></div></header>`;
}
function discordLink() { return '<a class="discord-link" href="https://discord.gg/2wEGxsVhKT" aria-label="Join the Epok Discord server"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.792 19.792 0 0 0-4.885-1.515c-.211.375-.457.88-.627 1.28a18.27 18.27 0 0 0-5.414 0 12.64 12.64 0 0 0-.636-1.28A19.736 19.736 0 0 0 3.87 4.37C.78 8.94-.058 13.4.362 17.8a19.897 19.897 0 0 0 5.993 3.03c.483-.66.914-1.359 1.284-2.095a12.99 12.99 0 0 1-2.022-.964c.17-.125.336-.255.496-.39 3.9 1.803 8.13 1.803 11.984 0 .163.135.33.265.496.39-.643.378-1.32.702-2.023.966.372.735.8 1.436 1.284 2.096a19.839 19.839 0 0 0 5.995-3.03c.5-5.102-.838-9.52-3.532-13.433ZM8.02 15.33c-1.183 0-2.153-1.084-2.153-2.417s.95-2.418 2.153-2.418c1.203 0 2.173 1.095 2.153 2.418 0 1.333-.95 2.417-2.153 2.417Zm7.955 0c-1.183 0-2.153-1.084-2.153-2.417s.95-2.418 2.153-2.418c1.203 0 2.173 1.095 2.153 2.418 0 1.333-.94 2.417-2.153 2.417Z"/></svg><span>Discord</span></a>'; }
function footer() { return `<footer class="footer"><a class="brand" href="/">Epok Engine<span class="footer-tag">Original hardware. Original worlds.</span></a><div><a href="/docs/license/">MIT license</a><a href="/docs/credits/">Credits</a>${discordLink()}<a href="${repo}">Source ↗</a></div><p>Independent homebrew software. Not affiliated with Sony Interactive Entertainment.</p></footer>`; }
function page(title, description, url, body, active = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${origin}${url}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin}${url}"><meta name="theme-color" content="#101214"><link rel="icon" type="image/png" href="/media/resources/branding/epok.png"><link rel="stylesheet" href="/assets/site.css?v=${assetVersion}"><script src="/assets/site.js?v=${assetVersion}" defer></script><script src="/assets/gallery.js?v=${assetVersion}" defer></script></head><body>${header(active)}${body}${footer()}</body></html>`;
}
if (fs.existsSync(out)) fs.rmSync(out, { recursive: true });
fs.mkdirSync(out, { recursive: true });
for (const file of manifest.files) if (/\.(png|jpg|jpeg|svg|webp|gif)$/i.test(file)) { const dest = path.join(out, 'media', file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(path.join(content, file), dest); }
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
const arrow = '<span aria-hidden="true">↗</span>';
const featureData = JSON.parse(fs.readFileSync(path.join(root, 'feature-updates.json'), 'utf8'));
const featureMarkdown = expandFeatureGuide(correctWebMarkdown(fs.readFileSync(path.join(content, 'docs/features.md'), 'utf8'), 'features'), featureData);
const explorer = buildFeatureExplorer({ markdown: featureMarkdown, featureData, manifest, esc, render });
write('assets/features.json', JSON.stringify(explorer.items));
const features = [
  ['01', 'Shape your world', 'A dockable Scene View, hierarchy, Inspector, transform gizmos and editable Blockout geometry.', 'blockout'],
  ['02', 'Browse real project files', 'A native Content Browser with search, collections, safe moves, recoverable trash and inline image, audio and model previews.', 'content-browser'],
  ['03', 'Bring your art', 'Import PNG textures, OBJ environments, FBX characters and WAV, MP3, FLAC or OGG audio into portable assets.', 'assets'],
  ['04', 'Connect your gameplay', 'Use reflected C++20 classes, typed Blueprint graphs or statically checked Lua. All three share the Actor model and native PSX runtime.', 'lua-tutorial'],
  ['05', 'Animate timelines and VFX', 'Build layered effects with presets, Q12 curves and bursts, then connect markers and completion to gameplay.', 'vfx-editor'],
  ['06', 'Play where you choose', 'Run the current scene or whole game in the embedded emulator, a separate window or a PSX through serial.', 'play'],
  ['07', 'Know where every byte went', 'Turn the linked ELF and selected assets into interactive budgets for RAM, VRAM, SPU, scratchpad and shipped files.', 'play'],
  ['08', 'Stream, package and export', 'Use bounded CD or PC geometry pages, package PS-X EXE or BIN/CUE, or export a standalone PsyQo project.', 'runtime'],
  ['09', 'Work with an assistant', 'Twenty-four optional local MCP tools cover guarded scene and Actor edits, assets, captures, builds and Play.', 'mcp'],
];
const editorGallery = `<section class="editor-shot editor-gallery" data-gallery aria-label="Epok Engine editor gallery" aria-roledescription="carousel">
<div class="window-bar"><span>Epok Engine / Editor</span><span class="live-label">REAL EDITOR CAPTURES</span></div>
<div class="gallery-stage">
<div data-slide data-title="Environment editing" role="group" aria-roledescription="slide" aria-label="1 of 3">
<a href="/assets/captures/epok-environment-editor.png" aria-label="Open the environment editor screenshot at full size"><img src="/assets/captures/epok-environment-editor.png" width="1436" height="932" alt="Epok Engine scene editor showing a textured environment, character, hierarchy and inspector" fetchpriority="high"></a>
</div>
<div data-slide data-title="Courtyard editing" role="group" aria-roledescription="slide" aria-label="2 of 3" hidden>
<a href="/assets/captures/epok-editor.png" aria-label="Open the courtyard editor screenshot at full size"><img src="/assets/captures/epok-editor.png" width="1600" height="1000" alt="Epok editor showing the courtyard, scene hierarchy and component inspector" decoding="async"></a>
</div>
<div data-slide data-title="Third Person arena" role="group" aria-roledescription="slide" aria-label="3 of 3" hidden>
<a href="/assets/captures/epok-third-person-editor.png" aria-label="Open the Third Person arena screenshot at full size"><img src="/assets/captures/epok-third-person-editor.png" width="1452" height="1068" alt="Epok Third Person arena in the editor: raised platforms, ramps, blue cubes, 3D/2D/UI modes, hierarchy and Content Browser" decoding="async" loading="lazy"></a>
</div>
<button type="button" class="gallery-arrow gallery-previous" data-gallery-arrow data-previous aria-label="Previous image" hidden>‹</button>
<button type="button" class="gallery-arrow gallery-next" data-gallery-arrow data-next aria-label="Next image" hidden>›</button>
</div>
<div class="gallery-footer"><p>Build the scene. Write the behaviour. Press Play.</p>
<div class="gallery-controls" data-gallery-controls hidden>
<span class="gallery-count" data-count aria-hidden="true">1 / 3</span>
<div class="gallery-dots" role="group" aria-label="Choose an image"><button type="button" data-go aria-label="Show environment editor" aria-pressed="true"></button><button type="button" data-go aria-label="Show courtyard editor" aria-pressed="false"></button><button type="button" data-go aria-label="Show Third Person arena" aria-pressed="false"></button></div>
<button type="button" class="gallery-rotation" data-rotation aria-label="Pause slideshow">Pause</button>
</div></div><span class="sr-only" data-status role="status" aria-live="polite" aria-atomic="true"></span>
</section>`;
const home = `<main id="main"><section class="hero wrap"><img class="hero-logo" src="/media/resources/branding/epok-lockup.png" width="1774" height="887" alt="Epok Engine"><div class="hero-top"><div><p class="eyebrow"><span class="status-dot"></span> ORIGINAL PLAYSTATION DEVELOPMENT</p><h1>Build worlds.<br><span>Make them PSX.</span></h1></div><div class="hero-intro"><p>A standalone visual editor.<br>Gameplay in C++20, Blueprints or Lua.<br>A native PlayStation runtime.</p><div class="actions"><a class="button primary" href="/docs/getting-started/">Get started <span aria-hidden="true">→</span></a><a class="text-link" href="/docs/">Explore the docs ${arrow}</a></div><p class="small muted">Windows x64 + macOS Apple Silicon + Linux x86_64 <span>·</span> Open source <span>·</span> Experimental</p></div></div>${editorGallery}</section><section id="features" class="section wrap"><div class="section-heading"><div><p class="eyebrow">THE WORKFLOW</p><h2>From an empty scene<br>to a world of your own.</h2></div><p>Author visually, work within PSX limits,<br>and run native MIPS code.</p></div><div class="features">${features.map(([n, title, text, slug]) => `<a class="feature" href="/docs/${slug}/"><span class="feature-number mono">${n}</span><h3>${title} ${arrow}</h3><p>${text}</p></a>`).join('')}</div></section><section class="showcase section wrap"><figure><img src="/media/docs/images/forest-dialogue.png" width="640" height="480" alt="Native PSX output with a sprite character in a textured forest and portrait dialogue HUD" loading="lazy"><figcaption>Demo under development. It will be included soon.</figcaption></figure><div><p class="eyebrow">MADE WITH EPOK</p><h2>Your world.<br>Your rules.</h2><p>Bring your ideas to life with Epok Engine. Shape the world, define how it plays, and make every detail your own.</p><div class="tags"><a href="/docs/textures/">Textures</a><a href="/docs/sprites-particles/">Sprites</a><a href="/docs/hud/">HUD</a></div></div></section><section class="section getting-started wrap"><div><p class="eyebrow">YOUR FIRST GAME</p><h2>Clone. Create. Play.</h2><p>Install the tools, open the Sample game template and bring your first scene to life.</p><a class="button primary" href="/docs/getting-started/">Installation guide <span aria-hidden="true">→</span></a></div><div class="terminal"><div class="window-bar"><span>PowerShell</span><span class="muted">Windows x64</span></div><pre><code>git clone https://github.com/epokengine/epok-engine.git Epok
cd Epok
powershell -ExecutionPolicy Bypass -File tools/setup.ps1
cargo run --locked</code></pre><p>Windows commands shown; <a href="/docs/getting-started/#install-and-run">macOS and Linux setup are documented too</a>.<br>Use a checkout path without spaces.</p></div></section><section class="status-note wrap"><span class="status-dot"></span><div><h3>Built in the open. Still evolving.</h3><p>Epok is experimental. Builds and emulator execution are validated; physical-console validation is pending. Original code is MIT licensed. <a href="/docs/#limits">Read the current limits →</a></p></div></section></main>`;
const blueprintShowcase = `<section id="blueprints" class="section wrap"><div class="section-heading"><div><p class="eyebrow">C++ / BLUEPRINTS / LUA</p><h2>Write it. Wire it.<br>Run it on PSX.</h2></div><p>Three authoring paths, one reflected Actor model.<br>Choose native code, typed graphs or statically checked Lua.</p></div><figure class="editor-shot"><div class="window-bar"><span>Epok Engine / Blueprint Editor</span><span class="live-label">REAL EDITOR CAPTURE</span></div><a href="/assets/captures/epok-blueprints.png" aria-label="Open the full-size Epok Blueprint editor capture"><img src="/assets/captures/epok-blueprints.png" width="1581" height="917" alt="Epok Blueprint editor showing components, inherited variables, typed connections, branches and a Delay node" loading="lazy"></a><figcaption>Blueprint authoring shown here. C++20, Blueprints and Lua classes share reflected parents, properties, events and the same native PlayStation runtime.</figcaption></figure><div class="tags" aria-label="Gameplay authoring guides"><a href="/docs/lua-tutorial/">Your first Lua class</a><a href="/docs/blueprints-tutorial/">Your first Blueprint</a><a href="/docs/scripting/">C++ scripting</a><a href="/docs/lua-scripting/#execution-modes">Three Lua execution modes</a></div><a class="text-link blueprint-doc-link" href="/docs/lua-tutorial/">Start the Lua tutorial ${arrow}</a><p class="small muted blueprint-platform">Blueprint reflection and authoring are available on Windows x64 and Linux x86_64. Lua uses the same reflected registry and can compile ahead of time or run in one of two bounded VM modes.</p></section>`;
const sceneShowcase = `<section id="scene-view" class="showcase section wrap"><figure><a href="/assets/captures/epok-scene-view.png" aria-label="Open the full-size Scene View capture"><img src="/assets/captures/epok-scene-view.png" width="960" height="600" alt="Epok Scene View displaying the courtyard with textured geometry, characters and particles" loading="lazy"></a><figcaption>Scene View captured directly from the Epok renderer.</figcaption></figure><div><p class="eyebrow">SCENE VIEW</p><h2>See your world<br>take shape.</h2><p>Arrange objects, adjust lighting, and preview your world as you build.</p><a class="text-link" href="/docs/editor/">Explore the editor ${arrow}</a></div></section>`;
const memoryShowcase = `<section id="memory-analyzer" class="memory-showcase section wrap"><div class="section-heading"><div><p class="eyebrow">MEMORY ANALYZER / HARDWARE BUDGETS</p><h2>Know where every<br>byte went.</h2></div><p>A black screen is not a memory profiler.<br>Epok gives you the report before the surprise.</p></div><figure class="memory-shot"><a href="/assets/captures/epok-memory-analyzer.png" aria-label="Open the full-size Epok Memory Analyzer capture"><img src="/assets/captures/epok-memory-analyzer.png" width="1436" height="929" alt="Epok Memory Analyzer showing the Main RAM capacity bar, proportional allocation treemap and byte-level resource table" loading="lazy"></a><figcaption>Real editor capture: 1.92 MiB of the PlayStation's 2 MiB main RAM attributed across runtime pools, scene geometry, code, textures and other linked allocations.</figcaption></figure><div class="memory-highlights"><article><span class="mono">01 / FIVE VIEWS</span><h3>Every PSX memory space</h3><p>Inspect 2 MiB Main RAM, per-scene VRAM, 512 KiB SPU audio, the 1 KiB scratchpad and the files that actually ship.</p></article><article><span class="mono">02 / DRILL DOWN</span><h3>From rectangle to resource</h3><p>Click through the treemap and allocation table to linked symbols, byte counts, scene references and supported source assets.</p></article><article><span class="mono">03 / BUILD-BOUND</span><h3>Numbers you can trace</h3><p>Reports come from the linked ELF and selected staged assets. Source or profile changes mark old results as stale instead of quietly lying.</p></article></div><div class="memory-actions"><a class="button primary" href="/docs/play/#memory-analyzer">Explore the Memory Analyzer <span aria-hidden="true">→</span></a><p class="small muted">Measures static build-time allocations. Runtime heap, stack and scene-transition peaks are not measured.</p></div></section>`;
const homeWithBlueprints = home
  .replace('Explore the docs', 'See every feature')
  .replace('href="/docs/">See every feature', 'href="/#feature-explorer">See every feature')
  .replace('THE WORKFLOW', 'THE COMPLETE WORKFLOW')
  .replace('From an empty scene<br>to a world of your own.', 'From an empty scene<br>to original hardware.')
  .replace('Author visually, work within PSX limits,<br>and run native MIPS code.', 'Author visually, inspect every budget,<br>and run native MIPS code.')
  .replace('</div></section><section class="showcase section wrap">', '</div><p class="feature-catalog-link"><a class="text-link" href="/docs/features/">Browse the source-mapped feature catalog ↗</a></p></section><section class="showcase section wrap">')
  .replace(/<section id="features"[\s\S]*?<\/section>/, explorer.html)
  .replace('physical-console validation is pending', 'broader physical-console validation is ongoing')
  .replace('<section class="showcase section wrap">', `${architectureSection()}${sceneShowcase}${blueprintShowcase}${memoryShowcase}<section class="showcase section wrap">`);
write('index.html', page('Epok Engine — Build games for the original PlayStation', 'A standalone visual editor and native PSX runtime. Build worlds and create gameplay with C++20, Blueprints or Lua for the original PlayStation.', '/', homeWithBlueprints));
const searchItems = [];
for (let i = 0; i < guideDocs.length; i++) {
  const doc = guideDocs[i];
  let md = webArticles.has(doc.slug) ? fs.readFileSync(path.join(root, 'articles', `${doc.slug}.md`), 'utf8') : fs.readFileSync(path.join(content, doc.file), 'utf8');
  md = doc.slug === 'features' ? featureMarkdown : correctWebMarkdown(md, doc.slug);
  if (doc.slug === 'license') md = '# License\n\n```text\n' + md + '\n```\n';
  const { html, headings } = render(md, doc.file);
  const expandedHtml = html.replace('</h1>', `</h1>${guidePrimer(doc)}`);
  const note = guideNotes[doc.slug];
  const noteText = note ? [note.plain, note.analogy, ...note.flow, ...note.details, note.tip].join(' ') : '';
  const searchableMarkdown = md.replace(/```[\s\S]*?```/g, '');
  const plain = `${noteText} ${searchableMarkdown}`.replace(/<[^>]*>/g, '').replace(/[#*`\[\]]/g, '').replace(/\s+/g, ' ').trim();
  searchItems.push({ title: doc.label, group: doc.group, url: `/docs/${doc.slug}/`, text: plain, api: Boolean(doc.api) });
  const sidebar = `<aside class="sidebar" aria-label="Documentation navigation"><a class="docs-home" href="/docs/">Documentation <span aria-hidden="true">↗</span></a><a class="search-shortcut" href="/docs/#search">Find a guide <span aria-hidden="true">⌕</span></a>${groups.map(([group, entries]) => `<div class="nav-group"><p>${group}</p>${entries.map(([slug, label]) => `<a href="/docs/${slug}/"${slug === doc.slug ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}</div>`).join('')}</aside>`;
  const prev = guideDocs[i - 1], next = guideDocs[i + 1];
  const pager = `<nav class="pager" aria-label="Adjacent guides">${prev ? `<a href="/docs/${prev.slug}/"><span>← Previous</span>${esc(prev.label)}</a>` : '<span></span>'}${next ? `<a href="/docs/${next.slug}/"><span>Next →</span>${esc(next.label)}</a>` : ''}</nav>`;
  const tocHeadings = headings;
  const body = `<div class="docs-layout">${sidebar}<main id="main" class="doc-main"><div class="doc-top"><a href="/docs/">Documentation</a><span>/</span><span>${esc(doc.group)}</span></div><div class="mobile-doc-nav"><a href="/docs/">← All guides</a><details><summary>On this page</summary>${tocHeadings.map(h => `<a href="#${esc(h.id)}">${esc(h.label)}</a>`).join('')}</details></div><article class="prose">${expandedHtml}</article><div class="source-note">Documents Epok <strong>v${engineVersion}</strong> · <a href="${repo}/blob/${manifest.commit}/${webArticles.get(doc.slug) || doc.file}">View technical source ${arrow}</a> · ${manifest.commit.slice(0, 7)}</div>${pager}</main><aside class="toc" aria-label="On this page"><p>ON THIS PAGE</p>${tocHeadings.map(h => `<a class="depth-${h.depth}" href="#${esc(h.id)}">${esc(h.label)}</a>`).join('')}</aside></div>`;
  write(`docs/${doc.slug}/index.html`, page(`${doc.label} — Epok Docs`, `${doc.label}: guides and reference for the Epok PlayStation game engine.`, `/docs/${doc.slug}/`, body, 'docs'));
}
const apiBuild = buildApiReference({ catalog: apiCatalog, manifest, repo, write, page, esc, arrow, engineVersion });
searchItems.push(...apiBuild.searchItems);
const docGroups = groups.map(([group, entries], i) => `<section class="guide-group"><p class="eyebrow">${String(i + 1).padStart(2, '0')}</p><h2>${group}</h2>${entries.map(([slug, label]) => `<a href="/docs/${slug}/">${esc(label)} <span aria-hidden="true">→</span></a>`).join('')}</section>`).join('');
const index = `<main id="main" class="wrap docs-index"><p class="eyebrow">EPOK DOCUMENTATION</p><h1>Build your first world.<br><span>Then go deeper.</span></h1><p class="lead">Guided workflows, C++ / Blueprint / Lua gameplay and native APIs for the original PlayStation.</p><form class="search-form" role="search" action="/docs/"><label for="search">Search the documentation</label><div class="search-box"><span aria-hidden="true">⌕</span><input id="search" name="q" type="search" placeholder="Try Lua, Blueprints, textures or collision…" autocomplete="off"><button type="reset">Clear</button></div></form><p class="search-status small muted" role="status" aria-live="polite"></p><div class="search-results" hidden></div><div class="guide-grid">${docGroups}</div><section id="limits" class="limits"><p class="eyebrow">BEFORE YOU BUILD</p><h2>Know the current limits.</h2><ul><li><strong>Experimental on Windows x64, macOS Apple Silicon and Linux x86_64.</strong> Builds and emulator execution are verified. Blueprint reflection and authoring are available on Windows and Linux; macOS does not yet include that toolchain. Broader physical-console validation is ongoing.</li><li><strong>Lua is a bounded profile.</strong> <code>epok-lua</code> v1 is statically checked and intentionally omits general Lua features such as coroutines, metatables, standard libraries and dynamic tables.</li><li><strong>Two skeletal playback formats.</strong> Rigid GTE and compressed baked vertex frames are available per model, and triangles carry per-corner texture coordinates. Source skinning stays rigid at one bone per vertex; blended skin weights and animation blending remain future work.</li><li><strong>Navigation is version 1.</strong> <a href="/docs/navigation/">NavLite</a> bakes flat surfaces, slopes, stair treads and obstacles into a bounded graph with authored jump and climb links. It is a walking graph with a fixed console search budget, not a general pathfinding or steering system.</li><li><strong>Native PC play is for iteration.</strong> It runs the same generated C++ gameplay on the same fixed clock, which makes it useful for authoring, but it is not a console validation and does not reproduce PSX rendering.</li><li><strong>Focused editing tools.</strong> Blueprint graphs/templates, timelines, effects, Blockout geometry and MCP scene batches have Undo/Redo. Actor multiselection remains future work.</li><li><strong>PSX rendering constraints.</strong> Intersecting polygons can still produce sorting artifacts. Capacity limits are not frame-rate guarantees.</li><li><strong>Bounded simulation and resources.</strong> Fixed 60 Hz steps, conservative AABB collision and resident data that must fit PSX RAM. Optional <a href="/docs/streaming/">editable-mesh geometry streaming</a> uses bounded CD pages; required reads may stall rendering and restart XA music. It is off by default, not general-purpose map or texture streaming.</li><li><strong>Release artifacts.</strong> Tagged releases publish a Windows x64 portable archive. macOS and Linux development editors are built from source.</li></ul><p class="small muted">This documentation and the C++ API reference describe <strong>Epok v${engineVersion}</strong>, from snapshot <a href="${repo}/tree/${manifest.commit}">${manifest.commit.slice(0, 7)}</a>. Earlier releases are listed in the <a href="${repo}/releases">release notes</a>.</p></section></main>`;
const learningPaths = `<section class="learning-paths" aria-labelledby="learning-paths"><h2 id="learning-paths">Learn by doing</h2><div class="guide-grid"><section class="guide-group"><p class="eyebrow">01 / VISUAL GAMEPLAY</p><h3>Build your first Blueprint</h3><p>Find the editor controls, connect typed pins and inspect a running Actor.</p><a href="/docs/blueprints-tutorial/">Start the Blueprint tutorial <span aria-hidden="true">→</span></a><a href="/docs/blueprints/">Keep the reference nearby <span aria-hidden="true">→</span></a></section><section class="guide-group"><p class="eyebrow">02 / SCRIPTED GAMEPLAY</p><h3>Build your first Lua class</h3><p>Create an Actor, expose Inspector properties, move it in Tick and choose how the same source runs on PSX.</p><a href="/docs/lua-tutorial/">Start the Lua tutorial <span aria-hidden="true">→</span></a><a href="/docs/lua-scripting/">Open the complete reference <span aria-hidden="true">→</span></a></section><section class="guide-group"><p class="eyebrow">03 / VISUAL EFFECTS</p><h3>Create and animate an effect</h3><p>Choose layers, tune emission, edit curves and preview a repeatable effect.</p><a href="/docs/vfx-editor/">Open the VFX editor guide <span aria-hidden="true">→</span></a><a href="/docs/timelines/">Explore scene timelines <span aria-hidden="true">→</span></a></section><section class="guide-group"><p class="eyebrow">04 / PUT IT TOGETHER</p><h3>Move a character through a world</h3><p>Sculpt ground, bake a walking graph and let an agent cross it while your player runs, jumps and lands.</p><a href="/docs/terrain/">Sculpt a terrain <span aria-hidden="true">→</span></a><a href="/docs/navigation/">Bake navigation <span aria-hidden="true">→</span></a></section></div></section>`;
const indexWithPaths = index
  .replace('Physical-console validation is pending.', 'Broader physical-console validation is ongoing; the music guide explains the scoped hardware evidence.')
  .replace('Guided workflows, C++ / Blueprint / Lua gameplay and native APIs for the original PlayStation.', 'Guided tutorials, C++ / Blueprint / Lua gameplay, native APIs and a source-mapped catalog of every implemented feature.')
  .replace('<form class="search-form"', `${learningPaths}<form class="search-form"`);
write('docs/index.html', page('Documentation — Epok', 'Learn Epok: installation, editor workflows, assets, Blueprint visual scripting, C++ and the native PlayStation runtime.', '/docs/', indexWithPaths, 'docs'));
write('assets/search.json', JSON.stringify(searchItems));
write('assets/api-search.json', JSON.stringify(apiBuild.searchItems));
write('404.html', page('Page not found — Epok', 'Find your way back to the Epok documentation.', '/404.html', '<main id="main" class="wrap not-found"><p class="eyebrow">404 / OUTSIDE THE SCENE</p><h1>This page is missing.</h1><p>The guide may have moved. Find it in the documentation.</p><a class="button primary" href="/docs/">Browse the docs →</a></main>'));
write('.nojekyll', '');
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/docs/', ...guideDocs.map(d => `/docs/${d.slug}/`), ...apiBuild.urls].map(url => `<url><loc>${origin}${url}</loc></url>`).join('')}</urlset>`);
console.log(`Built homepage, documentation index, ${guideDocs.length} guides, ${apiBuild.urls.length} API pages and 404 page.`);
