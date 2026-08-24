/* ============================================================
   QRATE. — script.js — shared across all pages
   ============================================================ */

/* Image manifest: WebP is preferred, with JPG fallback. */
const PHOTOS = {
  bts: ['bts-1','bts-2','bts-3','bts-4','bts-5','bts-6']
};

const setResponsiveBackground = (element, stem) => {
  if (!element || !stem) return;
  const webp = new Image();
  webp.onload = () => { element.style.backgroundImage = `url("photos/${stem}.webp")`; };
  webp.onerror = () => { element.style.backgroundImage = `url("photos/${stem}.jpg")`; };
  webp.src = `photos/${stem}.webp`;
};

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('img').forEach(img => {
    if(img.dataset.eager === 'true'){
      img.loading = 'eager'; img.fetchPriority = 'high';
    } else {
      img.loading = 'lazy';
    }
    img.decoding = 'async';
    const hideMissingAsset = () => { img.hidden = true; img.closest('.ticker-item')?.classList.add('text-logo'); };
    img.addEventListener('error', hideMissingAsset, {once:true});
    if(img.complete && !img.naturalWidth) hideMissingAsset();
  });
  document.querySelectorAll('a[target="_blank"]').forEach(link => link.rel = 'noopener noreferrer');

  /* ── Nav scroll state ─────────────────────────────────── */
  const hd = document.getElementById('hd');
  const bar = document.getElementById('progress');
  if(hd){
    const nav = hd.querySelector('nav');
    const menu = hd.querySelector('.navlinks');
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav?.insertBefore(toggle, menu);
    toggle.addEventListener('click', () => {
      const open = hd.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => hd.classList.remove('menu-open')));
    document.addEventListener('keydown', event => { if(event.key === 'Escape') hd.classList.remove('menu-open'); });
  }
  if(hd && !hd.classList.contains('solid')){
    const onScroll = () => {
      hd.classList.toggle('scrolled', window.scrollY > 40);
      if(bar){const h=document.documentElement; bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';}
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* ── BTS photos ───────────────────────────────────────── */
  document.querySelectorAll('[data-bts]').forEach(el => {
    const idx = +el.dataset.bts;
    setResponsiveBackground(el, PHOTOS.bts[idx]);
  });

  /* Framer-style motion system without a framework. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));

  document.querySelectorAll('.card-grid-3,.card-grid-4,.testi-grid,.team-grid,.plans-grid,.res-grid,.bts-grid,.case-flow,.engage-grid,.philosophy-grid,.home-work-grid').forEach(group => {
    [...group.children].forEach((item, index) => {
      item.classList.add('rv', 'motion-card');
      item.style.setProperty('--motion-i', String(index % 5));
    });
  });

  if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.btn').forEach(button => {
      button.classList.add('motion-magnet');
      button.addEventListener('pointermove', event => {
        const box = button.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * .12;
        const y = (event.clientY - box.top - box.height / 2) * .16;
        button.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  /* Presence + layout photo rotation, inspired by Motion's popLayout pattern. */
  const photoFan = document.querySelector('.photo-fan');
  if(photoFan && !reduceMotion){
    const slotClasses = ['fan-one','fan-two','fan-three','fan-four','fan-five'];
    let order = [...photoFan.querySelectorAll('.fan-card')];
    let timer = null, userPaused = false, hoverPaused = false, transitioning = false;
    const toggle = photoFan.querySelector('.fan-toggle');

    const applySlots = () => order.forEach((card, index) => {
      card.classList.remove(...slotClasses);
      card.classList.add(slotClasses[index]);
    });
    const stop = () => { if(timer){ window.clearInterval(timer); timer = null; } };
    const start = () => {
      if(!timer && !userPaused && !hoverPaused && !document.hidden){
        timer = window.setInterval(rotateFan, 4200);
      }
    };
    function rotateFan(){
      if(transitioning || userPaused || hoverPaused || document.hidden) return;
      transitioning = true;
      const outgoing = order[0];
      outgoing.classList.add('fan-is-exiting');
      window.setTimeout(() => {
        order = [...order.slice(1), outgoing];
        outgoing.classList.add('fan-no-motion', 'fan-is-entering');
        outgoing.classList.remove('fan-is-exiting');
        applySlots();
        void outgoing.offsetWidth;
        requestAnimationFrame(() => {
          outgoing.classList.remove('fan-no-motion');
          requestAnimationFrame(() => {
            outgoing.classList.remove('fan-is-entering');
            transitioning = false;
          });
        });
      }, 460);
    }

    toggle?.addEventListener('click', () => {
      userPaused = !userPaused;
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.setAttribute('aria-label', userPaused ? 'Play photo animation' : 'Pause photo animation');
      toggle.textContent = userPaused ? 'Play motion' : 'Pause motion';
      userPaused ? stop() : start();
    });
    photoFan.addEventListener('mouseenter', () => { hoverPaused = true; stop(); });
    photoFan.addEventListener('mouseleave', () => { hoverPaused = false; start(); });
    photoFan.addEventListener('focusin', () => { hoverPaused = true; stop(); });
    photoFan.addEventListener('focusout', event => {
      if(!photoFan.contains(event.relatedTarget)){ hoverPaused = false; start(); }
    });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    window.setTimeout(() => { photoFan.classList.add('fan-motion-ready'); start(); }, 1300);
  }

  /* 3D Rotating Services Deck Carousel */
  const serviceDeck = document.querySelector('[data-service-deck]');
  if(serviceDeck){
    const serviceCards = [...serviceDeck.querySelectorAll('[data-service-card]')];
    const serviceCount = serviceDeck.querySelector('[data-service-count]');
    const serviceDots = [...serviceDeck.querySelectorAll('.service-dot')];
    const track = serviceDeck.querySelector('[data-service-track]');

    let currentIndex = 0;
    const total = serviceCards.length;
    let autoplayTimer = null;
    let isHovered = false;

    const updateDeck = nextIndex => {
      currentIndex = (nextIndex + total) % total;

      serviceCards.forEach((card, index) => {
        let diff = index - currentIndex;
        if(diff > total / 2) diff -= total;
        if(diff < -total / 2) diff += total;

        card.classList.remove('is-active','is-prev','is-next','is-far-left','is-far-right');

        if(diff === 0){
          card.classList.add('is-active');
          card.setAttribute('aria-hidden','false');
          card.querySelectorAll('a').forEach(a => a.removeAttribute('tabindex'));
        } else if(diff === -1){
          card.classList.add('is-prev');
          card.setAttribute('aria-hidden','true');
          card.querySelectorAll('a').forEach(a => a.setAttribute('tabindex','-1'));
        } else if(diff === 1){
          card.classList.add('is-next');
          card.setAttribute('aria-hidden','true');
          card.querySelectorAll('a').forEach(a => a.setAttribute('tabindex','-1'));
        } else if(diff < -1){
          card.classList.add('is-far-left');
          card.setAttribute('aria-hidden','true');
          card.querySelectorAll('a').forEach(a => a.setAttribute('tabindex','-1'));
        } else {
          card.classList.add('is-far-right');
          card.setAttribute('aria-hidden','true');
          card.querySelectorAll('a').forEach(a => a.setAttribute('tabindex','-1'));
        }
      });

      if(serviceCount){
        serviceCount.textContent = `${String(currentIndex + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
      }

      serviceDots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('is-current', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const nextCard = () => updateDeck(currentIndex + 1);
    const prevCard = () => updateDeck(currentIndex - 1);
    const goToCard = idx => updateDeck(idx);

    let hoverCooldown = false;

    serviceCards.forEach(card => {
      // Hovering over a card pauses autoplay; hovering on side cards brings them to center
      card.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoplay();

        if(hoverCooldown) return;

        if(card.classList.contains('is-prev')){
          hoverCooldown = true;
          prevCard();
          setTimeout(() => { hoverCooldown = false; }, 380);
        } else if(card.classList.contains('is-next')){
          hoverCooldown = true;
          nextCard();
          setTimeout(() => { hoverCooldown = false; }, 380);
        }
      });

      // When pointer leaves the card outline, auto-resume after 2s
      card.addEventListener('mouseleave', e => {
        const nextTarget = e.relatedTarget;
        if(!nextTarget || !nextTarget.closest('[data-service-card]')){
          isHovered = false;
          resetAutoplay();
        }
      });

      // Click to select side cards or navigate
      card.addEventListener('click', e => {
        if(e.target.closest('a')) return;
        if(card.classList.contains('is-prev')){
          e.preventDefault();
          prevCard();
          resetAutoplay();
        } else if(card.classList.contains('is-next')){
          e.preventDefault();
          nextCard();
          resetAutoplay();
        }
      });
    });

    serviceDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToCard(idx);
        resetAutoplay();
      });
      dot.addEventListener('mouseenter', () => { isHovered = true; stopAutoplay(); });
      dot.addEventListener('mouseleave', () => { isHovered = false; resetAutoplay(); });
    });

    track?.addEventListener('keydown', e => {
      if(e.key === 'ArrowLeft'){ prevCard(); resetAutoplay(); }
      else if(e.key === 'ArrowRight'){ nextCard(); resetAutoplay(); }
    });

    // Touch and mouse drag swipe gestures
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const onPointerDown = e => {
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      startY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      isDragging = true;
    };

    const onPointerUp = e => {
      if(!isDragging) return;
      isDragging = false;
      const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
      const endY = e.clientY ?? e.changedTouches?.[0]?.clientY ?? 0;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if(Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)){
        if(diffX < 0) nextCard();
        else prevCard();
        resetAutoplay();
      }
    };

    track?.addEventListener('touchstart', onPointerDown, {passive:true});
    track?.addEventListener('touchend', onPointerUp, {passive:true});
    track?.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    const startAutoplay = () => {
      if(reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if(!isHovered && document.visibilityState === 'visible'){
          nextCard();
        }
      }, 2000);
    };

    const stopAutoplay = () => {
      if(autoplayTimer) clearInterval(autoplayTimer);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    serviceDeck.addEventListener('focusin', () => { isHovered = true; stopAutoplay(); });
    serviceDeck.addEventListener('focusout', e => {
      if(!serviceDeck.contains(e.relatedTarget)){
        isHovered = false;
        resetAutoplay();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if(document.hidden) stopAutoplay();
      else startAutoplay();
    });

    if(reduceMotion){
      serviceCards.forEach(card => {
        card.setAttribute('aria-hidden','false');
        card.querySelectorAll('a').forEach(link => link.removeAttribute('tabindex'));
      });
    } else {
      updateDeck(0);
      startAutoplay();
    }
  }

  /* Progressive process line on scroll */
  const processTimeline = document.querySelector('[data-process-timeline]');
  const processSteps = processTimeline ? [...processTimeline.querySelectorAll('.process-step')] : [];
  let scrollMotionQueued = false;

  const updateProcessScroll = () => {
    scrollMotionQueued = false;
    if(processTimeline && processSteps.length && !reduceMotion){
      const box = processTimeline.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * .76 - box.top) / Math.max(1, box.height * .9)));
      processTimeline.style.setProperty('--process-progress', progress.toFixed(3));
      const thresholds = processSteps.length === 3 ? [.04,.47,.88] : processSteps.map((_,index) => index / Math.max(1,processSteps.length - 1));
      processSteps.forEach((step,index) => step.classList.toggle('is-reached', progress >= thresholds[index]));
    }
  };

  const scheduleProcessScroll = () => {
    if(scrollMotionQueued) return;
    scrollMotionQueued = true;
    requestAnimationFrame(updateProcessScroll);
  };

  if(reduceMotion){
    processTimeline?.style.setProperty('--process-progress','1');
    processSteps.forEach(step => step.classList.add('is-reached'));
  } else if(processTimeline){
    window.addEventListener('scroll', scheduleProcessScroll, {passive:true});
    window.addEventListener('resize', scheduleProcessScroll, {passive:true});
    updateProcessScroll();
  }

  /* ── Scroll reveal ────────────────────────────────────── */
  const io = new IntersectionObserver(es => {
    es.forEach(e => {if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* ── Animated counters ────────────────────────────────── */
  const cio = new IntersectionObserver(es => {
    es.forEach(e => {
      if(!e.isIntersecting) return;
      const el=e.target, to=+el.dataset.to, dur=1400, t0=performance.now();
      const tick=t=>{const p=Math.min((t-t0)/dur,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);};
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  },{threshold:.6});
  document.querySelectorAll('.count').forEach(el => cio.observe(el));

  /* ── FAQ accordion ────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── Active nav link ──────────────────────────────────── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop()?.split('#')[0] || '';
    if(href === path || (path === 'index.html' && (href === '' || href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* Async contact form with an accessible success/error state. */
  const contactForm = document.querySelector('[data-contact-form]');
  /* ── EmailJS Integration Config ────────────────────────── */
  const EMAILJS_PUBLIC_KEY  = '2NOszPePvv_fItVmV';  // EmailJS Public Key
  const EMAILJS_SERVICE_ID  = 'Babu';               // EmailJS Service ID
  const EMAILJS_TEMPLATE_ID = 'template_oog0e2p';   // EmailJS Template ID

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) { console.warn('EmailJS init error:', e); }
  }

  if(contactForm){
    const status = document.getElementById('formStatus');
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      const submit = contactForm.querySelector('[type="submit"]');
      submit.disabled = true;
      submit.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';

      // Check if EmailJS is configured
      if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        try {
          await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);
          contactForm.reset();
          status.classList.add('success');
          status.textContent = 'Thank you! Your project note is with Qrate — we will reply within one working day.';
        } catch(error) {
          status.classList.add('error');
          status.innerHTML = 'The form could not send via EmailJS. Please email <a href="mailto:comms@qrate.rw">comms@qrate.rw</a> directly.';
        } finally {
          submit.disabled = false;
          submit.textContent = 'Send project note';
        }
      } else {
        // Fallback: Submit via AJAX FormSubmit endpoint if EmailJS keys are pending
        try {
          const response = await fetch(contactForm.action || 'https://formsubmit.co/ajax/comms@qrate.rw', {
            method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' }
          });
          if(!response.ok) throw new Error('Submission failed');
          contactForm.reset();
          status.classList.add('success');
          status.textContent = 'Thank you. Your project note is with Qrate — we will reply within one working day.';
        } catch(error) {
          status.classList.add('error');
          status.innerHTML = 'The form could not send. Please email <a href="mailto:comms@qrate.rw">comms@qrate.rw</a>.';
        } finally {
          submit.disabled = false;
          submit.textContent = 'Send project note';
        }
      }
    });
  }

  /* ── Resource Modal Viewer ────────────────────────────── */
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const modalId = trigger.dataset.openModal;
      const modal = document.getElementById(modalId);
      if(modal){
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-close')?.focus();
      }
    });
  });

  const closeModal = modal => {
    if(!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
      if(e.target === el || el.classList.contains('modal-close')){
        closeModal(el.closest('.modal-overlay'));
      }
    });
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      const activeModal = document.querySelector('.modal-overlay.active');
      if(activeModal) closeModal(activeModal);
    }
  });

  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.copyTarget;
      const text = document.getElementById(targetId)?.innerText;
      if(text){
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied to clipboard!';
          setTimeout(() => btn.textContent = orig, 2000);
        });
      }
    });
  });

});

