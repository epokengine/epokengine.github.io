import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'dist');
const content = path.join(root, 'content');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content-manifest.json'), 'utf8'));
const repo = manifest.repository;
const origin = 'https://epokengine.github.io';
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const groups = [
  ['Start here', [['getting-started', 'Getting started'], ['projects', 'Projects'], ['editor', 'The editor'], ['settings', 'Settings'], ['formats', 'File formats & migration']]],
  ['Create your world', [['blockout', 'Blockout modeling'], ['third-person', 'Third Person template'], ['static-mesh-import', 'Importing models'], ['skeletal', 'Skeletal characters'], ['textures', 'Textures']]],
  ['Render & animate', [['lighting', 'Lighting & shadows'], ['sprites-particles', 'Sprites & particles'], ['environment-effects', 'Environment effects'], ['palette-animation', 'Palette animation'], ['streaming', 'Geometry streaming']]],
  ['Build gameplay', [['blueprints', 'Blueprints'], ['scripting', 'C++ scripting'], ['input-collision', 'Input & collision'], ['runtime-services', 'Runtime services'], ['camera-resources', 'Cameras'], ['resources', 'Shared resources'], ['memory-card', 'Memory Card']]],
  ['Sound & interface', [['assets', 'Assets & audio'], ['hud', 'HUD & UI']]],
  ['Extend & understand', [['mcp', 'AI / MCP'], ['architecture', 'Architecture'], ['performance', 'Performance'], ['testing', 'Testing'], ['runtime', 'Standalone runtime'], ['demo', '2.5D example']]],
  ['Project', [['license', 'License'], ['credits', 'Third-party notices'], ['runtime-credits', 'Runtime notices']]],
];
const special = { architecture: 'knowledge/architecture.md', resources: 'knowledge/maintainers/resources.md', testing: 'knowledge/maintainers/testing.md', runtime: 'runtime/README.md', demo: 'examples/rpg-2-5d-demo/README.md', license: 'LICENSE', credits: 'THIRD_PARTY_NOTICES.md', 'runtime-credits': 'runtime/THIRD_PARTY_NOTICES.md' };
const docs = groups.flatMap(([group, entries]) => entries.map(([slug, label]) => ({ slug, label, group, file: special[slug] || `docs/${slug}.md` })));
const routes = new Map(docs.map(d => [d.file, `/docs/${d.slug}/`]));
routes.set('README.md', '/');
function write(file, text) { const dest = path.join(out, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, text); }
function urlFor(href, file) {
  if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return href;
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
function header(active = '') {
  return `<a class="skip" href="#main">Skip to content</a><header class="header"><div class="header-inner"><a class="brand" href="/" aria-label="Epok home"><img src="/media/resources/branding/epok.png" width="36" height="36" alt=""><span>Epok Engine</span></a><nav aria-label="Main navigation"><a href="/#features">Features</a><a href="/docs/" ${active === 'docs' ? 'aria-current="page"' : ''}>Documentation</a><a class="github" href="${repo}">GitHub <span aria-hidden="true">↗</span></a></nav></div></header>`;
}
function footer() { return `<footer class="footer"><a class="brand" href="/">Epok Engine<span class="footer-tag">Original hardware. Original worlds.</span></a><div><a href="/docs/license/">MIT license</a><a href="/docs/credits/">Credits</a><a href="${repo}">Source ↗</a></div><p>Independent homebrew software. Not affiliated with Sony Interactive Entertainment.</p></footer>`; }
function page(title, description, url, body, active = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${origin}${url}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin}${url}"><meta name="theme-color" content="#101214"><link rel="icon" type="image/png" href="/media/resources/branding/epok.png"><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script></head><body>${header(active)}${body}${footer()}</body></html>`;
}
if (fs.existsSync(out)) fs.rmSync(out, { recursive: true });
fs.mkdirSync(out, { recursive: true });
for (const file of manifest.files) if (/\.(png|jpg|jpeg|svg|webp|gif)$/i.test(file)) { const dest = path.join(out, 'media', file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(path.join(content, file), dest); }
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
const arrow = '<span aria-hidden="true">↗</span>';
const features = [
  ['01', 'Shape your world', 'A dockable scene editor, transform gizmos and editable Blockout geometry. Build levels from the first platform up.', 'blockout'],
  ['02', 'Bring your art', 'Import PNG textures, OBJ environments and FBX characters. Preview rigid skeletal animation before you build.', 'skeletal'],
  ['03', 'Connect your gameplay', 'Typed Blueprint graphs or reflected C++20 behaviours. Inherit classes, override events and compile both to native MIPS code.', 'blueprints'],
  ['04', 'Make it feel alive', 'Vertex lighting, sprites, particles, fog and palette animation. SPU sound effects, XA music and a native HUD.', 'sprites-particles'],
  ['05', 'Play, inspect, export', 'An integrated PCSX-Redux Game view with Pause and Step. Export a PS-X executable, BIN/CUE or standalone project.', 'runtime'],
  ['06', 'Work with an assistant', 'Optional local MCP tools for scenes, assets, scripts, captures and builds. Connect your own compatible assistant.', 'mcp'],
];
const home = `<main id="main"><section class="hero wrap"><img class="hero-logo" src="/media/resources/branding/epok-lockup.png" width="1774" height="887" alt="Epok Engine"><div class="hero-top"><div><p class="eyebrow"><span class="status-dot"></span> ORIGINAL PLAYSTATION DEVELOPMENT</p><h1>Build worlds.<br><span>Make them PSX.</span></h1></div><div class="hero-intro"><p>A standalone visual editor.<br>A native PlayStation runtime.<br>Your next game starts here.</p><div class="actions"><a class="button primary" href="/docs/getting-started/">Get started <span aria-hidden="true">→</span></a><a class="text-link" href="/docs/">Explore the docs ${arrow}</a></div><p class="small muted">Windows x64 + macOS Apple Silicon <span>·</span> Open source <span>·</span> Experimental</p></div></div><figure class="editor-shot"><div class="window-bar"><span class="window-dots" aria-hidden="true">● ● ●</span><span>Epok Editor <span class="muted">/ 2.5D courtyard</span></span><span class="live-label">REAL EDITOR CAPTURE</span></div><img src="/media/docs/images/epok-editor.png" width="1440" height="900" alt="Epok editor showing the 2.5D courtyard, scene hierarchy and component inspector" fetchpriority="high"><figcaption><span>Build the scene. Write the behaviour. Press Play.</span><span class="mono">Rust + Dear ImGui / C++20 + PsyQo</span></figcaption></figure></section><section id="features" class="section wrap"><div class="section-heading"><div><p class="eyebrow">THE WORKFLOW</p><h2>From an empty scene<br>to a world of your own.</h2></div><p>Author visually, work within PSX limits,<br>and run native MIPS code.</p></div><div class="features">${features.map(([n, title, text, slug]) => `<a class="feature" href="/docs/${slug}/"><span class="feature-number mono">${n}</span><h3>${title} ${arrow}</h3><p>${text}</p></a>`).join('')}</div></section><section class="showcase section wrap"><figure><img src="/media/docs/images/forest-dialogue.png" width="640" height="480" alt="Native PSX output with a sprite character in a textured forest and portrait dialogue HUD" loading="lazy"><figcaption>Native 640 × 480 output in PCSX-Redux. AI-generated artwork prepared for PSX textures.</figcaption></figure><div><p class="eyebrow">MADE WITH EPOK</p><h2>A small console.<br>A world to explore.</h2><p>Combine textured environments, animated sprites and dialogue UI. This scene runs as native PlayStation code in the emulator.</p><a class="text-link" href="/docs/demo/">Explore the included 2.5D demo ${arrow}</a><div class="tags"><a href="/docs/textures/">Textures</a><a href="/docs/sprites-particles/">Sprites</a><a href="/docs/hud/">HUD</a></div></div></section><section class="section getting-started wrap"><div><p class="eyebrow">YOUR FIRST GAME</p><h2>Clone. Create. Play.</h2><p>Install the tools, open the Sample game template and bring your first scene to life.</p><a class="button primary" href="/docs/getting-started/">Installation guide <span aria-hidden="true">→</span></a></div><div class="terminal"><div class="window-bar"><span>PowerShell</span><span class="muted">Windows x64</span></div><pre><code>git clone https://github.com/franadoriv/epok-engine.git Epok
cd Epok
powershell -ExecutionPolicy Bypass -File tools/setup.ps1
cargo run --locked</code></pre><p>Windows commands shown; <a href="/docs/getting-started/#install-and-run">macOS setup is documented too</a>.<br>Use a checkout path without spaces.</p></div></section><section class="status-note wrap"><span class="status-dot"></span><div><h3>Built in the open. Still evolving.</h3><p>Epok is experimental. Builds and emulator execution are validated; physical-console validation is pending. Original code is MIT licensed. <a href="/docs/#limits">Read the current limits →</a></p></div></section></main>`;
const blueprintShowcase = `<section id="blueprints" class="section wrap"><div class="section-heading"><div><p class="eyebrow">BLUEPRINTS / NATIVE GAMEPLAY</p><h2>Wire the logic.<br>Keep it native.</h2></div><p>Visual classes, typed connections and reusable entity templates.<br>Compiled C++ for the same PlayStation runtime.</p></div><a class="button primary" href="/docs/blueprints/">Explore Blueprints ${arrow}</a><div class="tags" aria-label="Blueprint capabilities"><a href="/docs/blueprints/#inheritance-and-identity">C++ / Blueprint inheritance</a><a href="/docs/blueprints/#execution-and-types">Typed visual scripting</a><a href="/docs/blueprints/#entity-templates-and-construction">Reusable entity templates</a><a href="/docs/blueprints/#debugging-and-iteration">Node breakpoints &amp; stepping</a></div><p class="small muted blueprint-platform">Blueprint reflection and authoring currently require Windows x64. General macOS editor support does not yet include the Blueprint toolchain.</p></section>`;
const homeWithBlueprints = home.replace('<section class="showcase section wrap">', `${blueprintShowcase}<section class="showcase section wrap">`);
write('index.html', page('Epok Engine — Build games for the original PlayStation', 'A standalone visual editor and native PSX runtime. Build worlds and create gameplay with Blueprints or C++ for the original PlayStation.', '/', homeWithBlueprints));
const searchItems = [];
for (let i = 0; i < docs.length; i++) {
  const doc = docs[i];
  let md = fs.readFileSync(path.join(content, doc.file), 'utf8');
  if (doc.slug === 'license') md = '# License\n\n```text\n' + md + '\n```\n';
  const { html, headings } = render(md, doc.file);
  const plain = md.replace(/```[\s\S]*?```/g, '').replace(/<[^>]*>/g, '').replace(/[#*`\[\]]/g, '').replace(/\s+/g, ' ').trim();
  searchItems.push({ title: doc.label, group: doc.group, url: `/docs/${doc.slug}/`, text: plain });
  const sidebar = `<aside class="sidebar" aria-label="Documentation navigation"><a class="docs-home" href="/docs/">Documentation <span aria-hidden="true">↗</span></a><a class="search-shortcut" href="/docs/#search">Find a guide <span aria-hidden="true">⌕</span></a>${groups.map(([group, entries]) => `<div class="nav-group"><p>${group}</p>${entries.map(([slug, label]) => `<a href="/docs/${slug}/"${slug === doc.slug ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}</div>`).join('')}</aside>`;
  const prev = docs[i - 1], next = docs[i + 1];
  const pager = `<nav class="pager" aria-label="Adjacent guides">${prev ? `<a href="/docs/${prev.slug}/"><span>← Previous</span>${esc(prev.label)}</a>` : '<span></span>'}${next ? `<a href="/docs/${next.slug}/"><span>Next →</span>${esc(next.label)}</a>` : ''}</nav>`;
  const body = `<div class="docs-layout">${sidebar}<main id="main" class="doc-main"><div class="doc-top"><a href="/docs/">Documentation</a><span>/</span><span>${esc(doc.group)}</span></div><div class="mobile-doc-nav"><a href="/docs/">← All guides</a><details><summary>On this page</summary>${headings.filter(h => h.depth === 2).map(h => `<a href="#${esc(h.id)}">${esc(h.label)}</a>`).join('')}</details></div><article class="prose">${html}</article><div class="source-note">From the published engine documentation · <a href="${repo}/blob/${manifest.commit}/${doc.file}">View source ${arrow}</a></div>${pager}</main><aside class="toc" aria-label="On this page"><p>ON THIS PAGE</p>${headings.map(h => `<a class="depth-${h.depth}" href="#${esc(h.id)}">${esc(h.label)}</a>`).join('')}</aside></div>`;
  write(`docs/${doc.slug}/index.html`, page(`${doc.label} — Epok Docs`, `${doc.label}: guides and reference for the Epok PlayStation game engine.`, `/docs/${doc.slug}/`, body, 'docs'));
}
const docGroups = groups.map(([group, entries], i) => `<section class="guide-group"><p class="eyebrow">${String(i + 1).padStart(2, '0')}</p><h2>${group}</h2>${entries.map(([slug, label]) => `<a href="/docs/${slug}/">${esc(label)} <span aria-hidden="true">→</span></a>`).join('')}</section>`).join('');
const index = `<main id="main" class="wrap docs-index"><p class="eyebrow">EPOK DOCUMENTATION</p><h1>Build your first world.<br><span>Then go deeper.</span></h1><p class="lead">Setup, workflows and native APIs for the original PlayStation.</p><form class="search-form" role="search" action="/docs/"><label for="search">Search the documentation</label><div class="search-box"><span aria-hidden="true">⌕</span><input id="search" name="q" type="search" placeholder="Try Blueprints, textures or collision…" autocomplete="off"><button type="reset">Clear</button></div></form><p class="search-status small muted" role="status" aria-live="polite"></p><div class="search-results" hidden></div><div class="guide-grid">${docGroups}</div><section id="limits" class="limits"><p class="eyebrow">BEFORE YOU BUILD</p><h2>Know the current limits.</h2><ul><li><strong>Experimental, Windows x64 and macOS Apple Silicon.</strong> Builds and emulator execution are verified. Blueprint reflection and authoring currently require Windows x64. Physical-console validation is pending.</li><li><strong>Rigid skeletal animation.</strong> Skeletal textures, blended skin weights and animation blending remain future work.</li><li><strong>Focused editing tools.</strong> Blueprint graphs/templates, Blockout geometry and MCP scene batches have Undo/Redo. Entity multiselection remains future work.</li><li><strong>PSX rendering constraints.</strong> Intersecting polygons can still produce sorting artifacts. Capacity limits are not frame-rate guarantees.</li><li><strong>Bounded simulation and resources.</strong> Fixed 60 Hz steps, conservative AABB collision and resident data that must fit PSX RAM. Optional <a href="/docs/streaming/">editable-mesh geometry streaming</a> uses bounded CD pages; required reads may stall rendering and restart XA music. It is off by default, not general-purpose map or texture streaming.</li><li><strong>Build from source.</strong> A release build creates the editor executable; portable application packaging is not yet provided.</li></ul><p class="small muted">Documentation snapshot: <a href="${repo}/tree/${manifest.commit}">${manifest.commit.slice(0, 7)}</a>. Updated from committed engine documentation.</p></section></main>`;
write('docs/index.html', page('Documentation — Epok', 'Learn Epok: installation, editor workflows, assets, Blueprint visual scripting, C++ and the native PlayStation runtime.', '/docs/', index, 'docs'));
write('assets/search.json', JSON.stringify(searchItems));
write('404.html', page('Page not found — Epok', 'Find your way back to the Epok documentation.', '/404.html', '<main id="main" class="wrap not-found"><p class="eyebrow">404 / OUTSIDE THE SCENE</p><h1>This page is missing.</h1><p>The guide may have moved. Find it in the documentation.</p><a class="button primary" href="/docs/">Browse the docs →</a></main>'));
write('.nojekyll', '');
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/docs/', ...docs.map(d => `/docs/${d.slug}/`)].map(url => `<url><loc>${origin}${url}</loc></url>`).join('')}</urlset>`);
console.log(`Built homepage, documentation index, ${docs.length} guides and 404 page.`);
