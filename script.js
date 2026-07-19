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

  /* scroll reveal */
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
});

/* EmailJS Contact Form Setup */
(function() {
  // IMPORTANT: Initialize EmailJS with your actual PUBLIC_KEY
  if(typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_PUBLIC_KEY");
  }

  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const btn = document.getElementById('submit-btn');

  if(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Update UI to loading state
      btn.innerHTML = 'Sending... <svg viewBox="0 0 24 24"><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18v8l6 4"/></svg>';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';
      statusDiv.className = 'form-status';
      
      // Send form via EmailJS
      // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with actual IDs from EmailJS Dashboard
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(() => {
          btn.innerHTML = 'Message Sent <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>';
          form.reset();
          statusDiv.textContent = 'Thanks! Your message has been sent. We will get back to you shortly.';
          statusDiv.className = 'form-status success';
          
          setTimeout(() => {
            btn.innerHTML = 'Send Message <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            statusDiv.style.display = 'none';
          }, 5000);
        }, (error) => {
          btn.innerHTML = 'Send Message <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
          statusDiv.textContent = 'Oops... Something went wrong. Please try again later.';
          statusDiv.className = 'form-status error';
          console.error('EmailJS Error:', error);
        });
    });
  }
})();

/* Custom Cursor Logic */
(function() {
  if (window.matchMedia("(pointer: coarse)").matches) return; // ignore touch devices

  const cursor = document.querySelector('.unlumen-cursor');
  const follow = document.querySelector('.unlumen-cursor-follow');
  if (!cursor || !follow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let followX = mouseX;
  let followY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Add hover class to interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .bts-card, .serve-card, .btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  function render() {
    // Exact position for the small dot
    cursorX = mouseX;
    cursorY = mouseY;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    // Lerp for the follower (smooth delay)
    followX += (mouseX - followX) * 0.15;
    followY += (mouseY - followY) * 0.15;
    follow.style.transform = `translate3d(${followX}px, ${followY}px, 0)`;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
