// Progressive enhancement: every capability is present in the static HTML.
document.querySelectorAll('[data-feature-explorer]').forEach(explorer => {
  const query = explorer.querySelector('[data-feature-query]');
  const fresh = explorer.querySelector('[data-feature-new]');
  const status = explorer.querySelector('[data-feature-status]');
  const results = explorer.querySelector('.feature-results');
  const empty = explorer.querySelector('[data-feature-empty]');
  const buttons = [...explorer.querySelectorAll('[data-feature-category]')];
  const normalize = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
  const items = [...explorer.querySelectorAll('[data-feature]')].map(element => ({ element, text: normalize(element.textContent), category: element.dataset.category, fresh: element.dataset.fresh === 'true' }));
  let category = 'all';
  function filter() {
    const words = normalize(query.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const item of items) {
      const visible = (category === 'all' || item.category === category) && (!fresh.checked || item.fresh) && words.every(word => item.text.includes(word));
      item.element.hidden = !visible;
      if (visible) count++;
    }
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.featureCategory === category)));
    status.textContent = `${count} of ${items.length} features${category === 'all' ? '' : ` · ${category}`}${fresh.checked ? ' · New in this update' : ''}`;
    empty.hidden = count !== 0;
    results.scrollTop = 0;
  }
  query.addEventListener('input', filter);
  fresh.addEventListener('change', filter);
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.featureCategory; filter(); }));
  explorer.querySelectorAll('[data-feature-reset]').forEach(button => button.addEventListener('click', () => {
    category = 'all'; query.value = ''; fresh.checked = false; filter(); query.focus();
  }));
  explorer.querySelectorAll('[data-feature-controls]').forEach(control => { control.hidden = false; });
  explorer.classList.add('is-enhanced');
  filter();
});
