/* ============================================================
   QRATE. — Creative Communications
   script.js — Optimized
   ============================================================ */

/* ----------------------------------------------------------
   PHOTOS
   ---------------------------------------------------------- */
const PHOTOS = {
  hero: [
    'photos/hero-1.jpg',
    'photos/hero-2.jpg',
    'photos/hero-3.jpg',
    'photos/hero-4.jpg',
    'photos/hero-5.jpg',
  ],
  bts: [
    'photos/bts-1.jpg',
    'photos/bts-2.jpg',
    'photos/bts-3.jpg',
    'photos/bts-4.jpg',
    'photos/bts-5.jpg',
    'photos/bts-6.jpg',
  ]
};

/* ----------------------------------------------------------
   APPLY PHOTOS — hero eagerly, BTS lazily via IntersectionObserver
   ---------------------------------------------------------- */
function applyPhotos() {
  /* Hero slides — load immediately (above the fold) */
  document.querySelectorAll('.hslide .scene').forEach((scene, i) => {
    if (PHOTOS.hero[i]) {
      scene.style.backgroundImage = `url(${PHOTOS.hero[i]})`;
    }
  });

  /* BTS grid — lazy load when near viewport */
  const btsEls = document.querySelectorAll('[data-bts]');
  if (btsEls.length && 'IntersectionObserver' in window) {
    const lazyObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const idx = +el.dataset.bts;
        if (PHOTOS.bts[idx]) {
          el.style.backgroundImage = `url(${PHOTOS.bts[idx]})`;
        }
        lazyObs.unobserve(el);
      });
    }, { rootMargin: '200px' });
    btsEls.forEach(el => lazyObs.observe(el));
  } else {
    /* Fallback for older browsers */
    btsEls.forEach(el => {
      const idx = +el.dataset.bts;
      if (PHOTOS.bts[idx]) {
        el.style.backgroundImage = `url(${PHOTOS.bts[idx]})`;
      }
    });
  }
}

/* ----------------------------------------------------------
   MAIN
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyPhotos();

  /* scroll progress + nav */
  const hd = document.getElementById('hd');
  const bar = document.getElementById('progress');
  const onScroll = () => {
    hd.classList.toggle('scrolled', scrollY > 40);
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* hero carousel */
  const track = document.getElementById('heroTrack');
  const hslides = track.querySelectorAll('.hslide');
  const barsWrap = document.getElementById('hBars');
  const countEl = document.getElementById('hCount');
  const N = hslides.length;
  let cur = 0, timer;

  hslides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'hbar' + (i === 0 ? ' active' : '');
    b.innerHTML = '<i></i>';
    b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.addEventListener('click', () => { go(i); restart(); });
    barsWrap.appendChild(b);
  });

  const hbars = barsWrap.querySelectorAll('.hbar');

  function go(i) {
    hslides[cur].classList.remove('active');
    cur = (i + N) % N;
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    hslides[cur].classList.add('active');
    hbars.forEach((b, j) => {
      b.classList.toggle('done', j < cur);
      b.classList.remove('active');
      if (j === cur) {
        const f = b.querySelector('i');
        f.style.animation = 'none';
        void f.offsetWidth;
        f.style.animation = '';
        b.classList.add('active');
      }
    });
    countEl.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
  }

  function restart() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5600); }

  document.getElementById('hNext').addEventListener('click', () => { go(cur + 1); restart(); });
  document.getElementById('hPrev').addEventListener('click', () => { go(cur - 1); restart(); });

  /* touch swipe */
  let sx = null;
  track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); restart(); }
    sx = null;
  }, { passive: true });
  restart();

  /* scroll reveal */
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
});
