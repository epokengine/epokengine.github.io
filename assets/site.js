document.querySelectorAll('pre').forEach(pre => {
  if (pre.closest('.api-code')) return;
  const button = document.createElement('button');
  button.className = 'copy-button'; button.type = 'button'; button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code to clipboard');
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(pre.querySelector('code')?.textContent || pre.textContent); button.textContent = 'Copied'; }
    catch { button.textContent = 'Select text to copy'; }
    setTimeout(() => { button.textContent = 'Copy'; }, 2400);
  });
  pre.append(button);
});

document.querySelectorAll('[data-copy-code]').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.closest('.api-code')?.querySelector('code')?.textContent || '';
    try { await navigator.clipboard.writeText(value); button.textContent = 'Copied'; }
    catch { button.textContent = 'Select the code'; }
    setTimeout(() => { button.textContent = 'Copy'; }, 2400);
  });
});

const apiNavigationRoot = document.querySelector('[data-api-navigation]');
if (apiNavigationRoot) {
  const activeFamily = apiNavigationRoot.dataset.activeFamily;
  const activeNamespace = apiNavigationRoot.dataset.activeNamespace;
  const activeType = apiNavigationRoot.dataset.activeType;
  const activeSymbol = apiNavigationRoot.dataset.activeSymbol;
  const symbolLink = item => {
    const link = document.createElement('a');
    const name = document.createElement('code');
    const kind = document.createElement('span');
    link.href = item.url;
    link.title = `${item.qualified || item.name} — ${item.kind}`;
    name.textContent = item.name;
    kind.textContent = item.kind;
    link.append(name, kind);
    if (item.qualified === activeSymbol) link.setAttribute('aria-current', 'page');
    return link;
  };
  const symbolGroup = (label, items) => {
    if (!items.length) return null;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const list = document.createElement('div');
    details.className = 'api-tree-symbols';
    summary.textContent = `${label} (${items.length})`;
    for (const item of items) list.append(symbolLink(item));
    details.append(summary, list);
    if (items.some(item => item.qualified === activeSymbol)) details.open = true;
    return details;
  };
  fetch('/assets/api-navigation.json').then(response => {
    if (!response.ok) throw new Error('Navigation unavailable');
    return response.json();
  }).then(navigation => {
    apiNavigationRoot.replaceChildren();
    for (const family of navigation.families) {
      const familyDetails = document.createElement('details');
      const familySummary = document.createElement('summary');
      const familyBody = document.createElement('div');
      const familyOverview = document.createElement('a');
      familyDetails.className = 'api-tree-family';
      familySummary.textContent = family.label;
      familyOverview.className = 'api-tree-overview';
      familyOverview.href = family.url;
      familyOverview.textContent = `${family.label} overview`;
      familyBody.append(familyOverview);
      familyDetails.open = family.name === activeFamily || (!activeFamily && family.name === 'epok');
      for (const namespace of family.namespaces) {
        const namespaceDetails = document.createElement('details');
        const namespaceSummary = document.createElement('summary');
        const namespaceBody = document.createElement('div');
        const namespaceOverview = document.createElement('a');
        namespaceDetails.className = 'api-tree-namespace';
        namespaceSummary.textContent = namespace.name;
        namespaceOverview.className = 'api-tree-overview';
        namespaceOverview.href = namespace.url;
        namespaceOverview.textContent = 'Namespace overview';
        if (namespace.name === activeNamespace && !activeType && !activeSymbol) namespaceOverview.setAttribute('aria-current', 'page');
        namespaceBody.append(namespaceOverview);
        namespaceDetails.open = namespace.name === activeNamespace;
        const functions = symbolGroup('Functions', namespace.functions);
        const properties = symbolGroup('Variables and constants', namespace.properties);
        if (functions) namespaceBody.append(functions);
        if (properties) namespaceBody.append(properties);
        if (namespace.types.length) {
          const heading = document.createElement('p');
          heading.className = 'api-tree-heading';
          heading.textContent = `Types (${namespace.types.length})`;
          namespaceBody.append(heading);
        }
        for (const type of namespace.types) {
          const typeBlock = document.createElement('div');
          const row = document.createElement('div');
          const typeLink = symbolLink(type);
          const members = document.createElement('div');
          const expanded = type.qualified === activeType;
          typeBlock.className = 'api-tree-type';
          row.className = 'api-tree-type-row';
          members.className = 'api-tree-members';
          members.hidden = !expanded;
          if (expanded && !activeSymbol) typeLink.setAttribute('aria-current', 'page');
          row.append(typeLink);
          if (type.members.length) {
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.textContent = expanded ? '−' : '+';
            toggle.setAttribute('aria-expanded', String(expanded));
            toggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} members of ${type.qualified}`);
            toggle.addEventListener('click', () => {
              const open = members.hidden;
              members.hidden = !open;
              toggle.textContent = open ? '−' : '+';
              toggle.setAttribute('aria-expanded', String(open));
              toggle.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} members of ${type.qualified}`);
            });
            row.append(toggle);
            for (const member of type.members) members.append(symbolLink(member));
          }
          typeBlock.append(row, members);
          namespaceBody.append(typeBlock);
        }
        namespaceDetails.append(namespaceSummary, namespaceBody);
        familyBody.append(namespaceDetails);
      }
      familyDetails.append(familySummary, familyBody);
      apiNavigationRoot.append(familyDetails);
    }
    const current = apiNavigationRoot.querySelector('[aria-current="page"]');
    if (current && matchMedia('(min-width: 761px)').matches) requestAnimationFrame(() => current.scrollIntoView({ block: 'center' }));
  }).catch(() => {
    apiNavigationRoot.innerHTML = '<p>The complete tree could not be loaded. Use the API search or family indexes.</p>';
  });
}

