/* ============================================================
   QRATE. — script.js — Interactive Handlers for Post-Hype UI
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar (Optimized with requestAnimationFrame)
  const progressBar = document.getElementById('progress');
  let isProgressScheduled = false;
  const updateProgress = () => {
    if (!progressBar) return;
    if (!isProgressScheduled) {
      isProgressScheduled = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - doc.clientHeight;
        const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        progressBar.style.width = `${progress}%`;
        isProgressScheduled = false;
      });
    }
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // 2. Mobile Menu Toggle with Body Scroll Lock
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  if (mobileToggle && mobileDrawer) {
    const toggleMenu = (forceState) => {
      const isOpen = forceState !== undefined ? forceState : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      mobileDrawer.inert = !isOpen;
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu(false);
        mobileToggle.focus();
      }
    });
    window.matchMedia('(max-width: 768px)').addEventListener('change', () => toggleMenu(false));
  }

  // 3. Dynamic Header on Scroll (Switches colors once passing hero section)
  const dynamicHeader = document.querySelector('.header-dynamic');
  const heroSection = document.querySelector('.hero-kraft');
  if (dynamicHeader) {
    // Past the hero the bar dissipates (logo + Start Project only). Sample the
    // surface beneath the logo and flag `.on-light` so the wordmark switches to
    // Impact Night over light backgrounds (stays white over dark sections).
    const headerLogo = dynamicHeader.querySelector('.brand-logo');

    const getSurfaceColor = (el) => {
      while (el && el !== document.documentElement) {
        const bg = getComputedStyle(el).backgroundColor;
        const m = bg && bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const parts = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
          const alpha = parts.length > 3 ? parts[3] : 1;
          if (alpha > 0.5) return parts.slice(0, 3);
        }
        el = el.parentElement;
      }
      return [250, 247, 245]; // Human White canvas fallback
    };

    const isLightBehindHeader = () => {
      const rect = (headerLogo || dynamicHeader).getBoundingClientRect();
      const x = Math.max(1, Math.min(window.innerWidth - 1, rect.left + rect.width / 2));
      const y = Math.max(1, rect.top + rect.height / 2);
      const beneath = document.elementsFromPoint(x, y)
        .find(el => !dynamicHeader.contains(el) && el.id !== 'progress');
      const [r, g, b] = getSurfaceColor(beneath || document.body);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance > 0.6;
    };

    let isHeaderScheduled = false;
    const handleHeaderScroll = () => {
      if (!isHeaderScheduled) {
        isHeaderScheduled = true;
        requestAnimationFrame(() => {
          const threshold = heroSection ? Math.max(heroSection.offsetHeight - 90, 80) : 80;
          if (window.scrollY > threshold) {
            dynamicHeader.classList.add('scrolled');
            dynamicHeader.classList.toggle('on-light', isLightBehindHeader());
            document.body.classList.remove('orange-brand-mode');
          } else {
            dynamicHeader.classList.remove('scrolled', 'on-light');
            document.body.classList.add('orange-brand-mode');
          }
          isHeaderScheduled = false;
        });
      }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    window.addEventListener('resize', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // 4. Scroll-triggered one-time accent animation for logo + CTA
  const scrollAnimatedEls = document.querySelectorAll('[data-scroll-animate]');
  if (scrollAnimatedEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    scrollAnimatedEls.forEach(el => revealObserver.observe(el));
  }

  // 5. FAQ Accordion Logic
  const faqToggles = document.querySelectorAll('.faq-toggle, .accordion-toggle');
  faqToggles.forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      if (!content) return;
      const icon = button.querySelector('.material-symbols-outlined');
      const isOpen = content.getAttribute('data-open') === 'true' || content.classList.contains('open');

      // Close sibling accordions
      document.querySelectorAll('.accordion-content').forEach(c => {
        c.setAttribute('data-open', 'false');
        c.classList.remove('open');
      });
      document.querySelectorAll('.faq-toggle .material-symbols-outlined, .accordion-toggle .material-symbols-outlined').forEach(i => {
        i.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.setAttribute('data-open', 'true');
        content.classList.add('open');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Each guide has a bookmarkable URL and a native keyboard-accessible dialog.
  const guideLinks = [...document.querySelectorAll('[data-guide]')];
  if (guideLinks.length) {
    let opener = null;
    const guideForHash = () => {
      const id = window.location.hash.slice(1);
      return guideLinks.some(link => link.dataset.guide === id) ? document.getElementById(id) : null;
    };
    const syncGuide = () => {
      const next = guideForHash();
      const current = document.querySelector('.guide-dialog[open]');
      if (current && current !== next) current.close();
      if (next && !next.open) next.showModal();
    };
    guideLinks.forEach(link => {
      link.addEventListener('click', () => {
        opener = link;
        if (link.hash === window.location.hash) syncGuide();
      });
      const dialog = document.getElementById(link.dataset.guide);
      dialog.addEventListener('close', () => {
        if (guideForHash() === dialog) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        if (!guideForHash()) (opener || link).focus({ preventScroll: true });
      });
    });
    window.addEventListener('hashchange', syncGuide);
    syncGuide();
  }

  // 5. Contact Form EmailJS Handling
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const statusBox = document.getElementById('formStatus');
      if (submitBtn?.disabled) return;
      const originalMarkup = submitBtn ? submitBtn.innerHTML : '';
      const emailConfig = window.qrateEmailJs || {};
      const publicKey = emailConfig.publicKey || 'YOUR_PUBLIC_KEY';
      const serviceId = emailConfig.serviceId || 'YOUR_SERVICE_ID';
      const templateId = emailConfig.templateId || 'YOUR_TEMPLATE_ID';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.classList.add('is-sending');
        submitBtn.innerHTML = '<span class="sending-label">Sending...</span>';
      }

      try {
        if (!window.emailjs || !window.emailjs.send) {
          throw new Error('EmailJS library not loaded');
        }

        if (
          publicKey.includes('YOUR_') ||
          serviceId.includes('YOUR_') ||
          templateId.includes('YOUR_')
        ) {
          throw new Error('EmailJS config missing');
        }

        const formData = new FormData(contactForm);
        const templateParams = {
          name: formData.get('name') || '',
          email: formData.get('email') || '',
          organisation: formData.get('organization') || 'Not provided',
          service: formData.get('service') || 'Not specified',
          message: formData.get('message') || ''
        };

        await emailjs.send(serviceId, templateId, templateParams, {
          publicKey: publicKey,
        });

        if (statusBox) {
          statusBox.innerHTML = `
            <div class="form-status-panel success" role="alert" aria-live="polite">
              <div class="form-status-icon">
                <span class="material-symbols-outlined">check</span>
              </div>
              <div class="form-status-copy">
                <strong>Enquiry submitted</strong>
                <p>Thank you. Our email service accepted your enquiry.</p>
              </div>
            </div>
          `;
        }
        contactForm.reset();
      } catch (err) {
        if (statusBox) {
          statusBox.innerHTML = `
            <div class="form-status-panel error" role="alert" aria-live="assertive">
              <div class="form-status-icon error-icon">
                <span class="material-symbols-outlined">error</span>
              </div>
              <div class="form-status-copy">
                <strong>Could not send</strong>
                <p>Please email us directly at <a href="mailto:comms@qrate.rw">comms@qrate.rw</a>.</p>
              </div>
            </div>
          `;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.classList.remove('is-sending');
          submitBtn.innerHTML = originalMarkup;
        }
      }
    });
  }

  // 6. External link target attributes
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // 7. Forest Green Feature Stage Tabs Auto-Rotation (2-Second Show) & Interactive Handlers
  const forestTabBtns = document.querySelectorAll('.forest-tab-btn');
  const stageSlides = document.querySelectorAll('.stage-slide');

  if (forestTabBtns.length > 0 && stageSlides.length > 0) {
    let currentStageIdx = 0;
    let stageInterval = null;

    const setStageTab = (idx) => {
      currentStageIdx = Number(idx);

      // Update active tab buttons and color highlighting
      forestTabBtns.forEach((btn, i) => {
        const isMatch = i === currentStageIdx;
        btn.classList.toggle('active', isMatch);
        const phaseTag = btn.querySelector('.phase-tag') || btn.querySelector('p');
        if (phaseTag) {
          if (isMatch) {
            phaseTag.classList.remove('text-on-surface-variant');
            phaseTag.classList.add('text-rust');
          } else {
            phaseTag.classList.remove('text-rust');
            phaseTag.classList.add('text-on-surface-variant');
          }
        }
      });

      // Update active photo slide
      stageSlides.forEach((slide, i) => {
        if (i === currentStageIdx) {
          slide.classList.remove('opacity-0', 'pointer-events-none');
          slide.classList.add('active');
        } else {
          slide.classList.add('opacity-0', 'pointer-events-none');
          slide.classList.remove('active');
        }
      });
    };

    const startStageTimer = () => {
      if (stageInterval) clearInterval(stageInterval);
      stageInterval = setInterval(() => {
        const nextIdx = (currentStageIdx + 1) % forestTabBtns.length;
        setStageTab(nextIdx);
      }, 3000); // 3 seconds show
    };

    // User click interactions
    forestTabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        setStageTab(idx);
        startStageTimer(); // Reset timer so it shows for full 2s from click
      });
    });

    // Initialize first state and start timer
    setStageTab(0);
    startStageTimer();
  }

  // Enable third-party players only after a visitor has chosen them.
  const preferences = document.getElementById('media-preferences');
  if (preferences) {
    const key = 'qrate_media_preference';
    let choice = 'essential';
    try {
      choice = localStorage.getItem(key) === 'allow' ? 'allow' : 'essential';
      localStorage.removeItem('qrate_cookie_consent');
    } catch { /* Storage may be unavailable in private browsing. */ }

    function applyChoice() {
      preferences.querySelector('#media-choice').textContent =
        choice === 'allow' ? 'Embedded videos are on.' : 'Embedded videos are off.';
      document.querySelectorAll('[data-video]').forEach(container => {
        const placeholder = container.querySelector('.player-placeholder');
        const frame = container.querySelector('iframe');
        placeholder.hidden = choice === 'allow';
        if (choice === 'allow' && !frame) {
          const player = document.createElement('iframe');
          player.title = container.dataset.title;
          player.src = 'https://www.youtube-nocookie.com/embed/' + container.dataset.video;
          player.loading = 'lazy';
          player.allow = 'encrypted-media; picture-in-picture; fullscreen';
          player.allowFullscreen = true;
          container.append(player);
        } else if (choice !== 'allow' && frame) {
          frame.remove();
        }
      });
    }
    document.querySelectorAll('.open-cookie-settings').forEach(button => {
      button.addEventListener('click', () => preferences.showModal());
    });
    preferences.querySelectorAll('[data-media-choice]').forEach(button => {
      button.addEventListener('click', () => {
        choice = button.dataset.mediaChoice;
        try { localStorage.setItem(key, choice); } catch { /* Use this choice for this visit. */ }
        preferences.close();
        applyChoice();
      });
    });
    window.addEventListener('storage', event => {
      if (event.key === key || event.key === null) {
        choice = event.newValue === 'allow' ? 'allow' : 'essential';
        applyChoice();
      }
    });
    applyChoice();
  }

  // 8. Skiper27 Rolling Text Animation (Spins once when scrolled into view)
  const rollingTextEls = document.querySelectorAll('[data-rolling-text]');
  if (rollingTextEls.length > 0) {
    rollingTextEls.forEach(el => {
      const rawText = el.textContent.replace(/\s+/g, ' ').trim();
      if (!rawText) return;
      el.setAttribute('aria-label', rawText);

      const words = rawText.split(' ');
      const totalChars = rawText.replace(/\s+/g, '').length;
      const centerIndex = totalChars / 2;
      let charCounter = 0;

      el.innerHTML = '';
      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'rolling-word';
        wordSpan.setAttribute('aria-hidden', 'true');

        Array.from(word).forEach(ch => {
          const charSpan = document.createElement('span');
          charSpan.className = 'rolling-char';

          // Center-to-edges wave + progressive stagger (Skiper27 timing)
          const distFromCenter = Math.abs(charCounter - centerIndex) / Math.max(centerIndex, 1);
          const progressive = charCounter / Math.max(totalChars, 1);
          const delay = (progressive * 0.45 + distFromCenter * 0.22).toFixed(3);
          charSpan.style.setProperty('--char-delay', `${delay}s`);

          const trackSpan = document.createElement('span');
          trackSpan.className = 'rolling-char-track';
          trackSpan.setAttribute('data-char', ch);
          trackSpan.textContent = ch;

          charSpan.appendChild(trackSpan);
          wordSpan.appendChild(charSpan);
          charCounter++;
        });

        el.appendChild(wordSpan);
        if (wIdx < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
    });

    // Re-plays every time the text scrolls into view (up or down).
    // Once fully out of view it snaps back instantly (no reverse roll) so the
    // next pass animates again.
    const rollingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          el.classList.add('is-rolling-active');
        } else if (!entry.isIntersecting && el.classList.contains('is-rolling-active')) {
          el.classList.add('is-rolling-reset');
          el.classList.remove('is-rolling-active');
          void el.offsetWidth; // flush styles so the snap-back skips the transition
          el.classList.remove('is-rolling-reset');
        }
      });
    }, { threshold: [0, 0.35] });

    rollingTextEls.forEach(el => rollingObserver.observe(el));
  }

  // 9. Liquid Threshold Morphing Text Animation (#advantage-title)
  const morphHeadings = document.querySelectorAll('[data-morph-heading]');
  if (morphHeadings.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const morphPhrases = [
      'Infinite scale,<br><em>expert validation.</em>',
      'Authentic cinema,<br><em>ethical storytelling.</em>',
      'Strategic clarity,<br><em>donor confidence.</em>',
      'Accountable craft,<br><em>dignity by design.</em>'
    ];

    morphHeadings.forEach(heading => {
      const layer1 = heading.querySelector('.morph-layer-1');
      const layer2 = heading.querySelector('.morph-layer-2');
      if (!layer1 || !layer2) return;

      const morphTime = 1.35;
      const cooldownTime = 2.4;
      let textIndex = 0;
      let morph = 0;
      let cooldown = cooldownTime;
      let lastTime = performance.now();
      let isVisible = false;
      let rafId = null;

      const setMorph = (fraction) => {
        heading.classList.add('is-morphing');
        const safeFrac = Math.max(fraction, 0.0001);
        const invFrac = Math.max(1 - fraction, 0.0001);

        layer2.style.filter = `blur(${Math.min(8 / safeFrac - 8, 100).toFixed(2)}px)`;
        layer2.style.opacity = `${(Math.pow(safeFrac, 0.4) * 100).toFixed(1)}%`;

        layer1.style.filter = `blur(${Math.min(8 / invFrac - 8, 100).toFixed(2)}px)`;
        layer1.style.opacity = `${(Math.pow(invFrac, 0.4) * 100).toFixed(1)}%`;
      };

      const doCooldown = () => {
        morph = 0;
        heading.classList.remove('is-morphing');
        layer2.style.filter = '';
        layer2.style.opacity = '100%';
        layer1.style.filter = '';
        layer1.style.opacity = '0%';
      };

      const doMorph = () => {
        morph -= cooldown;
        cooldown = 0;
        let fraction = morph / morphTime;

        if (fraction > 1) {
          cooldown = cooldownTime;
          fraction = 1;
        }
        setMorph(fraction);
      };

      layer2.innerHTML = morphPhrases[0];
      layer1.innerHTML = morphPhrases[0];
      doCooldown();

      const animateMorph = (now) => {
        if (!isVisible) {
          rafId = null;
          return;
        }
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        const shouldIncrementIndex = cooldown > 0;
        cooldown -= dt;

        if (cooldown <= 0) {
          if (shouldIncrementIndex) {
            layer1.innerHTML = morphPhrases[textIndex % morphPhrases.length];
            textIndex = (textIndex + 1) % morphPhrases.length;
            layer2.innerHTML = morphPhrases[textIndex % morphPhrases.length];
          }
          doMorph();
        } else {
          doCooldown();
        }

        rafId = requestAnimationFrame(animateMorph);
      };

      const morphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) {
            lastTime = performance.now();
            rafId = requestAnimationFrame(animateMorph);
          }
        });
      }, { threshold: 0.15 });

      morphObserver.observe(heading);
    });
  }

  // 10. Partnership Team Cards (Click / Keyboard toggle for touch & accessibility)
  const teamExpandCards = document.querySelectorAll('.team-expand-card');
  if (teamExpandCards.length > 0) {
    const toggleTeamCard = (card, force) => {
      const next = force !== undefined ? force : !card.classList.contains('is-expanded');
      teamExpandCards.forEach(c => {
        if (c !== card) {
          c.classList.remove('is-expanded');
          c.setAttribute('aria-expanded', 'false');
        }
      });
      card.classList.toggle('is-expanded', next);
      card.setAttribute('aria-expanded', String(next));
    };

    teamExpandCards.forEach(card => {
      card.addEventListener('click', () => toggleTeamCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTeamCard(card);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.team-expand-card')) {
        teamExpandCards.forEach(c => {
          c.classList.remove('is-expanded');
          c.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // 11. Horizontal Text Reveal (Replays each time the block scrolls into view)
  const horizontalRevealGroups = document.querySelectorAll('[data-horizontal-reveal-group]');
  const horizontalRevealEls = document.querySelectorAll('[data-horizontal-reveal]');
  if (horizontalRevealEls.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const getRevealItems = (container) => (
      container.matches('[data-horizontal-reveal]')
        ? [container]
        : Array.from(container.querySelectorAll('[data-horizontal-reveal]'))
    );

    const revealTargets = (container) => {
      const token = (container._revealToken || 0) + 1;
      container._revealToken = token;
      const items = getRevealItems(container);
      requestAnimationFrame(() => {
        if (container._revealToken !== token) return;
        requestAnimationFrame(() => {
          if (container._revealToken !== token) return;
          items.forEach(item => item.classList.add('is-revealed'));
        });
      });
    };

    const resetTargets = (container) => {
      container._revealToken = (container._revealToken || 0) + 1;
      const active = getRevealItems(container).filter(item => item.classList.contains('is-revealed'));
      if (active.length === 0) return;
      active.forEach(item => {
        item.classList.add('is-resetting');
        item.classList.remove('is-revealed');
      });
      void container.offsetWidth;
      active.forEach(item => item.classList.remove('is-resetting'));
    };

    // Observe unclipped wrapper containers when available (a fully-clipped
    // target can report empty intersection rects in Chromium's observer).
    const observedContainers = horizontalRevealGroups.length > 0
      ? Array.from(horizontalRevealGroups)
      : Array.from(horizontalRevealEls);

    const horizontalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          revealTargets(entry.target);
        } else if (!entry.isIntersecting) {
          resetTargets(entry.target);
        }
      });
    }, { threshold: [0, 0.12] });

    observedContainers.forEach(container => horizontalObserver.observe(container));
  } else {
    horizontalRevealEls.forEach(el => el.classList.add('is-revealed'));
  }

  // 12. Skiper 31 Scroll-Linked Tool Integrations (Converging Rectangular Icons)
  const skiperIntegrations = document.querySelector('[data-skiper-integrations]');
  if (skiperIntegrations && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const skiperItems = Array.from(skiperIntegrations.querySelectorAll('[data-skiper-item]'));
    if (skiperItems.length > 0) {
      const centerIndex = (skiperItems.length - 1) / 2;
      let targetProgress = 0;
      let currentProgress = 0;
      let skiperRaf = null;
      let lastTick = performance.now();

      const computeTargetProgress = () => {
        const rect = skiperIntegrations.getBoundingClientRect();
        const vh = window.innerHeight || 900;
        const startTop = vh * 0.98;
        const endTop = vh * 0.48;
        const raw = (startTop - rect.top) / Math.max(startTop - endTop, 1);
        return Math.max(0, Math.min(1, raw));
      };

      const renderSkiperItems = (progress) => {
        const inv = 1 - progress;
        const isDesktopRow = window.innerWidth >= 1120;
        const spreadX = isDesktopRow ? Math.min(82, window.innerWidth * 0.055) : 16;
        const spreadY = isDesktopRow ? 22 : 12;
        const spreadRotate = isDesktopRow ? 38 : 14;

        skiperItems.forEach((item, index) => {
          if (progress >= 0.996) {
            item.style.transform = 'translate3d(0px, 0px, 0) rotate(0deg) scale(1)';
            item.style.opacity = '1';
            return;
          }
          const distanceFromCenter = index - centerIndex;
          const x = distanceFromCenter * spreadX * inv;
          const y = -Math.abs(distanceFromCenter) * spreadY * inv;
          const rotate = distanceFromCenter * spreadRotate * inv;
          const scale = 0.75 + 0.25 * progress;
          const opacity = 0.35 + 0.65 * progress;
          item.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
          item.style.opacity = opacity.toFixed(3);
        });
      };

      const tickSkiper = (now) => {
        const dt = Math.min((now - lastTick) / 1000, 0.05);
        lastTick = now;
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) < 0.004) {
          currentProgress = targetProgress;
          renderSkiperItems(currentProgress);
          skiperRaf = null;
          return;
        }
        const factor = 1 - Math.exp(-18 * dt);
        currentProgress += diff * factor;
        renderSkiperItems(currentProgress);
        skiperRaf = requestAnimationFrame(tickSkiper);
      };

      const onSkiperScroll = () => {
        targetProgress = computeTargetProgress();
        if (!skiperRaf) {
          lastTick = performance.now();
          skiperRaf = requestAnimationFrame(tickSkiper);
        }
      };

      targetProgress = computeTargetProgress();
      currentProgress = targetProgress;
      renderSkiperItems(currentProgress);

      window.addEventListener('scroll', onSkiperScroll, { passive: true });
      window.addEventListener('resize', onSkiperScroll, { passive: true });
    }
  }

  // 13. Scale Up by Text Reveal (Whole block scales from 0.5 -> 1 on viewport entry, replays per pass)
  const scaleUpTextEls = document.querySelectorAll('[data-scale-up-text]');
  if (scaleUpTextEls.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targetToText = new WeakMap();
    const scaleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const textEl = targetToText.get(entry.target);
        if (!textEl) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          const token = (textEl._scaleToken || 0) + 1;
          textEl._scaleToken = token;
          requestAnimationFrame(() => {
            if (textEl._scaleToken !== token) return;
            requestAnimationFrame(() => {
              if (textEl._scaleToken !== token) return;
              textEl.classList.add('is-scaled-in');
            });
          });
        } else if (!entry.isIntersecting && textEl.classList.contains('is-scaled-in')) {
          textEl._scaleToken = (textEl._scaleToken || 0) + 1;
          textEl.classList.add('is-resetting');
          textEl.classList.remove('is-scaled-in');
          void textEl.offsetWidth;
          textEl.classList.remove('is-resetting');
        }
      });
    }, { threshold: [0, 0.2] });

    scaleUpTextEls.forEach(textEl => {
      const observeTarget = textEl.parentElement || textEl;
      targetToText.set(observeTarget, textEl);
      scaleObserver.observe(observeTarget);
    });
  } else {
    scaleUpTextEls.forEach(textEl => textEl.classList.add('is-scaled-in'));
  }

  // 14. Fade In by Line Reveal (Dynamic visual-line detection preserving inline tags, replays per pass)
  const fadeLineGroups = Array.from(document.querySelectorAll('[data-fade-line-group]'));
  if (fadeLineGroups.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const collectWordTokens = (rootEl) => {
      const tokens = [];
      const range = document.createRange();
      let pendingSpace = false;

      const walk = (node, insideEm) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const val = node.nodeValue || '';
          const regex = /(\s+)|(\S+)/g;
          let match;
          while ((match = regex.exec(val)) !== null) {
            if (match[1]) {
              if (tokens.length > 0) pendingSpace = true;
            } else if (match[2]) {
              const start = match.index;
              const end = start + match[2].length;
              range.setStart(node, start);
              range.setEnd(node, end);
              const clientRects = range.getClientRects();
              const rect = clientRects.length > 0
                ? clientRects[clientRects.length - 1]
                : range.getBoundingClientRect();
              tokens.push({
                text: match[2],
                midY: rect.top + rect.height * 0.5,
                height: rect.height || 16,
                isEm: insideEm,
                spaceBefore: pendingSpace
              });
              pendingSpace = false;
            }
          }
          return;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const isEm = insideEm || node.tagName === 'EM';
          Array.from(node.childNodes).forEach(child => walk(child, isEm));
        }
      };

      walk(rootEl, false);
      return tokens;
    };

    const groupTokensIntoLines = (tokens) => {
      const lines = [];
      tokens.forEach(token => {
        const lastLine = lines[lines.length - 1];
        if (!lastLine || Math.abs(token.midY - lastLine.midY) > Math.max(4, token.height * 0.45)) {
          lines.push({ midY: token.midY, tokens: [token] });
        } else {
          lastLine.tokens.push(token);
        }
      });
      return lines;
    };

    const buildLineFragment = (lineTokens) => {
      const frag = document.createDocumentFragment();
      let activeEm = null;
      lineTokens.forEach((token, idx) => {
        const prependSpace = idx > 0 && token.spaceBefore;
        if (token.isEm) {
          if (prependSpace) {
            if (activeEm) {
              activeEm.appendChild(document.createTextNode(' ' + token.text));
              return;
            }
            frag.appendChild(document.createTextNode(' '));
          }
          if (!activeEm) {
            activeEm = document.createElement('em');
            frag.appendChild(activeEm);
          }
          activeEm.appendChild(document.createTextNode(token.text));
        } else {
          activeEm = null;
          frag.appendChild(document.createTextNode((prependSpace ? ' ' : '') + token.text));
        }
      });
      return frag;
    };

    const makeLineSpan = (tokens) => {
      const span = document.createElement('span');
      span.className = 'fade-line';
      span.appendChild(buildLineFragment(tokens));
      return span;
    };

    const splitFadeLineGroup = (group) => {
      const wasFadedIn = group.classList.contains('is-faded-in');
      if (wasFadedIn) {
        group.classList.add('is-resetting');
      }

      const targets = Array.from(group.querySelectorAll('[data-fade-in-lines]'));
      targets.forEach(el => {
        if (el._origFadeHtml === undefined) {
          el._origFadeHtml = el.innerHTML;
        } else {
          el.innerHTML = el._origFadeHtml;
        }
      });

      let globalLineIndex = 0;
      targets.forEach(el => {
        const tokens = collectWordTokens(el);
        const lines = groupTokensIntoLines(tokens);
        if (lines.length === 0) return;

        el.innerHTML = '';
        lines.forEach((line, idx) => {
          if (idx > 0) {
            el.appendChild(document.createTextNode(' '));
          }
          el.appendChild(makeLineSpan(line.tokens));
        });

        const cs = getComputedStyle(el);
        const fontSize = parseFloat(cs.fontSize) || 16;
        const singleLineHeight = parseFloat(cs.lineHeight) || fontSize * 1.25;
        Array.from(el.querySelectorAll('.fade-line')).forEach(span => {
          if (span.getBoundingClientRect().height > singleLineHeight * 1.45) {
            const subTokens = collectWordTokens(span);
            const subLines = groupTokensIntoLines(subTokens);
            if (subLines.length > 1) {
              const frag = document.createDocumentFragment();
              subLines.forEach((subLine, subIdx) => {
                if (subIdx > 0) {
                  frag.appendChild(document.createTextNode(' '));
                }
                frag.appendChild(makeLineSpan(subLine.tokens));
              });
              span.replaceWith(frag);
            }
          }
        });

        Array.from(el.querySelectorAll('.fade-line')).forEach(span => {
          span.style.setProperty('--line-index', String(globalLineIndex));
          globalLineIndex += 1;
        });
      });

      if (wasFadedIn) {
        group.classList.add('is-faded-in');
        void group.offsetWidth;
        group.classList.remove('is-resetting');
      }
    };

    const triggerGroupFadeIn = (group) => {
      if (!group._linesBuilt) return;
      const token = (group._fadeToken || 0) + 1;
      group._fadeToken = token;
      requestAnimationFrame(() => {
        if (group._fadeToken !== token || !group._inView) return;
        group.classList.add('is-faded-in');
      });
    };

    const resetGroupFadeIn = (group) => {
      group._fadeToken = (group._fadeToken || 0) + 1;
      if (!group.classList.contains('is-faded-in')) return;
      group.classList.add('is-resetting');
      group.classList.remove('is-faded-in');
      void group.offsetWidth;
      group.classList.remove('is-resetting');
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const group = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          group._inView = true;
          triggerGroupFadeIn(group);
        } else if (!entry.isIntersecting) {
          group._inView = false;
          resetGroupFadeIn(group);
        }
      });
    }, { threshold: [0, 0.15] });

    fadeLineGroups.forEach(group => {
      group._linesBuilt = false;
      group._inView = false;
      group.classList.add('is-fade-pending');
      fadeObserver.observe(group);
    });

    const fontsReadyPromise = (document.fonts && document.fonts.ready)
      ? Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 800))
        ])
      : Promise.resolve();

    let lastFadeWidth = window.innerWidth;
    fontsReadyPromise.then(() => {
      fadeLineGroups.forEach(group => {
        splitFadeLineGroup(group);
        group._linesBuilt = true;
        void group.offsetWidth;
        group.classList.remove('is-fade-pending');
        if (group._inView) {
          triggerGroupFadeIn(group);
        }
      });
      lastFadeWidth = window.innerWidth;
    });

    let fadeResizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(fadeResizeTimer);
      fadeResizeTimer = setTimeout(() => {
        if (window.innerWidth === lastFadeWidth) return;
        lastFadeWidth = window.innerWidth;
        fadeLineGroups.forEach(group => {
          if (!group._linesBuilt) return;
          splitFadeLineGroup(group);
        });
      }, 120);
    }, { passive: true });
  } else {
    fadeLineGroups.forEach(group => group.classList.add('is-faded-in'));
  }

  // 15. Fade In Stagger Reveal (Replays smoothly each time the group scrolls into view)
  const fadeStaggerGroups = Array.from(document.querySelectorAll('[data-fade-stagger-group]'));
  if (fadeStaggerGroups.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fadeStaggerGroups.forEach(group => {
      const items = Array.from(group.querySelectorAll('[data-fade-stagger-item]'));
      items.forEach((item, idx) => {
        item.style.setProperty('--stagger-index', String(idx));
      });
    });

    const fadeStaggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const group = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          const token = (group._staggerToken || 0) + 1;
          group._staggerToken = token;
          requestAnimationFrame(() => {
            if (group._staggerToken !== token) return;
            group.classList.add('is-faded-in');
          });
        } else if (!entry.isIntersecting && group.classList.contains('is-faded-in')) {
          group._staggerToken = (group._staggerToken || 0) + 1;
          group.classList.add('is-resetting');
          group.classList.remove('is-faded-in');
          void group.offsetWidth;
          group.classList.remove('is-resetting');
        }
      });
    }, { threshold: [0, 0.12] });

    fadeStaggerGroups.forEach(group => fadeStaggerObserver.observe(group));
  } else {
    fadeStaggerGroups.forEach(group => group.classList.add('is-faded-in'));
  }
});
