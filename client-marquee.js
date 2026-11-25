(() => {
  const strip = document.querySelector('[data-client-marquee]');
  if (!strip) return;
  const button = strip.querySelector('button');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function setMotion(on) {
    strip.dataset.motion = on ? 'running' : 'paused';
    button.textContent = on ? 'Pause logos' : 'Play logos';
  }
  function sync() {
    button.hidden = reduced.matches;
    strip.classList.toggle('qrate-motion-enabled', !reduced.matches);
    setMotion(!reduced.matches);
  }
  button.addEventListener('click', () => setMotion(strip.dataset.motion !== 'running'));
  reduced.addEventListener('change', sync);
  sync();
})();
