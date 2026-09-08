document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const slides = [...gallery.querySelectorAll('[data-slide]')];
  const dots = [...gallery.querySelectorAll('[data-go]')];
  const toggle = gallery.querySelector('[data-rotation]');
  const status = gallery.querySelector('[data-status]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, playing = !motion.matches, hovered = false, focused = false;
  let visible = true, timer;

  function schedule() {
    clearTimeout(timer);
    if (playing && !hovered && !focused && visible && !document.hidden) {
      timer = setTimeout(() => show(current + 1), 5000);
    }
  }
  function show(index, announce = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
    gallery.querySelector('[data-count]').textContent = `${current + 1} / ${slides.length}`;
    if (announce) status.textContent = `Image ${current + 1} of ${slides.length}: ${slides[current].dataset.title}`;
    schedule();
  }
  function updateRotation() {
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    schedule();
  }
  gallery.querySelector('[data-previous]').addEventListener('click', () => show(current - 1, true));
  gallery.querySelector('[data-next]').addEventListener('click', () => show(current + 1, true));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
  toggle.addEventListener('click', () => { playing = !playing; updateRotation(); });
  gallery.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; schedule(); } });
  gallery.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  gallery.addEventListener('focusin', () => { focused = true; schedule(); });
  gallery.addEventListener('focusout', event => { focused = gallery.contains(event.relatedTarget); schedule(); });
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { if (motion.matches) { playing = false; updateRotation(); } });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: .15 }).observe(gallery);
  }
  gallery.querySelector('[data-gallery-controls]').hidden = false;
  gallery.querySelectorAll('[data-gallery-arrow]').forEach(button => { button.hidden = false; });
  updateRotation();
  show(0);
});
