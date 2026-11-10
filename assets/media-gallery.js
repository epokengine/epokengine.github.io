const catalogElement = document.getElementById('media-catalog');
if (catalogElement) {
  const catalog = JSON.parse(catalogElement.textContent);
  const page = document.querySelector('.media-page');
  const tabs = [...page.querySelectorAll('[data-media-tab]')];
  const filters = [...page.querySelectorAll('[data-media-filter]')];
  const panels = [...page.querySelectorAll('[data-media-panel]')];
  const cards = [...page.querySelectorAll('[data-media-card]')];
  const search = page.querySelector('[data-media-search]');
  const viewer = page.querySelector('[data-media-viewer]');
  const stage = viewer.querySelector('[data-viewer-stage]');
  const closeButton = viewer.querySelector('[data-viewer-close]');
  const byId = new Map(catalog.map(item => [item.id, item]));
  let type = 'screenshots', category = 'All', collection = [], current = 0, opener;

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const match = card.dataset.type === type && (category === 'All' || card.dataset.category === category) && card.dataset.search.includes(query);
      card.hidden = !match;
      if (match) count++;
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.mediaPanel !== type; });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mediaFilter === category)));
    page.querySelector('[data-media-count]').textContent = `${count} of ${catalog.filter(item => item.type === type).length} ${type}`;
    page.querySelector('[data-media-empty]').hidden = count !== 0;
  }

  function selectTab(next) {
    type = next;
    tabs.forEach(tab => {
      const selected = tab.dataset.mediaTab === type;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    applyFilters();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.mediaTab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next].dataset.mediaTab);
    });
  });
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.mediaFilter; applyFilters(); }));
  search.addEventListener('input', applyFilters);
  page.querySelector('[data-media-reset]').addEventListener('click', () => { category = 'All'; search.value = ''; applyFilters(); search.focus(); });

  function releaseMedia() {
    const video = stage.querySelector('video');
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    stage.replaceChildren();
  }

  function renderMedia(index) {
    current = (index + collection.length) % collection.length;
    const item = byId.get(collection[current]);
    releaseMedia();
    viewer.querySelector('[data-viewer-label]').textContent = `${item.label} / ${item.type === 'videos' ? 'VIDEO' : 'SCREENSHOT'}`;
    viewer.querySelector('#media-viewer-title').textContent = item.title;
    viewer.querySelector('#media-viewer-description').textContent = item.description;
    viewer.querySelector('[data-viewer-count]').textContent = `${current + 1} / ${collection.length}`;
    viewer.querySelector('[data-viewer-guide]').href = item.guide;
    viewer.querySelector('[data-viewer-original]').href = item.src;
    for (const button of viewer.querySelectorAll('[data-viewer-previous], [data-viewer-next]')) button.hidden = collection.length < 2;
    const media = document.createElement(item.type === 'videos' ? 'video' : 'img');
    if (item.type === 'videos') {
      media.controls = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.poster = item.poster;
      media.setAttribute('aria-label', item.title);
      // Clips are silent. Playback stays under the visitor's control.
    } else {
      media.alt = item.alt;
    }
    media.addEventListener('error', () => {
      const error = document.createElement('p');
      error.setAttribute('role', 'alert');
      error.textContent = 'This media could not be loaded. Try opening the original file below.';
      stage.replaceChildren(error);
    }, { once: true });
    media.src = item.src;
    stage.append(media);
  }

  page.querySelectorAll('[data-media-open]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    opener = link;
    const id = link.dataset.mediaOpen;
    collection = link.closest('[data-media-card]')
      ? cards.filter(card => !card.hidden).map(card => card.querySelector('[data-media-open]').dataset.mediaOpen)
      : catalog.filter(item => item.type === byId.get(id).type).map(item => item.id);
    renderMedia(collection.indexOf(id));
    viewer.showModal();
    closeButton.focus();
  }));
  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => { releaseMedia(); opener?.focus({ preventScroll: true }); });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.querySelector('[data-viewer-previous]').addEventListener('click', () => renderMedia(current - 1));
  viewer.querySelector('[data-viewer-next]').addEventListener('click', () => renderMedia(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.target.closest('video')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      renderMedia(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.dataset.mediaPanel}`);
  });
  page.classList.add('media-enhanced');
  page.querySelectorAll('[data-media-tools]').forEach(control => { control.hidden = false; });
  applyFilters();
}
