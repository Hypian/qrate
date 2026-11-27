(() => {
  const gallery = document.querySelector('[data-work-gallery]');
  if (!gallery) return;
  const track = gallery.querySelector('.qr-track');
  const cards = [...track.querySelectorAll('.qr-card')];
  const controls = gallery.querySelector('.qr-controls');
  const prev = gallery.querySelector('[data-prev]');
  const next = gallery.querySelector('[data-next]');
  const count = gallery.querySelector('.qr-position');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const max = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const sync = () => {
    const atEnd = track.scrollLeft >= max() - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = atEnd;
    const lastVisible = cards.findLastIndex(card => card.offsetLeft - cards[0].offsetLeft + card.offsetWidth <= track.scrollLeft + track.clientWidth + 2);
    const first = cards.findIndex(card => card.offsetLeft - cards[0].offsetLeft + card.offsetWidth / 2 > track.scrollLeft + 2);
    const value = Math.max(1, first + 1);
    const shownEnd = Math.max(value, lastVisible + 1);
    const display = (value === shownEnd ? String(value).padStart(2,'0') : String(value).padStart(2,'0') + '–' + String(shownEnd).padStart(2,'0')) + ' / ' + String(cards.length).padStart(2,'0');
    if (count.textContent !== display) count.textContent = display;
  };
  const move = dir => track.scrollBy({ left: step() * dir, behavior: reduce.matches ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', e => {
    if (e.target !== track || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    move(e.key === 'ArrowLeft' ? -1 : 1);
  });
  new ResizeObserver(sync).observe(track);
  controls.hidden = false;
  sync();
})();
