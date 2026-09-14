import { marked } from 'marked';

// Web-only corrections stay outside the committed-engine snapshot. Keep evidence
// and the reviewed commit in notes/feature-audit-2026-09-14.md.
export function correctWebMarkdown(markdown, slug) {
  let md = markdown.replaceAll('\r\n', '\n');
  if (slug === 'features') {
    md = md.replace('Relevant changes invalidate or restart\n  Auto compile without blocking the UI;', 'Relevant changes invalidate stale builds without automatically invoking the PSX compiler;');
    md = md.replace('layout in the editor\'s 2D mode', 'layout in the editor\'s UI mode');
    md = md.replace('Component add/remove and actor rename/duplicate/delete are not yet in\n  the Inspector.', 'Actor rename/duplicate/delete/reparent and compatible component add/remove are implemented in Hierarchy/Inspector. Cross-domain conversion is not offered.');
    md = md.replace('Collision is conservative AABB overlap/sweep with triggers, not a rigid-body\n  physics engine.', 'Collision includes conservative AABB overlap/sweep, triggers and walkable X/Z ramp-height surfaces, not a rigid-body physics engine. The native 2D toolkit adds box/circle overlap helpers with conservative sweeps.');
    md = md.replace('no 2D physics beyond axis-aligned colliders, raycasts, sliding movement and\n  triggers.', 'no general 2D rigid-body solver beyond the bounded collision toolkit.');
    md = md.replace('Physical-console timing,\n  controllers, serial paths on every host and real Memory Card media still need\n  hardware validation.', 'A short sequenced-music hardware smoke test is recorded, but broad physical-console timing, controllers, serial paths on every host and real Memory Card media still need validation.');
  }
  if (slug === 'editor') {
    md = md.replace('The 2D world. Camera2D authoring arrives in a later release; the mode already lists this map\'s 2D actors in the Hierarchy', 'World2D Actor placement: grid, pan/zoom, labeled footprints, topmost picking and drag movement. See [2D worlds](worlds-2d.md) for the rendering limits');
    md = md.replace('an editable Active checkbox and a read-only list\nof its components and authored properties. Adding and removing components arrives in a later\nrelease.', 'an editable Active checkbox, compatible Add/Remove Component controls and editable reflected properties with override markers. Required roots and inherited components are protected.');
    md = md.replace('Opening an embedded scene Blueprint for editing arrives in a later release.', 'Open the embedded graph from Map Settings; see [Scene Blueprints](scene-blueprints.md).');
    md = md.replace('The sample Spinner does not use them, and an Epok C++ input API is not implemented yet.', 'The sample Spinner does not use them. Native gameplay can use the [input API](input-collision.md); the updated [Third Person template](third-person.md) includes a controller.');
    md = md.replace('Entity activation is displayed as a disabled placeholder and does not affect the runtime.', 'Runtime activation affects rendering, audio and collision participation; the Actor Inspector exposes an editable Active control.');
  }
  if (slug === 'assets') {
    md = md.replace('Physical PSX measurements remain pending.', 'For the later SoundFont path, a short physical-console smoke measurement is now recorded; see [MIDI and SoundFont music](music-sequences.md). This does not complete full-song hardware acceptance.');
    md = md.replace('Console playback is verified in\nPCSX-Redux; physical-console validation is pending.', 'Console playback is verified in PCSX-Redux. A later short SoundFont hardware smoke is recorded separately; broad sampled-SFX hardware acceptance remains incomplete.');
  }
  if (slug === 'hud') md = md.replace('# HUD and 2D entities', '# HUD and UI entities');
  if (slug === 'architecture') md = md.replace('The editor\'s source watcher stops stale Play through the\nexisting worker, then rebuilds and restarts when Auto compile is enabled.', 'Source observation invalidates stale builds; PSX compilation is manual. Play reuses only matching build receipts or requests a fresh build. Automatic desktop UI preview is a separate workflow. See [Build, measure and iterate](../docs/iteration.md).');
  if (slug === 'input-collision') md += '\n\n## Walkable ramp surfaces\n\nColliders now expose `slope_rise` and `slope_axis` (0 = X, 2 = Z). Zero rise is an ordinary box. The movement solver treats a ramp as a standing-height surface, not a solid inclined plane: sweeps skip the ramp obstacle and lift the mover onto its interpolated top. Side entry is supported. See the [Third Person guide](third-person.md#walkable-ramps) for authoring and limits.\n';
  return md;
}

