(() => {
  const gallery = document.querySelector('[data-work-gallery]');
  if (!gallery) return;
  const track = gallery.querySelector('.qr-track');
  const cards = [...track.querySelectorAll('.qr-card')];
  if (cards.length < 2) return;
  const controls = gallery.querySelector('.qr-controls');
  const prev = gallery.querySelector('[data-prev]');
  const next = gallery.querySelector('[data-next]');
  const toggle = gallery.querySelector('[data-autoplay]');
  const count = gallery.querySelector('.qr-position');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 8000;
  let stopped = reduce.matches;
  let hovered = false;
  let inView = !('IntersectionObserver' in window);
  let timer;
  const max = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const move = dir => track.scrollBy({ left: step() * dir, behavior: reduce.matches ? 'auto' : 'smooth' });
  const schedule = () => {
    clearTimeout(timer);
    if (stopped || hovered || !inView || document.hidden || gallery.contains(document.activeElement) || max() <= 2) return;
    timer = setTimeout(() => {
      if (track.scrollLeft >= max() - 2) track.scrollTo({ left: 0, behavior: 'instant' });
      else move(1);
      schedule();
    }, interval);
  };
  const setStopped = value => {
    stopped = value;
    toggle.textContent = stopped ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', stopped ? 'Play automatic project rotation' : 'Pause automatic project rotation');
    schedule();
  };
  const sync = () => {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max() - 2;
    const left = track.scrollLeft;
    const edge = track.clientWidth + left;
    const start = cards[0].offsetLeft;
    const first = cards.findIndex(card => card.offsetLeft - start + card.offsetWidth / 2 > left + 2);
    const last = cards.reduce((n, card, i) => card.offsetLeft - start + card.offsetWidth <= edge + 2 ? i : n, -1);
    const from = Math.max(1, first + 1);
    const to = Math.max(from, last + 1);
    const fmt = n => String(n).padStart(2, '0');
    const display = (from === to ? fmt(from) : fmt(from) + '–' + fmt(to)) + ' / ' + fmt(cards.length);
    if (count.textContent !== display) count.textContent = display;
  };
  const manual = dir => { setStopped(true); move(dir); };
  prev.addEventListener('click', () => manual(-1));
  next.addEventListener('click', () => manual(1));
  toggle.addEventListener('click', () => setStopped(!stopped));
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('pointerdown', () => setStopped(true), { passive: true });
  track.addEventListener('wheel', e => {
    if (e.deltaX || e.shiftKey) setStopped(true);
  }, { passive: true });
  track.addEventListener('keydown', e => {
    if (e.target !== track || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    manual(e.key === 'ArrowLeft' ? -1 : 1);
  });
  gallery.addEventListener('pointerenter', e => {
    if (e.pointerType !== 'touch') { hovered = true; schedule(); }
  });
  gallery.addEventListener('pointerleave', e => {
    if (e.pointerType !== 'touch') { hovered = false; schedule(); }
  });
  gallery.addEventListener('focusin', schedule);
  gallery.addEventListener('focusout', () => queueMicrotask(schedule));
  document.addEventListener('visibilitychange', schedule);
  reduce.addEventListener('change', e => { if (e.matches) setStopped(true); });
  new ResizeObserver(() => { sync(); schedule(); }).observe(track);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .35;
      schedule();
    }, { threshold: .35 }).observe(track);
  }
  controls.hidden = false;
  sync();
  setStopped(stopped);
})();
