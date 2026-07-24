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

  /* Scroll-led service deck + progressive process line. */
  const serviceScroll = document.querySelector('[data-service-scroll]');
  const serviceCards = serviceScroll ? [...serviceScroll.querySelectorAll('[data-service-card]')] : [];
  const serviceCount = serviceScroll?.querySelector('[data-service-count]');
  const serviceDots = serviceScroll ? [...serviceScroll.querySelectorAll('.service-scroll-track i')] : [];
  const processTimeline = document.querySelector('[data-process-timeline]');
  const processSteps = processTimeline ? [...processTimeline.querySelectorAll('.process-step')] : [];
  let serviceIndex = -1;
  let scrollMotionQueued = false;

  const setServiceIndex = nextIndex => {
    if(!serviceCards.length || nextIndex === serviceIndex) return;
    serviceIndex = nextIndex;
    serviceCards.forEach((card, index) => {
      const distance = index - nextIndex;
      card.classList.remove('is-active','is-prev','is-next','is-far','is-far-left','is-far-right');
      if(distance === 0) card.classList.add('is-active');
      else if(distance === -1) card.classList.add('is-prev');
      else if(distance === 1) card.classList.add('is-next');
      else card.classList.add(distance < 0 ? 'is-far-left' : 'is-far-right');

      const inactive = distance !== 0;
      card.setAttribute('aria-hidden', String(inactive));
      card.querySelectorAll('a').forEach(link => {
        if(inactive) link.setAttribute('tabindex','-1');
        else link.removeAttribute('tabindex');
      });
    });
    if(serviceCount){
      serviceCount.textContent = `${String(nextIndex + 1).padStart(2,'0')} / ${String(serviceCards.length).padStart(2,'0')}`;
    }
    serviceDots.forEach((dot,index) => dot.classList.toggle('is-current', index === nextIndex));
  };

  const updateScrollMotion = () => {
    scrollMotionQueued = false;
    if(serviceScroll && serviceCards.length && !reduceMotion){
      const box = serviceScroll.getBoundingClientRect();
      const travel = Math.max(1, box.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, (72 - box.top) / travel));
      const nextIndex = Math.min(serviceCards.length - 1, Math.round(progress * (serviceCards.length - 1)));
      setServiceIndex(nextIndex);
    }
    if(processTimeline && processSteps.length && !reduceMotion){
      const box = processTimeline.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * .76 - box.top) / Math.max(1, box.height * .9)));
      processTimeline.style.setProperty('--process-progress', progress.toFixed(3));
      const thresholds = processSteps.length === 3 ? [.04,.47,.88] : processSteps.map((_,index) => index / Math.max(1,processSteps.length - 1));
      processSteps.forEach((step,index) => step.classList.toggle('is-reached', progress >= thresholds[index]));
    }
  };

  const scheduleScrollMotion = () => {
    if(scrollMotionQueued) return;
    scrollMotionQueued = true;
    requestAnimationFrame(updateScrollMotion);
  };

  if(reduceMotion){
    serviceCards.forEach(card => {
      card.setAttribute('aria-hidden','false');
      card.querySelectorAll('a').forEach(link => link.removeAttribute('tabindex'));
    });
    processTimeline?.style.setProperty('--process-progress','1');
    processSteps.forEach(step => step.classList.add('is-reached'));
  } else if(serviceScroll || processTimeline){
    setServiceIndex(0);
    window.addEventListener('scroll', scheduleScrollMotion, {passive:true});
    window.addEventListener('resize', scheduleScrollMotion, {passive:true});
    updateScrollMotion();
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