export function expandFeatureGuide(markdown, data) {
  const additions = `## New in v0.2.0 and recent updates\n\nReviewed against the committed develop snapshot on ${data.reviewed}. These additions complement the existing catalog below; implementation is not a claim of unlimited capacity or full hardware acceptance. The [homepage explorer](/#feature-explorer) combines both lists with search and category filters.\n\n${data.items.map(item => `- **${item.title}.** ${item.description} [Guide](/docs/${item.guide}/).`).join('\n')}\n\n`;
  return markdown.replace('## Projects, startup and workspace', `${additions}## Projects, startup and workspace`);
}

const sections = {
  'Projects, startup and workspace': ['Editor & projects', 'projects'],
  'Desktop editor': ['Editor & projects', 'editor'],
  'Content Browser and asset management': ['Assets & imports', 'content-browser'],
  'Scenes, entities and geometry': ['World building', 'blockout'],
  'Actors, components and the class model': ['Gameplay & Actors', 'actors'],
  'Textures, materials and display': ['Rendering & animation', 'textures'],
  'Lighting, shadows and environment': ['Rendering & animation', 'lighting'],
  'Cameras, sprites, particles and skeletal animation': ['Rendering & animation', 'sprites-particles'],
  'Timelines and sequenced effects': ['Timelines & VFX', 'timelines'],
  'HUD and 2D interface': ['UI & HUD', 'hud'],
  'Audio': ['Audio & music', 'assets'],
  'Native C++ gameplay and reflection': ['Blueprints & code', 'scripting'],
  'Lua gameplay scripting': ['Blueprints & code', 'lua-scripting'],
  'Blueprint visual gameplay': ['Blueprints & code', 'blueprints'],
  'Input, collision and runtime object services': ['Gameplay & Actors', 'input-collision'],
  'Play, emulation and physical-console workflow': ['Build & deploy', 'play'],
  'Build, memory analysis, loading and distribution': ['Build & deploy', 'play'],
  'Geometry streaming and performance': ['Performance & memory', 'performance'],
  'Memory Card persistence': ['Gameplay & Actors', 'memory-card'],
  'AI assistant / MCP integration': ['Automation & tools', 'mcp'],
  'Command-line and automation surface': ['Automation & tools', 'getting-started'],
  'Validation and developer tooling': ['Automation & tools', 'testing'],
};
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const plain = value => marked.parseInline(value).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

