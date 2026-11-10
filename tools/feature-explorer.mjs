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
    md = md.replace('Textured skeletal\n  materials, blended weights and animation blending are not implemented.', 'Skeletal material slots support assigned textures; blended weights and animation blending remain outside the current profile.');
    md = md.replace('Entity multiselection is not implemented, and Undo/Redo is not editor-wide.', 'The Hierarchy supports multiple Actor selection. Undo/Redo is not editor-wide.');
    md = md.replace('The actor model has no Pawn/Character archetypes or positional 2D/3D audio.\n  2D physics provides box/circle colliders, one-way platforms, raycasts, sliding\n  character movement and triggers, not a general rigid-body solver; boxes ignore\n  their owner\'s rotation.', 'The Actor model has no Pawn/Character archetypes. 2D supports bounded spatial audio, collision, character movement, rigid boxes and joints; see the 2D guide for scope and limits.');
    md = md.replace('Scene banks, textures, scripts and resident audio must fit PSX memory. Geometry\n  streaming covers EditableMesh pages only; it is not arbitrary map, texture or\n  audio streaming.', 'Resident code, scripts, textures and audio must fit PSX memory. External scene data can share a bounded loading region; geometry streaming covers EditableMesh pages rather than arbitrary textures or audio.');
    md = md.replace('Release builds produce an editor executable, not a packaged installer/app\n  bundle. A PlayStation system-area license, BIOS and Unirom are not distributed.', 'Windows portable packages are available; see the release guide for platform-specific packaging. A PlayStation system-area license, BIOS and Unirom are not distributed.');
    md = md.replace(/\*\*Legacy compatibility\.\*\* Existing entities and Behaviours are unchanged and are\n  additionally presented as a derived actor view; a Behaviour on an actor runs\n  through a compatibility component, and an entity carrying both 3D and UI data is\n  reported as a pending conversion rather than split\./, '**Older project compatibility.** Previous Entity/Behaviour maps, older Blueprint versions and `.epokscript` sidecars are rejected without automatic conversion. Recreate them as Actor-based projects.');
    md = md.replace('Host-validated in the editor and by the C++ host test suite; PSX build, export and\nemulator validation are pending on an SDK machine.', 'Actor-based templates build and run through the supported PlayStation workflow; see their guides for the exact validation scope.');
  }
  if (slug === 'editor') {
    md = md.replace('The 2D world. Camera2D authoring arrives in a later release; the mode already lists this map\'s 2D actors in the Hierarchy', 'World2D Actor placement: grid, pan/zoom, labeled footprints, topmost picking and drag movement. See [2D worlds](worlds-2d.md) for the rendering limits');
    md = md.replace('an editable Active checkbox and a read-only list\nof its components and authored properties. Adding and removing components arrives in a later\nrelease.', 'an editable Active checkbox, compatible Add/Remove Component controls and editable reflected properties with override markers. Required roots and inherited components are protected.');
    md = md.replace('Opening an embedded scene Blueprint for editing arrives in a later release.', 'Open the embedded graph from Map Settings; see [Scene Blueprints](scene-blueprints.md).');
    md = md.replace('The sample Spinner does not use them, and an Epok C++ input API is not implemented yet.', 'The sample Spinner does not use them. Native gameplay can use the [input API](input-collision.md); the updated [Third Person template](third-person.md) includes a controller.');
    md = md.replace('Entity activation is displayed as a disabled placeholder and does not affect the runtime.', 'Runtime activation affects rendering, audio and collision participation; the Actor Inspector exposes an editable Active control.');
  }
  if (slug === 'projects') {
    md = md.replace(/Maps can hold both the original entities[\s\S]*?See \[Migrating an existing project\]\(migration-actors\.md\)\./, 'Maps use one Actor collection in scene document version 6. Previous Entity/Behaviour maps and older Blueprint formats are rejected without being silently converted. Create a current project and recreate the content; see [Recreating a project for the Actor architecture](migration-actors.md). The current project may propose a Default Scene Blueprint Parent for maps without a scene Blueprint.');
    md = md.replace('Opening never rewrites a legacy manifest.', 'The following descriptor migration only concerns a compatible legacy project manifest; it does not convert old Entity/Behaviour maps or Blueprint formats. Opening never rewrites a legacy manifest.');
    md = md.replace('Native script bindings support stable class/member IDs; old name-based bindings remain readable through the [scripting compatibility adapter](scripting.md).', 'Native script bindings use class/member identities; see [C++ scripting](scripting.md) for the current Actor workflow.');
    md = md.replace('Original C++ and .epokscript metadata', 'Original C++, Lua and Blueprint gameplay');
    md = md.replace('The manifest owns the initial Auto compile setting.', 'A legacy Auto compile preference does not schedule automatic game builds; Build and Play validate or compile explicitly.');
  }
  if (slug === 'formats') {
    md = md.replace('| Legacy C++ property metadata | `assets/scripts/Spinner.epokscript` |', '| C++ gameplay source | Annotated `.hpp` and `.cpp` files under `assets/scripts/` |');
    md = md.replace(/## Document versions[\s\S]*?(?=### Dungeon generators)/, '## Document versions\n\nCurrent maps use scene document version 6 with one `actors` collection. Blueprint assets use version 5 and the generated reflection cache uses schema 9. Previous Entity/Behaviour maps, older Blueprint formats and `.epokscript` sidecars are rejected with a diagnostic; opening them does not rewrite or convert their files. See [Recreating a project for the Actor architecture](migration-actors.md) and [Actors and components](actors.md).\n\n');
    md = md.replace(/### Blueprint asset version 4[\s\S]*?(?=## Working copy)/, '### Blueprint assets\n\nCurrent Blueprint assets use version 5 and participate in the reflected Actor class model. See [Blueprints](blueprints.md) for authoring, inheritance and compatibility.\n\n## Migrating an existing game\n\nThere is no automatic migration of older Entity/Behaviour maps or Blueprint formats. Preserve the original project, create a current project and recreate its maps and gameplay. Descriptor-only migration does not convert game content. See [Recreating a project for the Actor architecture](migration-actors.md).\n\n');
  }
  if (slug === 'mcp') {
    md = md.replace('This exposes current engine features; it does not add collision physics, texture import, animation blending or other unsupported runtime systems.', 'This exposes existing engine features through bounded tools; it does not add runtime features beyond those documented for the engine.');
    md = md.replace(/The actor tools author the Object\/Actor\/Component half of a scene \(document version 5;[\s\S]*?`epok::Entity` records\./, 'The actor tools author the map\'s Actor collection (scene document version 6); see [Actors and components](actors.md) and [document formats](formats.md). Earlier Entity/Behaviour maps must be recreated.');
    md = md.replace('Lists authored actors (class, family, domain, active flag, logical parent, overrides, components), the derived view of legacy entities that have not been migrated, the diagnostic codes of that derivation, and the placeable actor classes.', 'Lists authored actors, their class, domain, active state, parent, overrides and components, plus placeable classes.');
  }
  if (slug === 'hud') md = md.replace('# HUD and 2D entities', '# HUD and UI entities');
  if (slug === 'architecture') md = md.replace('The editor\'s source watcher stops stale Play through the\nexisting worker, then rebuilds and restarts when Auto compile is enabled.', 'Source observation invalidates stale builds; PSX compilation is manual. Play reuses only matching build receipts or requests a fresh build. Automatic desktop UI preview is a separate workflow. See [Build, measure and iterate](../docs/iteration.md).');
  if (slug === 'native-hud-preview') md = md.replace('Open **Scene > 2D**.', 'Open **Scene > UI**.');
  return md;
}

const highlightGuide = item => `/docs/${item.guide === 'docs/2d.md' ? 'worlds-2d' : item.guide.replace(/^docs\//, '').replace(/\.md$/, '')}/`;
export function expandFeatureGuide(markdown, latest, version) {
  const latestList = latest.items.map(item => `- **${item.title}.** ${item.description} [Guide](${highlightGuide(item)}).`).join('\n');
  const additions = `## ${version} highlights\n\nSee the [release notes](/docs/releases/${version}/) for compatibility and validation details.\n\n${latestList}\n\n`;
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
  '2D worlds': ['World building', 'worlds-2d'],
  'HUD and 2D interface': ['UI & HUD', 'hud'],
  'Audio': ['Audio & music', 'assets'],
  'C++ and Lua gameplay and reflection': ['Blueprints & code', 'scripting'],
  'Native C++ gameplay and reflection': ['Blueprints & code', 'scripting'],
  'Lua gameplay scripting': ['Blueprints & code', 'lua-scripting'],
  'Blueprint visual gameplay': ['Blueprints & code', 'blueprints'],
  'Input, collision and runtime object services': ['Gameplay & Actors', 'input-collision'],
  'Play, emulation and physical-console workflow': ['Build & deploy', 'play'],
  'Build, memory analysis, loading and distribution': ['Build & deploy', 'play'],
  'Geometry streaming and performance': ['Performance & memory', 'performance'],
  'Memory Card persistence': ['Gameplay & Actors', 'memory-card'],
  'PocketStation': ['Gameplay & Actors', 'pocketstation'],
  'AI assistant / MCP integration': ['Automation & tools', 'mcp'],
  'External tools / MCP integration': ['Automation & tools', 'mcp'],
  'Command-line and automation surface': ['Automation & tools', 'getting-started'],
  'Validation and developer tooling': ['Automation & tools', 'testing'],
};
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const plain = value => marked.parseInline(value).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

export function buildFeatureExplorer({ markdown, latest, manifest, version, esc }) {
  const items = [
    ...latest.items.map(item => ({ ...item, id: slugify(item.title), fresh: true, url: highlightGuide(item), sourceUrl: `${manifest.repository}/blob/${latest.revision}/${item.source}` }))
  ];
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
  const rows = items.map((item, index) => `<details class="capability" data-feature data-category="${esc(item.category)}" data-fresh="${item.fresh}" id="feature-${item.id}"${index === 0 ? ' open' : ''}><summary><span class="capability-mark" aria-hidden="true">${item.fresh ? '✦' : '✓'}</span><span class="capability-heading"><span class="capability-meta">${esc(item.category)}${item.fresh ? `<span class="new-label">${version}</span>` : item.snapshot ? '<span>SEPTEMBER SNAPSHOT</span>' : ''}</span><span class="capability-title">${esc(item.title)}</span></span><span class="capability-toggle" aria-hidden="true">+</span></summary><div class="capability-detail"><p>${esc(item.description)}</p>${item.snapshot ? '<p>Details reflect the September documentation snapshot and may have changed since.</p>' : ''}<div><a href="${esc(item.url)}">Read the guide <span aria-hidden="true">↗</span></a><a class="capability-source" href="${esc(item.sourceUrl)}">${item.source ? 'Implementation' : 'Catalog source'} <span aria-hidden="true">↗</span></a></div></div></details>`).join('');
  const html = `<section id="features" class="section wrap feature-section"><div class="section-heading"><div><p class="eyebrow">SMALL CONSOLE. A LOT OF POSSIBILITIES.</p><h2>Explore the engine.<br><span class="muted">Every little superpower.</span></h2></div><p>World building to the last byte.<br>Find a capability. See how it works.</p></div><div id="feature-explorer" class="feature-explorer" data-feature-explorer><div class="explorer-heading"><div><span class="explorer-led" aria-hidden="true"></span><strong>Feature explorer</strong><span class="explorer-total mono">${items.length} capabilities</span></div><a href="/docs/features/">Full reference ↗</a></div><div class="explorer-toolbar" data-feature-controls hidden><label class="feature-search"><span aria-hidden="true">⌕</span><span class="sr-only">Search all features</span><input type="search" data-feature-query placeholder="Find something: MIDI, ramps, Blueprints…" autocomplete="off" aria-controls="feature-results"></label><label class="feature-new"><input type="checkbox" data-feature-new> ${version} highlights</label><button type="button" class="feature-reset" data-feature-reset>Reset</button></div><div class="explorer-layout"><div class="feature-categories" role="group" aria-label="Filter features by category" data-feature-controls hidden>${filters.map(([value, label, count]) => `<button type="button" data-feature-category="${esc(value)}" aria-pressed="${value === 'all'}" aria-controls="feature-results"><span>${esc(label)}</span><span class="mono">${count}</span></button>`).join('')}</div><div class="explorer-main"><div class="explorer-status"><p role="status" aria-live="polite" aria-atomic="true" data-feature-status>${items.length} of ${items.length} features</p><span>EXPAND TO EXPLORE <span aria-hidden="true">↓</span></span></div><div id="feature-results" class="feature-results" role="region" aria-label="Scrollable feature results" tabindex="0">${rows}<div class="feature-empty" data-feature-empty hidden><h3>No features found.</h3><p>Try another term, choose All features, or reset the filters.</p><button type="button" class="feature-reset" data-feature-reset>Reset filters</button></div></div></div></div><div class="explorer-footer"><span><span class="explorer-led" aria-hidden="true"></span> Documentation snapshot · ${version} <a href="${manifest.repository}/tree/${manifest.commit}" class="mono">${manifest.commit.slice(0, 7)}</a></span><span>${categories.length} areas <span aria-hidden="true">/</span> Scroll inside to explore</span></div></div><p class="explorer-note">Implemented does not mean unlimited or production-ready. Each guide explains its limits and validation status. <a href="/docs/features/#known-boundaries">Read the boundaries ↗</a></p><noscript><p>Search and filters require JavaScript. All ${items.length} entries remain available above; scroll and expand them, or open the <a href="/docs/features/">complete catalog</a>.</p></noscript></section>`;
  return { items, html };
}
