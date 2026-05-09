// ── SMOOTH SCROLL (LENIS) ──
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ── CURSOR ──
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (dot) {
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (ring) {
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animRing);
})();

// Cursor interactions
document.querySelectorAll('a, button, .feature-card, .case-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (ring) {
      ring.style.width = '70px';
      ring.style.height = '70px';
      ring.style.background = 'rgba(255,255,255,0.05)';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (ring) {
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.background = 'transparent';
    }
  });
});

// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const loaderLogo = document.getElementById('loader-logo');
  const loaderBar = document.getElementById('loader-bar');

  gsap.to(loaderLogo, { opacity: 1, y: 0, duration: 1 });
  if (loaderBar) loaderBar.style.width = '100%';

  setTimeout(() => {
    gsap.to(loader, {
      opacity: 0,
      duration: 1,
      ease: 'power3.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        initApp();
      }
    });
  }, 1800);
});

// ── INITIALIZE APP ──
function initApp() {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Reveal Animations (Safe & Premium)
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        delay: (i % 3) * 0.1
      }
    );
  });

  gsap.utils.toArray('.reveal-scale').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );
  });

  // 1.5 Sticky Card Stacking Effect
  gsap.utils.toArray('.stack-card').forEach((card, i) => {
    const isLast = i === document.querySelectorAll('.stack-card').length - 1;
    if (!isLast) {
      gsap.to(card, {
        scale: 0.95,
        opacity: 0.5,
        scrollTrigger: {
          trigger: card,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  });

  // 1.6 Pinned Moment Lines Reveal
  const momentLines = gsap.utils.toArray('.moment-line');
  // Show all lines as soon as the section is reached
  ScrollTrigger.create({
    trigger: '.moment-pin-wrapper',
    start: 'top 80%',
    onEnter: () => {
      momentLines.forEach((line) => line.classList.add('active'));
      gsap.to(momentLines, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.06,
        overwrite: true
      });
    },
    onEnterBack: () => {
      momentLines.forEach((line) => line.classList.add('active'));
      gsap.to(momentLines, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: true
      });
    }
  });

  // 2. Magnetic Buttons
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-logo').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
    });
  });

  // 3. Hero Interactivity (Layered Parallax)
  const visual = document.querySelector('.hero-visual');
  const settings = document.querySelector('.mockup-settings');
  const preview = document.querySelector('.mockup-preview');
  const floating = document.querySelector('.ui-tag-float');

  if (visual && settings && preview) {
    visual.addEventListener('mousemove', e => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = visual.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      // Background layer (Settings) - subtle movement
      gsap.to(settings, {
        rotationY: 15 + x * 5,
        rotationX: 5 - y * 5,
        x: x * 20,
        y: y * 20,
        duration: 0.8
      });

      // Foreground layer (Preview) - aggressive movement
      gsap.to(preview, {
        rotationY: -10 + x * 10,
        rotationX: 5 - y * 10,
        x: x * 40,
        y: y * 40,
        duration: 0.8
      });

      // Floating tag - most aggressive
      if (floating) {
        gsap.to(floating, {
          x: x * 60,
          y: y * 60,
          duration: 1
        });
      }
    });

    visual.addEventListener('mouseleave', () => {
      gsap.to(settings, { rotationY: 15, rotationX: 5, x: 0, y: 0, duration: 1.2 });
      gsap.to(preview, { rotationY: -10, rotationX: 5, x: 0, y: 0, duration: 1.2 });
      if (floating) gsap.to(floating, { x: 0, y: 0, duration: 1.2 });
    });
  }

  // 4. Dynamic UI Logic (Cycling Status)
  const styles = ['Cinematic Abstract', 'Futuristic 3D', 'Editorial Minimal', 'Creative Tech'];
  const statuses = ['Analyzing Narrative...', 'Building 3D Scene...', 'Rendering 4K...', 'Optimizing Flow...'];
  let styleIdx = 0;
  let statusIdx = 0;

  setInterval(() => {
    const styleEl = document.getElementById('dynamic-style');
    const statusEl = document.getElementById('dynamic-status');
    
    if (styleEl) {
      gsap.to(styleEl, { opacity: 0, y: -5, duration: 0.3, onComplete: () => {
        styleIdx = (styleIdx + 1) % styles.length;
        styleEl.textContent = styles[styleIdx];
        gsap.to(styleEl, { opacity: 1, y: 0, duration: 0.3 });
      }});
    }
    
    if (statusEl) {
      statusIdx = (statusIdx + 1) % statuses.length;
      statusEl.textContent = statuses[statusIdx];
    }
  }, 3000);

  // 5. Parallax Background
  gsap.to('.layer-1', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { scrub: true }
  });
  gsap.to('.layer-2', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { scrub: true }
  });

  // Icons
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── UTILITIES ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
});

// Keep a CSS var with the live header height so fixed-nav sections can offset correctly
function syncNavHeightVar() {
  if (!nav) return;
  const h = Math.ceil(nav.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--nav-h', `${h}px`);
}
syncNavHeightVar();
window.addEventListener('resize', syncNavHeightVar);

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle?.addEventListener('click', () => {
  const isOpening = !navLinks.classList.contains('active');
  if (isOpening) lenis.scrollTo(0, { immediate: true });
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Modal Logic
const overlay = document.getElementById('login-overlay');
document.querySelectorAll('#open-login, .nav-login').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    overlay?.classList.add('open');
    navToggle?.classList.remove('active');
    navLinks?.classList.remove('active');
    document.body.style.overflow = 'hidden';
  });
});
document.getElementById('close-login')?.addEventListener('click', () => {
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    overlay?.classList.remove('open');
    navToggle?.classList.remove('active');
    navLinks?.classList.remove('active');
    document.body.style.overflow = '';
  }
});
