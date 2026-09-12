import { createHash } from 'node:crypto';

const KIND_LABELS = {
  CLASS_DECL: 'Class',
  CLASS_TEMPLATE: 'Class template',
  STRUCT_DECL: 'Struct',
  ENUM_DECL: 'Enum',
  TYPE_ALIAS_DECL: 'Type alias',
  TYPEDEF_DECL: 'Type alias',
  FUNCTION_DECL: 'Function',
  FUNCTION_TEMPLATE: 'Function template',
  CXX_METHOD: 'Method',
  CXX_CONSTRUCTOR: 'Constructor',
  CXX_DESTRUCTOR: 'Destructor',
  CONVERSION_FUNCTION: 'Conversion operator',
  FIELD_DECL: 'Field',
  VAR_DECL: 'Variable',
  ENUM_CONSTANT_DECL: 'Enum value',
};

const kindLabel = kind => KIND_LABELS[kind] || String(kind || 'Symbol').replaceAll('_', ' ').toLowerCase();
const keyFor = item => `${item.family}|${item.qualified}`;
const shortHash = value => createHash('sha1').update(value).digest('hex').slice(0, 8);
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'symbol';
const symbolRoute = (kind, item) => `/docs/api/reference/${item.family}/${kind}/${slug(item.qualified)}-${shortHash(keyFor(item))}/`;
const namespaceRoute = (family, namespace) => `/docs/api/reference/${family}/namespace/${slug(namespace)}-${shortHash(`${family}|${namespace}`)}/`;
const groupBy = (items, getKey) => {
  const groups = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return groups;
};
const sortSymbols = items => [...items].sort((a, b) => a.name.localeCompare(b.name) || a.qualified.localeCompare(b.qualified));

