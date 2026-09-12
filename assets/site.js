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
