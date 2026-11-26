(() => {
  const reader = document.getElementById('brand-reader');
  const dialog = document.getElementById('expanded-guide');
  const slot = reader.parentElement;
  const viewport = reader.querySelector('.reader-viewport');
  const image = viewport.querySelector('img');
  const select = reader.querySelector('select');
  const previous = reader.querySelector('[data-previous]');
  const next = reader.querySelector('[data-next]');
  const zoom = reader.querySelector('[data-zoom]');
  const expand = reader.querySelector('[data-expand]');
  const counter = reader.querySelector('[data-counter]');
  const shortcuts = [...document.querySelectorAll('.guide-pick')];
  const pdfLink = reader.querySelector('.reader-caption a');
  const pdfFile = pdfLink.href;
  const pages = select.options;
  let touchStart;

  function resetView() {
    reader.classList.remove('is-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'Zoom in';
    viewport.scrollTo(0, 0);
  }

  function showPage(index) {
    if (index < 0 || index >= pages.length) return;
    select.selectedIndex = index;
    const option = pages[index];
    resetView();
    image.alt = option.dataset.description;
    image.src = option.value;
    pdfLink.href = pdfFile + '#page=' + (index + 1);
    counter.textContent = 'Page ' + (index + 1) + ' of ' + pages.length;
    const focused = document.activeElement;
    previous.disabled = index === 0;
    next.disabled = index === pages.length - 1;
    for (const link of shortcuts) {
      if (Number(link.dataset.page) === index + 1) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    if (previous.disabled && focused === previous) next.focus({preventScroll:true});
    if (next.disabled && focused === next) previous.focus({preventScroll:true});
  }

  image.addEventListener('load', () => {
    if (image.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      image.animate([{ opacity: .8 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
    }
  });
  previous.addEventListener('click', () => showPage(select.selectedIndex - 1));
  next.addEventListener('click', () => showPage(select.selectedIndex + 1));
  select.addEventListener('change', () => showPage(select.selectedIndex));
  for (const link of shortcuts) {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      showPage(Number(link.dataset.page) - 1);
      viewport.focus({preventScroll:true});
      reader.scrollIntoView({block:'nearest', behavior:'instant'});
    });
  }

  reader.addEventListener('keydown', event => {
    if (event.target === select || event.altKey || event.ctrlKey || event.metaKey ||
        (reader.classList.contains('is-zoomed') && event.target === viewport)) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPage(select.selectedIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  viewport.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? event.touches[0] : null;
  }, {passive:true});
  viewport.addEventListener('touchcancel', () => { touchStart = null; });
  viewport.addEventListener('touchend', event => {
    if (!touchStart || reader.classList.contains('is-zoomed') || event.touches.length) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - touchStart.clientX;
    const dy = end.clientY - touchStart.clientY;
    touchStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      showPage(select.selectedIndex + (dx < 0 ? 1 : -1));
    }
  }, {passive:true});

  zoom.addEventListener('click', () => {
    if (reader.classList.contains('is-zoomed')) resetView();
    else {
      reader.classList.add('is-zoomed');
      zoom.setAttribute('aria-pressed', 'true');
      zoom.textContent = 'Fit page';
    }
  });

  expand.hidden = typeof dialog.showModal !== 'function';
  expand.addEventListener('click', () => {
    if (dialog.open) { dialog.close(); return; }
    dialog.append(reader);
    expand.textContent = 'Close';
    dialog.showModal();
    expand.focus();
  });
  dialog.addEventListener('close', () => {
    slot.append(reader);
    resetView();
    expand.textContent = 'Expand';
    expand.focus({preventScroll:true});
  });

  reader.querySelector('.reader-toolbar').hidden = false;
})();
