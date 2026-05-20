/* CUSTOM CURSOR */
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
const blob = document.getElementById('cursorBlob');
const dot = document.getElementById('cursorDot');

if (isFinePointer) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let blobX = mouseX;
  let blobY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.6;
    dotY += (mouseY - dotY) * 0.6;
    blobX += (mouseX - blobX) * 0.16;
    blobY += (mouseY - blobY) * 0.16;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    blob.style.transform = `translate(${blobX}px, ${blobY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effects to interactive elements
  document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      blob.classList.add('hover');
      dot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      blob.classList.remove('hover');
      dot.classList.remove('hover');
    });
  });

  // Add click effect
  window.addEventListener('mousedown', () => blob.classList.add('click'));
  window.addEventListener('mouseup', () => blob.classList.remove('click'));
} else {
  blob.style.display = 'none';
  dot.style.display = 'none';
}

/* STICKY NAVIGATION */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* SCROLL REVEAL ANIMATIONS */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.fade-in').forEach((el) => io.observe(el));