export function buildFeatureExplorer({ markdown, featureData, manifest, esc }) {
  const items = featureData.items.map(item => ({ ...item, id: slugify(item.title), fresh: true, url: `/docs/${item.guide}/`, sourceUrl: `${manifest.repository}/blob/${manifest.commit}/${item.source}` }));
  let heading = '';
  for (const token of marked.lexer(markdown)) {
    if (token.type === 'heading' && token.depth === 2) heading = token.text;
    const section = sections[heading];
    if (!section) continue; // Excludes future work, source tables and the additions above.
    if (token.type === 'list') for (const entry of token.items) {
      const match = entry.text.match(/^\*\*([^*]+?)\.\*\*\s*([\s\S]*)$/);
      // The validation section uses unlabeled bullets; keep those too.
      if (!match && heading !== 'Validation and developer tooling') continue;
      const title = match ? match[1] : entry.text.split(/ (?:cover|exercise|keep|pin)/)[0];
      const label = heading === 'Memory Card persistence' ? `Memory Card: ${title}` : heading === 'Audio' && title === 'Capacity' ? 'Resident SPU sample capacity' : title;
      const linkedGuide = entry.text.match(/\]\(([a-z][a-z0-9-]+)\.md(#[^)]+)?\)/);
      const directGuides = { Cameras: 'camera-resources', 'Particle Effect assets': 'vfx-editor', 'Memory Analyzer': 'play/#memory-analyzer', 'Standalone export': 'runtime', 'Scene Blueprint per map': 'scene-blueprints' };
      const guidePath = directGuides[title] ? `/docs/${directGuides[title]}${directGuides[title].includes('#') ? '' : '/'}` : linkedGuide ? `/docs/${linkedGuide[1]}/${linkedGuide[2] || ''}` : `/docs/${section[1]}/`;
      items.push({ id: slugify(`${heading}-${title}`), title: plain(label), description: plain(match ? match[2] : entry.text), category: section[0], fresh: false, url: guidePath, sourceUrl: `/docs/features/#${heading.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-')}` });
    }
    if (token.type === 'table' && heading === 'Command-line and automation surface') for (const row of token.rows) {
      items.push({ id: `cli-${slugify(row[0].text)}`, title: `${plain(row[0].text)} CLI`, description: plain(row[1].text), category: section[0], fresh: false, url: `/docs/${section[1]}/`, sourceUrl: '/docs/features/#command-line-and-automation-surface' });
    }
  }
  items.push(
    {id:'editor-hosts', title:'Windows, macOS and Linux editor hosts', description:'Windows x64, macOS Apple Silicon and Linux x86_64. Linux remains experimental; Blueprint reflection is provisioned on Windows/Linux, not macOS.', category:'Editor & projects', fresh:false, url:'/docs/getting-started/', sourceUrl:'/docs/features/#known-boundaries'},
    {id:'open-source', title:'Open-source editor and native runtime', description:'Original Epok code is MIT licensed. Bundled tools, SDKs and third-party assets retain their own notices; proprietary console BIOS/firmware are not distributed.', category:'Editor & projects', fresh:false, url:'/docs/license/', sourceUrl:'/docs/credits/'}
  );
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('Duplicate feature IDs');
  const categories = [...new Set(items.map(item => item.category))].sort();
  const filters = [['all', 'All features', items.length], ...categories.map(category => [category, category, items.filter(item => item.category === category).length])];
  const rows = items.map((item, index) => `<details class="capability" data-feature data-category="${esc(item.category)}" data-fresh="${item.fresh}" id="feature-${item.id}"${index === 0 ? ' open' : ''}><summary><span class="capability-mark" aria-hidden="true">${item.fresh ? '✦' : '✓'}</span><span class="capability-heading"><span class="capability-meta">${esc(item.category)}${item.fresh ? '<span class="new-label">NEW</span>' : ''}</span><span class="capability-title">${esc(item.title)}</span></span><span class="capability-toggle" aria-hidden="true">+</span></summary><div class="capability-detail"><p>${esc(item.description)}</p><div><a href="${item.url}">Read the guide <span aria-hidden="true">↗</span></a><a class="capability-source" href="${esc(item.sourceUrl)}">${item.fresh ? 'Implementation' : 'Catalog source'} <span aria-hidden="true">↗</span></a></div></div></details>`).join('');
  const html = `<section id="features" class="section wrap feature-section"><div class="section-heading"><div><p class="eyebrow">SMALL CONSOLE. A LOT OF POSSIBILITIES.</p><h2>Explore the engine.<br><span class="muted">Every little superpower.</span></h2></div><p>World building to the last byte.<br>Find a capability. See how it works.</p></div><div id="feature-explorer" class="feature-explorer" data-feature-explorer><div class="explorer-heading"><div><span class="explorer-led" aria-hidden="true"></span><strong>Feature explorer</strong><span class="explorer-total mono">${items.length} capabilities</span></div><a href="/docs/features/">Full reference ↗</a></div><div class="explorer-toolbar" data-feature-controls hidden><label class="feature-search"><span aria-hidden="true">⌕</span><span class="sr-only">Search all features</span><input type="search" data-feature-query placeholder="Find something: Lua, MIDI, skeletal, Blueprints…" autocomplete="off" aria-controls="feature-results"></label><label class="feature-new"><input type="checkbox" data-feature-new> New in v0.2.0 &amp; recent</label><button type="button" class="feature-reset" data-feature-reset>Reset</button></div><div class="explorer-layout"><div class="feature-categories" role="group" aria-label="Filter features by category" data-feature-controls hidden>${filters.map(([value, label, count]) => `<button type="button" data-feature-category="${esc(value)}" aria-pressed="${value === 'all'}" aria-controls="feature-results"><span>${esc(label)}</span><span class="mono">${count}</span></button>`).join('')}</div><div class="explorer-main"><div class="explorer-status"><p role="status" aria-live="polite" aria-atomic="true" data-feature-status>${items.length} of ${items.length} features</p><span>EXPAND TO EXPLORE <span aria-hidden="true">↓</span></span></div><div id="feature-results" class="feature-results" role="region" aria-label="Scrollable feature results" tabindex="0">${rows}<div class="feature-empty" data-feature-empty hidden><h3>No features found.</h3><p>Try another term, choose All features, or reset the filters.</p><button type="button" class="feature-reset" data-feature-reset>Reset filters</button></div></div></div></div><div class="explorer-footer"><span><span class="explorer-led" aria-hidden="true"></span> Source-mapped · develop <a href="${manifest.repository}/tree/${manifest.commit}" class="mono">${manifest.commit.slice(0, 7)}</a></span><span>${categories.length} areas <span aria-hidden="true">/</span> Scroll inside to explore</span></div></div><p class="explorer-note">Implemented does not mean unlimited or production-ready. Each guide explains its limits and validation status. <a href="/docs/features/#known-boundaries">Read the boundaries ↗</a></p><noscript><p>Search and filters require JavaScript. All ${items.length} entries remain available above; scroll and expand them, or open the <a href="/docs/features/">complete catalog</a>.</p></noscript></section>`;
  return { items, html };
}
