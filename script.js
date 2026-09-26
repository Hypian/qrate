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
      }
    });
  }

  // 3. Dynamic Header on Scroll (Switches colors once passing hero section)
  const dynamicHeader = document.querySelector('.header-dynamic');
  const heroSection = document.querySelector('.hero-kraft');
  if (dynamicHeader) {
    let isHeaderScheduled = false;
    const handleHeaderScroll = () => {
      if (!isHeaderScheduled) {
        isHeaderScheduled = true;
        requestAnimationFrame(() => {
          const threshold = heroSection ? Math.max(heroSection.offsetHeight - 90, 80) : 80;
          if (window.scrollY > threshold) {
            dynamicHeader.classList.add('scrolled');
            document.body.classList.remove('orange-brand-mode');
          } else {
            dynamicHeader.classList.remove('scrolled');
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
    }, { threshold: 0.4 });

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

  // 4. Resource Modals
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.open');
      if (activeModal) closeModal(activeModal);
    }
  });

  // 5. Contact Form EmailJS Handling
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const statusBox = document.getElementById('formStatus');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      const emailConfig = window.qrateEmailJs || {};
      const publicKey = emailConfig.publicKey || 'YOUR_PUBLIC_KEY';
      const serviceId = emailConfig.serviceId || 'YOUR_SERVICE_ID';
      const templateId = emailConfig.templateId || 'YOUR_TEMPLATE_ID';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
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
                <strong>Message sent</strong>
                <p>Thank you. Your inquiry has been received. We will respond within one working day.</p>
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
          submitBtn.innerHTML = originalText;
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

  // 7. Cookie & Privacy Consent Banner
  const cookieBanner = document.getElementById('cookie-consent-banner');
  const btnAcceptCookies = document.getElementById('cookie-accept-all');
  const btnEssentialCookies = document.getElementById('cookie-essential-only');
  const btnOpenCookieSettings = document.querySelectorAll('.open-cookie-settings, #open-cookie-settings');

  const showCookieBanner = () => {
    if (cookieBanner) {
      cookieBanner.classList.add('show');
    }
  };

  const hideCookieBanner = () => {
    if (cookieBanner) {
      cookieBanner.classList.remove('show');
    }
  };

  // Check saved consent
  const savedConsent = localStorage.getItem('qrate_cookie_consent');
  if (!savedConsent) {
    setTimeout(showCookieBanner, 1200);
  }

  if (btnAcceptCookies) {
    btnAcceptCookies.addEventListener('click', () => {
      localStorage.setItem('qrate_cookie_consent', 'all');
      hideCookieBanner();
    });
  }

  if (btnEssentialCookies) {
    btnEssentialCookies.addEventListener('click', () => {
      localStorage.setItem('qrate_cookie_consent', 'essential');
      hideCookieBanner();
    });
  }

  btnOpenCookieSettings.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showCookieBanner();
    });
  });
});