const input = document.querySelector('#search');
if (input) {
  const form = input.closest('form'), results = document.querySelector('.search-results'), grid = document.querySelector('.guide-grid'), status = document.querySelector('.search-status');
  let indexPromise;
  const getIndex = () => indexPromise ||= fetch('/assets/search.json').then(r => { if (!r.ok) throw new Error('Search unavailable'); return r.json(); }).catch(error => { indexPromise = undefined; throw error; });
  let revision = 0;
  async function search() {
    const current = ++revision, query = input.value.trim();
    const url = new URL(location.href); query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!query) { results.hidden = true; grid.hidden = false; status.textContent = ''; return; }
    status.textContent = 'Searching…';
    try {
      const index = await getIndex(); if (revision !== current) return;
      const terms = query.toLowerCase().split(/\s+/);
      const matches = index.filter(item => terms.every(term => `${item.title} ${item.group} ${item.text}`.toLowerCase().includes(term))).sort((a, b) => Number(b.title.toLowerCase().includes(query.toLowerCase())) - Number(a.title.toLowerCase().includes(query.toLowerCase())));
      results.replaceChildren(); results.hidden = false; grid.hidden = true;
      status.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'guide' : 'guides'} found` : 'No matching guides. Try a different term or clear the search.';
      for (const item of matches) {
        const link = document.createElement('a'), title = document.createElement('h2'), group = document.createElement('span'), excerpt = document.createElement('p');
        link.href = item.url; link.className = 'search-result'; title.textContent = item.title; group.className = 'eyebrow'; group.textContent = item.group;
        const position = item.text.toLowerCase().indexOf(terms[0]); const start = Math.max(0, position - 65);
        excerpt.textContent = (start ? '…' : '') + item.text.slice(start, start + 230) + '…';
        link.append(group, title, excerpt); results.append(link);
      }
    } catch { if (revision === current) { status.textContent = 'Search is unavailable. You can still browse all guides below.'; results.hidden = true; grid.hidden = false; } }
  }
  let timer;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(search, 100); });
  form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); search(); });
  form.addEventListener('reset', () => { clearTimeout(timer); input.value = ''; search(); input.focus(); });
  input.value = new URL(location.href).searchParams.get('q') || ''; if (input.value) search();
}

const apiInput = document.querySelector('[data-api-search]');
if (apiInput) {
  const form = apiInput.closest('form');
  const results = document.querySelector('[data-api-search-results]');
  const status = document.querySelector('[data-api-search-status]');
  let indexPromise;
  let revision = 0;
  const getIndex = () => indexPromise ||= fetch('/assets/api-search.json').then(response => {
    if (!response.ok) throw new Error('API search unavailable');
    return response.json();
  }).catch(error => { indexPromise = undefined; throw error; });
  async function searchApi() {
    const current = ++revision;
    const query = apiInput.value.trim();
    const url = new URL(location.href);
    query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!query) { results.hidden = true; results.replaceChildren(); status.textContent = ''; return; }
    status.textContent = 'Searching symbols…';
    try {
      const index = await getIndex();
      if (current !== revision) return;
      const normalizedQuery = query.toLowerCase();
      const terms = normalizedQuery.split(/\s+/);
      const score = item => {
        const title = item.title.toLowerCase();
        if (title === normalizedQuery) return 0;
        if (title.endsWith(`::${normalizedQuery}`)) return 1;
        if (title.startsWith(normalizedQuery)) return 2;
        if (title.includes(normalizedQuery)) return 3;
        return 4;
      };
      const matches = index.filter(item => terms.every(term => `${item.title} ${item.kind} ${item.namespace} ${item.owner} ${item.text}`.toLowerCase().includes(term))).sort((a, b) => score(a) - score(b) || a.title.localeCompare(b.title)).slice(0, 80);
      results.replaceChildren();
      results.hidden = false;
      status.textContent = matches.length ? `${matches.length}${matches.length === 80 ? '+' : ''} matching symbols` : 'No symbols found. Try a shorter name, namespace or C++ type.';
      for (const item of matches) {
        const link = document.createElement('a');
        const kind = document.createElement('span');
        const title = document.createElement('code');
        const context = document.createElement('small');
        link.href = item.url;
        kind.className = 'api-kind';
        kind.textContent = item.kind;
        title.textContent = item.title;
        context.textContent = [item.family === 'epok' ? 'Epok runtime' : item.family === 'psyqo' ? 'PsyQo SDK' : '', item.owner || item.namespace].filter(Boolean).join(' · ');
        link.append(kind, title, context);
        results.append(link);
      }
    } catch {
      if (current === revision) status.textContent = 'Search is unavailable. Browse by family or namespace below.';
    }
  }
  let timer;
  apiInput.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(searchApi, 80); });
  form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); searchApi(); });
  form.addEventListener('reset', () => { clearTimeout(timer); apiInput.value = ''; searchApi(); apiInput.focus(); });
  apiInput.value = new URL(location.href).searchParams.get('q') || '';
  if (apiInput.value) searchApi();
}
