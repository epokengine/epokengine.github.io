document.querySelectorAll('pre').forEach(pre => {
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