export function buildApiReference({ catalog, manifest, repo, write, page, esc, arrow }) {
  const typeByKey = new Map(catalog.types.map(item => [keyFor(item), item]));
  const callableGroups = groupBy(catalog.callables, keyFor);
  const propertyGroups = groupBy(catalog.properties, keyFor);
  const typeRoutes = new Map(catalog.types.map(item => [keyFor(item), symbolRoute('type', item)]));
  const callableRoutes = new Map([...callableGroups.entries()].map(([key, items]) => [key, symbolRoute('member', items[0])]));
  const propertyRoutes = new Map([...propertyGroups.entries()].map(([key, items]) => [key, symbolRoute('property', items[0])]));
  const namespaces = [...new Set([...catalog.types, ...catalog.callables, ...catalog.properties].map(item => `${item.family}|${item.namespace || item.family}`))]
    .map(key => { const [family, ...parts] = key.split('|'); return { family, namespace: parts.join('|') }; })
    .sort((a, b) => a.family.localeCompare(b.family) || a.namespace.localeCompare(b.namespace));
  const namespaceRoutes = new Map(namespaces.map(item => [`${item.family}|${item.namespace}`, namespaceRoute(item.family, item.namespace)]));
  const moduleRoutes = new Map(catalog.modules.map(item => [`${item.family}|${item.module}`, `/docs/api/${item.family}/${item.module}/`]));
  const urls = [];
  const searchItems = [];

  const sourceLink = item => /^https?:\/\//.test(item.source) ? `${item.source}#L${item.line}` : `${repo}/blob/${manifest.commit}/${item.source}#L${item.line}`;
  const code = (value, label = 'C++ example') => `<div class="api-code"><div><span>${esc(label)}</span><button type="button" data-copy-code>Copy</button></div><pre><code>${esc(value)}</code></pre></div>`;
  const description = item => item.brief || item.details || `${kindLabel(item.kind)} declared by the ${item.module} module for ${item.context}.`;
  const ownerLink = item => {
    if (item.owner && typeRoutes.has(`${item.family}|${item.owner}`)) return `<a href="${typeRoutes.get(`${item.family}|${item.owner}`)}">${esc(item.owner)}</a>`;
    const ns = item.namespace || item.family;
    return `<a href="${namespaceRoutes.get(`${item.family}|${ns}`)}">${esc(ns)}</a>`;
  };
  const declarationForProperty = item => {
    if (item.kind === 'ENUM_CONSTANT_DECL') return item.value == null ? item.name : `${item.name} = ${item.value}`;
    const functionPointer = item.type.match(/^(.*)\(\*\)(.*)$/);
    if (functionPointer) return `${item.static ? 'static ' : ''}${functionPointer[1]}(*${item.name})${functionPointer[2]}`;
    const array = item.type.match(/^(.+?)(\[[\s\S]*)$/);
    if (array) return `${item.static ? 'static ' : ''}${array[1]} ${item.name}${array[2]}`;
    return `${item.static ? 'static ' : ''}${item.type} ${item.name}`;
  };
  const exampleForProperty = item => {
    if (item.kind === 'ENUM_CONSTANT_DECL') return item.example;
    const access = item.owner ? `object.${item.name}` : item.qualified;
    const owner = item.owner ? `\n${item.owner}& object = /* obtain a valid instance */;` : '';
    if (/\[[^\]]*\]/.test(item.type)) return `${item.include}${owner}\n\nauto firstValue = ${access}[0];\n\n// When mutation is valid for this object:\n// ${access}[0] = replacement;`;
    if (/\(\*\)/.test(item.type)) return `${item.include}${owner}\n\nauto callback = ${access};\n\n// Assign a function with the exact declared signature:\n// ${access} = &myCallback;`;
    return item.example;
  };
  const familyLabel = family => family === 'epok' ? 'Epok runtime' : 'PsyQo SDK';
  const familySummary = family => family === 'epok'
    ? 'The engine-facing runtime: scenes, input, collision, animation, assets, rendering helpers and gameplay services.'
    : 'The low-level PlayStation SDK used by Epok: GPU, CD-ROM, audio, pads, kernel services, fixed-point math and hardware abstractions.';

  function apiSidebar(family = '', active = {}) {
    return `<aside class="api-sidebar" aria-label="API navigation"><a class="api-home-link" href="/docs/api/">API Reference <span aria-hidden="true">↗</span></a><form class="api-search-mini" role="search" action="/docs/api/"><label for="api-search-side">Search symbols</label><input id="api-search-side" name="q" type="search" placeholder="Class, method, property…"></form><nav><a${family === 'epok' && !active.namespace ? ' aria-current="page"' : ''} href="/docs/api/epok/">Epok runtime</a><a${family === 'psyqo' && !active.namespace ? ' aria-current="page"' : ''} href="/docs/api/psyqo/">PsyQo SDK</a></nav><div class="api-tree" data-api-navigation data-active-family="${esc(family)}" data-active-namespace="${esc(active.namespace || '')}" data-active-type="${esc(active.type || '')}" data-active-symbol="${esc(active.symbol || '')}"><p>Loading every namespace, type and member…</p></div><noscript><p class="api-tree-fallback">JavaScript is needed for the complete expandable tree. The <a href="/docs/api/">API index</a> remains fully navigable without it.</p></noscript><a class="api-guide-link" href="/docs/scripting/">C++ scripting guide ${arrow}</a></aside>`;
  }
  function apiShell(title, subtitle, family, content, crumbs = [], active = {}) {
    const breadcrumb = `<nav class="api-breadcrumb" aria-label="Breadcrumb"><a href="/docs/api/">API Reference</a>${crumbs.map(crumb => `<span>/</span>${crumb.url ? `<a href="${crumb.url}">${esc(crumb.label)}</a>` : `<span>${esc(crumb.label)}</span>`}`).join('')}</nav>`;
    return `<div class="api-layout">${apiSidebar(family, active)}<main id="main" class="api-main">${breadcrumb}<header class="api-title"><p class="eyebrow">${esc(family ? familyLabel(family).toUpperCase() : 'EPOK C++ SCRIPT REFERENCE')}</p><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></header>${content}</main></div>`;
  }
  function writeApi(url, title, descriptionText, body) {
    write(`${url.replace(/^\//, '')}index.html`, page(`${title} — Epok API`, descriptionText, url, body, 'api'));
    urls.push(url);
  }
  function memberRows(items, routeMap, emptyText) {
    if (!items.length) return `<p class="api-empty">${esc(emptyText)}</p>`;
    return `<div class="api-member-table">${sortSymbols(items).map(item => `<a href="${routeMap.get(keyFor(item))}"><code>${esc(item.name)}</code><span>${esc(description(item))}</span><span class="api-row-kind">${esc(kindLabel(item.kind))}</span></a>`).join('')}</div>`;
  }
  function addSearch(item) {
    searchItems.push({ ...item, api: true });
  }

  const namespaceCards = family => namespaces.filter(item => item.family === family).map(item => {
    const members = [...catalog.types, ...catalog.callables, ...catalog.properties].filter(symbol => symbol.family === family && (symbol.namespace || family) === item.namespace);
    return `<a class="api-card" href="${namespaceRoutes.get(`${family}|${item.namespace}`)}"><span class="api-kind">Namespace</span><h3><code>${esc(item.namespace)}</code></h3><p>${members.length} indexed declarations</p></a>`;
  }).join('');

  const indexContent = `<section class="api-hero-search"><form role="search" action="/docs/api/"><label for="api-search">Search the entire C++ API</label><div><input id="api-search" data-api-search name="q" type="search" placeholder="Try GPU::sendPrimitive, Transform or raycast…" autocomplete="off"><button type="reset">Clear</button></div></form><p class="api-search-status" data-api-search-status role="status" aria-live="polite"></p><div class="api-search-results" data-api-search-results hidden></div></section><section class="api-stats" aria-label="API catalog totals"><div><strong>${catalog.totals.types.toLocaleString()}</strong><span>types</span></div><div><strong>${callableGroups.size.toLocaleString()}</strong><span>functions &amp; methods</span></div><div><strong>${propertyGroups.size.toLocaleString()}</strong><span>fields, values &amp; properties</span></div><div><strong>${namespaces.length}</strong><span>namespaces</span></div></section><section class="api-section"><div class="api-section-heading"><div><p class="eyebrow">CHOOSE A LAYER</p><h2>Start broad, then drill down.</h2></div><p>Like a world map before a dungeon map: choose the engine-level API or the PlayStation-level SDK, then open any symbol.</p></div><div class="api-family-grid">${['epok', 'psyqo'].map(family => `<a class="api-family-card" href="/docs/api/${family}/"><span>${family === 'epok' ? 'ENGINE LAYER' : 'HARDWARE LAYER'}</span><h2>${familyLabel(family)}</h2><p>${familySummary(family)}</p><strong>Explore ${familyLabel(family)} →</strong></a>`).join('')}</div></section><section class="api-section"><h2>Browse namespaces</h2><div class="api-card-grid">${namespaceCards('epok')}${namespaceCards('psyqo')}</div></section><section class="api-section api-help"><h2>How to read this reference</h2><div><article><h3>Types are the starting rooms</h3><p>Open a class, struct or enum to see its fields, constructors and methods together.</p></article><article><h3>Every member has its own page</h3><p>Each function, method, field and enum value includes its declaration, context, source and a copyable C++ snippet.</p></article><article><h3>Warnings are practical</h3><p>Look for ownership, lifetime, capacity and PSX cost notes before the console reminds you with a less friendly black screen.</p></article></div></section>`;
  writeApi('/docs/api/', 'C++ API Reference', 'Explore every public Epok and PsyQo class, function, method, field and enum value.', apiShell('C++ API Reference', 'A symbol-by-symbol reference for the complete public Epok runtime and PsyQo SDK.', '', indexContent));
  addSearch({ title: 'C++ API Reference', kind: 'Index', family: '', namespace: '', owner: '', url: '/docs/api/', text: 'Complete Epok PsyQo C++ script reference classes structs enums functions methods properties fields constants' });

  for (const family of ['epok', 'psyqo']) {
    const familyTypes = catalog.types.filter(item => item.family === family);
    const familyCallables = [...callableGroups.values()].map(items => items[0]).filter(item => item.family === family);
    const familyProperties = [...propertyGroups.values()].map(items => items[0]).filter(item => item.family === family);
    const letters = groupBy(sortSymbols(familyTypes), item => item.name[0]?.toUpperCase() || '#');
    const alphabet = [...letters.entries()].map(([letter, items]) => `<section class="api-alpha-group"><h3>${esc(letter)}</h3><div>${items.map(item => `<a href="${typeRoutes.get(keyFor(item))}"><code>${esc(item.qualified)}</code><span>${esc(kindLabel(item.kind))}</span></a>`).join('')}</div></section>`).join('');
    const moduleCards = catalog.modules.filter(item => item.family === family).map(item => `<a id="module-${esc(item.module)}" class="api-card" href="${moduleRoutes.get(`${family}|${item.module}`)}"><span class="api-kind">Module</span><h3><code>${esc(item.header)}</code></h3><p>${item.types} types · ${item.callables} overloads · ${item.properties} data declarations</p></a>`).join('');
    const content = `<section class="api-stats"><div><strong>${familyTypes.length}</strong><span>types</span></div><div><strong>${familyCallables.length}</strong><span>callable symbols</span></div><div><strong>${familyProperties.length}</strong><span>data symbols</span></div></section><section class="api-section"><h2>Modules and headers</h2><div class="api-card-grid">${moduleCards}</div></section><section class="api-section"><h2>Namespaces</h2><div class="api-card-grid">${namespaceCards(family)}</div></section><section class="api-section"><div class="api-section-heading"><div><h2>All types A–Z</h2></div><p>Classes, structs, enums, templates and aliases. Open one to see all of its public members.</p></div><div class="api-alphabet">${alphabet}</div></section>`;
    writeApi(`/docs/api/${family}/`, familyLabel(family), familySummary(family), apiShell(familyLabel(family), familySummary(family), family, content, [{ label: familyLabel(family) }]));
    addSearch({ title: familyLabel(family), kind: 'API family', family, namespace: family, owner: '', url: `/docs/api/${family}/`, text: familySummary(family) });
  }

  for (const module of catalog.modules) {
    const moduleTypes = catalog.types.filter(item => item.family === module.family && item.module === module.module);
    const moduleCallables = [...callableGroups.values()].map(items => items[0]).filter(item => item.family === module.family && item.module === module.module);
    const moduleProperties = [...propertyGroups.values()].map(items => items[0]).filter(item => item.family === module.family && item.module === module.module);
    const content = `<section class="api-overview"><div><span class="api-kind">Module</span><p>${esc(module.context)}.</p></div><dl class="api-meta"><div><dt>Header</dt><dd><code>${esc(module.header)}</code></dd></div><div><dt>Include</dt><dd><code>${esc(module.include)}</code></dd></div><div><dt>Stability</dt><dd>${esc(module.stability)}</dd></div></dl></section><section class="api-section"><h2>Include this module</h2>${code(module.include, 'C++ include')}</section><section class="api-section"><h2>Types</h2>${memberRows(moduleTypes, typeRoutes, 'This module does not declare public types.')}</section><section class="api-section"><h2>Functions and methods</h2>${memberRows(moduleCallables, callableRoutes, 'This module does not declare public callable symbols.')}</section><section class="api-section"><h2>Fields, variables and values</h2>${memberRows(moduleProperties, propertyRoutes, 'This module does not declare public data symbols.')}</section>`;
    const route = moduleRoutes.get(`${module.family}|${module.module}`);
    writeApi(route, module.title || module.header, `All public symbols declared by ${module.header}.`, apiShell(module.title || module.header, `${module.header} · ${module.context}`, module.family, content, [{ label: familyLabel(module.family), url: `/docs/api/${module.family}/` }, { label: module.header }]));
    addSearch({ title: module.header, kind: 'Module', family: module.family, namespace: '', owner: '', url: route, text: `${module.title} ${module.context} ${module.include} ${module.source}` });
  }

  for (const record of namespaces) {
    const { family, namespace } = record;
    const namespaceTypes = catalog.types.filter(item => item.family === family && (item.namespace || family) === namespace);
    const namespaceCallables = [...callableGroups.values()].map(items => items[0]).filter(item => item.family === family && (item.namespace || family) === namespace && !item.owner);
    const namespaceProperties = [...propertyGroups.values()].map(items => items[0]).filter(item => item.family === family && (item.namespace || family) === namespace && !item.owner);
    const content = `<section class="api-section"><h2>Types</h2>${memberRows(namespaceTypes, typeRoutes, 'This namespace does not declare public types.')}</section><section class="api-section"><h2>Functions</h2>${memberRows(namespaceCallables, callableRoutes, 'This namespace does not declare free functions.')}</section><section class="api-section"><h2>Variables and constants</h2>${memberRows(namespaceProperties, propertyRoutes, 'This namespace does not expose public variables or constants.')}</section>`;
    const route = namespaceRoutes.get(`${family}|${namespace}`);
    writeApi(route, `namespace ${namespace}`, `Browse public declarations in the ${namespace} namespace.`, apiShell(`namespace ${namespace}`, `${namespaceTypes.length} types, ${namespaceCallables.length} functions and ${namespaceProperties.length} data symbols.`, family, content, [{ label: familyLabel(family), url: `/docs/api/${family}/` }, { label: namespace }], { namespace }));
    addSearch({ title: namespace, kind: 'Namespace', family, namespace, owner: '', url: route, text: `${namespace} namespace ${familyLabel(family)}` });
  }

  for (const type of catalog.types) {
    const nestedTypes = catalog.types.filter(item => item.family === type.family && item.owner === type.qualified);
    const calls = [...callableGroups.values()].map(items => items[0]).filter(item => item.family === type.family && item.owner === type.qualified);
    const props = [...propertyGroups.values()].map(items => items[0]).filter(item => item.family === type.family && item.owner === type.qualified);
    const constructors = calls.filter(item => item.kind === 'CXX_CONSTRUCTOR' || item.name === type.name);
    const lifecycle = calls.filter(item => item.kind === 'CXX_DESTRUCTOR');
    const operators = calls.filter(item => item.name.startsWith('operator') || item.kind === 'CONVERSION_FUNCTION');
    const staticMethods = calls.filter(item => item.static && !constructors.includes(item) && !operators.includes(item));
    const methods = calls.filter(item => !item.static && !constructors.includes(item) && !lifecycle.includes(item) && !operators.includes(item));
    const enumValues = props.filter(item => item.kind === 'ENUM_CONSTANT_DECL');
    const fields = props.filter(item => item.kind !== 'ENUM_CONSTANT_DECL');
    const constructorExample = constructors[0] ? callableGroups.get(keyFor(constructors[0]))[0].example : '';
    const typeExample = constructorExample || (enumValues[0] ? `${type.include}\n\nauto value = ${type.qualified}::${enumValues[0].name};` : `${type.include}\n\n${type.qualified}& value = /* obtain a valid instance from your game */;`);
    const bases = type.bases?.length ? `<dl class="api-meta"><div><dt>Inherits from</dt><dd>${type.bases.map(base => esc(base)).join(', ')}</dd></div></dl>` : '';
    const section = (heading, items, routes, empty = '') => items.length ? `<section class="api-section"><h2>${heading}</h2>${memberRows(items, routes, empty)}</section>` : '';
    const content = `<section class="api-overview"><div><span class="api-kind">${esc(kindLabel(type.kind))}</span><p>${esc(description(type))}</p></div><dl class="api-meta"><div><dt>Namespace</dt><dd><a href="${namespaceRoutes.get(`${type.family}|${type.namespace || type.family}`)}"><code>${esc(type.namespace || type.family)}</code></a></dd></div><div><dt>Header</dt><dd><code>${esc(type.header)}</code></dd></div><div><dt>Include</dt><dd><code>${esc(type.include)}</code></dd></div><div><dt>Module</dt><dd>${esc(type.module)}</dd></div><div><dt>Source</dt><dd><a href="${sourceLink(type)}">${esc(type.source)}:${type.line} ${arrow}</a></dd></div></dl>${bases}</section><section class="api-section"><h2>Basic usage</h2><p>This minimal snippet shows the normal syntax for reaching the type. Open a member below for an operation-specific example.</p>${code(typeExample)}</section>${section('Nested types', nestedTypes, typeRoutes)}${section(type.kind === 'ENUM_DECL' ? 'Values' : 'Fields and constants', type.kind === 'ENUM_DECL' ? enumValues : fields, propertyRoutes)}${section('Constructors', constructors, callableRoutes)}${section('Public methods', methods, callableRoutes)}${section('Static methods', staticMethods, callableRoutes)}${section('Operators', operators, callableRoutes)}${section('Lifecycle', lifecycle, callableRoutes)}`;
    const route = typeRoutes.get(keyFor(type));
    writeApi(route, type.qualified, description(type), apiShell(type.qualified, kindLabel(type.kind), type.family, content, [{ label: familyLabel(type.family), url: `/docs/api/${type.family}/` }, { label: type.namespace || type.family, url: namespaceRoutes.get(`${type.family}|${type.namespace || type.family}`) }, { label: type.name }], { namespace: type.namespace || type.family, type: type.qualified }));
    addSearch({ title: type.qualified, kind: kindLabel(type.kind), family: type.family, namespace: type.namespace, owner: type.owner, url: route, text: `${description(type)} ${type.context} ${type.header} ${type.bases?.join(' ') || ''}` });
  }

  for (const [key, overloads] of callableGroups) {
    const first = overloads[0];
    const related = [...callableGroups.values()].map(items => items[0]).filter(item => item.family === first.family && item.owner === first.owner && keyFor(item) !== key).slice(0, 12);
    const overloadHtml = overloads.map((item, index) => {
      const params = item.parameters.length ? `<table class="api-params"><thead><tr><th>Parameter</th><th>Type</th><th>Meaning</th></tr></thead><tbody>${item.parameters.map(param => `<tr><td><code>${esc(param.name)}</code></td><td><code>${esc(param.type)}</code></td><td>${esc(param.description || `Value supplied for ${param.name}. Keep referenced or pointed-to data valid for the complete call.`)}</td></tr>`).join('')}</tbody></table>` : '<p>This overload takes no parameters.</p>';
      const result = item.result && item.result !== 'void' ? `<p><strong>Returns:</strong> <code>${esc(item.result)}</code>${item.returns ? ` — ${esc(item.returns)}` : '. Check the value before continuing when it represents success, availability or a resource handle.'}</p>` : '<p><strong>Returns:</strong> Nothing (<code>void</code>).</p>';
      const flags = [item.static && 'static', item.const && 'const', item.template && 'template', item.virtual && 'virtual'].filter(Boolean);
      return `<section class="api-overload"><div class="api-overload-title"><h2>Declaration${overloads.length > 1 ? ` ${index + 1} of ${overloads.length}` : ''}</h2>${flags.length ? `<span>${flags.join(' · ')}</span>` : ''}</div>${code(item.signature, 'Declaration')}<p>${esc(description(item))}</p>${params}${result}<h3>Example</h3>${code(item.example)}<div class="api-advice"><article><h3>Why use it</h3><p>${esc(item.benefits || 'Use this member when its explicit operation matches the current runtime task.')}</p></article><article class="warning"><h3>Trade-offs and warnings</h3><p>${esc(item.cautions || 'Respect the lifetime and capacity rules of the owning API. On PSX, allocations, copies and hardware synchronization are never magically free.')}</p>${item.warnings?.length ? `<ul>${item.warnings.map(warning => `<li>${esc(warning)}</li>`).join('')}</ul>` : ''}</article></div><p class="api-source">Declared in <a href="${sourceLink(item)}"><code>${esc(item.source)}:${item.line}</code> ${arrow}</a></p></section>`;
    }).join('');
    const relatedHtml = related.length ? `<section class="api-section"><h2>Related members</h2>${memberRows(related, callableRoutes, '')}</section>` : '';
    const content = `<section class="api-overview"><div><span class="api-kind">${esc(kindLabel(first.kind))}</span><p>${esc(description(first))}</p></div><dl class="api-meta"><div><dt>Belongs to</dt><dd>${ownerLink(first)}</dd></div><div><dt>Header</dt><dd><code>${esc(first.header)}</code></dd></div><div><dt>Overloads</dt><dd>${overloads.length}</dd></div></dl></section>${overloadHtml}${relatedHtml}`;
    const route = callableRoutes.get(key);
    const parentUrl = first.owner ? typeRoutes.get(`${first.family}|${first.owner}`) : namespaceRoutes.get(`${first.family}|${first.namespace || first.family}`);
    const parentLabel = first.owner || first.namespace || first.family;
    writeApi(route, first.qualified, description(first), apiShell(first.qualified, `${kindLabel(first.kind)} · ${overloads.length} overload${overloads.length === 1 ? '' : 's'}`, first.family, content, [{ label: familyLabel(first.family), url: `/docs/api/${first.family}/` }, { label: parentLabel, url: parentUrl }, { label: first.name }], { namespace: first.namespace || first.family, type: first.owner, symbol: first.qualified }));
    addSearch({ title: first.qualified, kind: kindLabel(first.kind), family: first.family, namespace: first.namespace, owner: first.owner, url: route, text: `${overloads.map(item => `${item.signature} ${description(item)} ${item.parameters.map(p => `${p.name} ${p.type}`).join(' ')}`).join(' ')} ${first.context}` });
  }

  for (const [key, declarations] of propertyGroups) {
    const first = declarations[0];
    const declarationHtml = declarations.map((item, index) => `<section class="api-overload"><h2>Declaration${declarations.length > 1 ? ` ${index + 1} of ${declarations.length}` : ''}</h2>${code(declarationForProperty(item), 'Declaration')}<p>${esc(description(item))}</p><dl class="api-meta"><div><dt>Type</dt><dd><code>${esc(item.type)}</code></dd></div>${item.value == null ? '' : `<div><dt>Value</dt><dd><code>${esc(item.value)}</code></dd></div>`}<div><dt>Storage</dt><dd>${item.static ? 'Static' : item.owner ? 'Per instance' : 'Namespace scope'}</dd></div></dl><h3>Example</h3>${code(exampleForProperty(item))}<div class="api-advice"><article><h3>When it helps</h3><p>${item.kind === 'ENUM_CONSTANT_DECL' ? 'Use this named value instead of a raw number so intent stays visible in game code and debugger output.' : 'Use this member when you need direct access to the state represented by its declared type.'}</p></article><article class="warning"><h3>Trade-offs and warnings</h3><p>${item.kind === 'ENUM_CONSTANT_DECL' ? 'Treat the numeric value as an implementation detail unless a file or hardware format explicitly requires it.' : 'Direct field access has no validation step. Keep the owning object alive, respect units and ranges, and do not mutate state while hardware or another subsystem is consuming it.'}</p></article></div><p class="api-source">Declared in <a href="${sourceLink(item)}"><code>${esc(item.source)}:${item.line}</code> ${arrow}</a></p></section>`).join('');
    const content = `<section class="api-overview"><div><span class="api-kind">${esc(kindLabel(first.kind))}</span><p>${esc(description(first))}</p></div><dl class="api-meta"><div><dt>Belongs to</dt><dd>${ownerLink(first)}</dd></div><div><dt>Header</dt><dd><code>${esc(first.header)}</code></dd></div></dl></section>${declarationHtml}`;
    const route = propertyRoutes.get(key);
    const parentUrl = first.owner ? typeRoutes.get(`${first.family}|${first.owner}`) : namespaceRoutes.get(`${first.family}|${first.namespace || first.family}`);
    const parentLabel = first.owner || first.namespace || first.family;
    writeApi(route, first.qualified, description(first), apiShell(first.qualified, kindLabel(first.kind), first.family, content, [{ label: familyLabel(first.family), url: `/docs/api/${first.family}/` }, { label: parentLabel, url: parentUrl }, { label: first.name }], { namespace: first.namespace || first.family, type: first.owner, symbol: first.qualified }));
    addSearch({ title: first.qualified, kind: kindLabel(first.kind), family: first.family, namespace: first.namespace, owner: first.owner, url: route, text: `${declarations.map(item => `${declarationForProperty(item)} ${description(item)} ${item.value ?? ''}`).join(' ')} ${first.context}` });
  }

  const navigation = {
    families: ['epok', 'psyqo'].map(family => ({
      name: family,
      label: familyLabel(family),
      url: `/docs/api/${family}/`,
      namespaces: namespaces.filter(item => item.family === family).map(record => {
        const namespace = record.namespace;
        const freeCallables = [...callableGroups.values()].map(items => items[0]).filter(item => item.family === family && (item.namespace || family) === namespace && !item.owner);
        const freeProperties = [...propertyGroups.values()].map(items => items[0]).filter(item => item.family === family && (item.namespace || family) === namespace && !item.owner);
        const types = sortSymbols(catalog.types.filter(item => item.family === family && (item.namespace || family) === namespace)).map(type => {
          const callables = [...callableGroups.values()].map(items => items[0]).filter(item => item.family === family && item.owner === type.qualified);
          const properties = [...propertyGroups.values()].map(items => items[0]).filter(item => item.family === family && item.owner === type.qualified);
          return {
            name: type.name,
            qualified: type.qualified,
            kind: kindLabel(type.kind),
            url: typeRoutes.get(keyFor(type)),
            members: sortSymbols([
              ...callables.map(item => ({ ...item, url: callableRoutes.get(keyFor(item)), displayKind: kindLabel(item.kind) })),
              ...properties.map(item => ({ ...item, url: propertyRoutes.get(keyFor(item)), displayKind: kindLabel(item.kind) })),
            ]).map(item => ({ name: item.name, qualified: item.qualified, kind: item.displayKind, url: item.url })),
          };
        });
        return {
          name: namespace,
          url: namespaceRoutes.get(`${family}|${namespace}`),
          types,
          functions: sortSymbols(freeCallables).map(item => ({ name: item.name, qualified: item.qualified, kind: kindLabel(item.kind), url: callableRoutes.get(keyFor(item)) })),
          properties: sortSymbols(freeProperties).map(item => ({ name: item.name, qualified: item.qualified, kind: kindLabel(item.kind), url: propertyRoutes.get(keyFor(item)) })),
        };
      }),
    })),
  };
  write('assets/api-navigation.json', JSON.stringify(navigation));

  return { searchItems, urls, routes: { typeRoutes, callableRoutes, propertyRoutes, namespaceRoutes, moduleRoutes }, counts: { modules: catalog.modules.length, namespaces: namespaces.length, types: catalog.types.length, members: callableGroups.size, properties: propertyGroups.size } };
}
