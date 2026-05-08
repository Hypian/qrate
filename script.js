// ── CURSOR ──
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  if (window.matchMedia('(hover: hover)').matches) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }
});

(function animRing() {
  if (window.matchMedia('(hover: hover)').matches) {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .service-card, .marquee-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '56px';
    ring.style.height = '56px';
    ring.style.borderColor = 'rgba(201,169,110,0.8)';
    dot.style.transform = 'translate(-50%,-50%) scale(2)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '34px';
    ring.style.height = '34px';
    ring.style.borderColor = 'rgba(201,169,110,0.5)';
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ── LOADER ──
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const loaderLogo = document.getElementById('loader-logo');
  const loaderBar  = document.getElementById('loader-bar');
  const loaderSub  = document.getElementById('loader-sub');

  setTimeout(() => {
    loaderLogo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    loaderLogo.style.opacity = '1';
    loaderLogo.style.transform = 'translateY(0)';
  }, 100);
  setTimeout(() => {
    loaderSub.style.transition = 'opacity 0.6s ease';
    loaderSub.style.opacity = '1';
  }, 500);
  setTimeout(() => { loaderBar.style.width = '100%'; }, 300);
  setTimeout(() => {
    loader.style.transition = 'opacity 0.8s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      initHero();
      initScrollAnimations();
    }, 800);
  }, 2000);
});

// ── HERO INIT ──
function initHero() {
  const est = document.querySelector('.hero-est');
  const headline = document.querySelector('.hero-headline');
  const sub = document.querySelector('.hero-sub');
  const meta = document.querySelector('.hero-meta');

  est.style.transition = 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s';
  est.style.opacity = '1'; est.style.transform = 'translateY(0)';

  headline.style.transition = 'opacity 1.1s ease 0.35s, transform 1.1s ease 0.35s';
  headline.style.opacity = '1'; headline.style.transform = 'translateY(0)';

  sub.style.transition = 'opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s';
  sub.style.opacity = '1'; sub.style.transform = 'translateY(0)';

  meta.style.transition = 'opacity 0.8s ease 1s, transform 0.8s ease 1s';
  meta.style.opacity = '1'; meta.style.transform = 'translateY(0)';
}

// ── HERO SLIDE CYCLE ──
const slides = document.querySelectorAll('.hero-slide');
let slideIdx = 0;
setInterval(() => {
  slides[slideIdx].classList.remove('active');
  slideIdx = (slideIdx + 1) % slides.length;
  slides[slideIdx].classList.add('active');
}, 5000);

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ── SCROLL ANIMATIONS ──
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Counter animation
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val) + '+';
          }
        });
      }
    });
  });

  // Reveal animations
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' },
        delay: (i % 3) * 0.12
      }
    );
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      }
    );
  });

  gsap.utils.toArray('.reveal-scale').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.96, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        delay: (i % 2) * 0.15
      }
    );
  });

  // Parallax on hero glow
  gsap.to('.hero-glow', {
    yPercent: -25,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

// ── LOGIN MODAL ──
const overlay = document.getElementById('login-overlay');
document.getElementById('open-login').addEventListener('click', e => {
  e.preventDefault();
  overlay.classList.add('open');
});
document.getElementById('close-login').addEventListener('click', () => {
  overlay.classList.remove('open');
});
overlay.addEventListener('click', e => {
  if (e.target === overlay) overlay.classList.remove('open');
});
document.getElementById('modal-contact-link')?.addEventListener('click', () => {
  overlay.classList.remove('open');
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

// ── FORM ──
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Sending…';
  setTimeout(() => {
    btn.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1200);
  return false;
}

// ── MOBILE MENU ──
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── KEYBOARD ESC ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    overlay.classList.remove('open');
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }
});
