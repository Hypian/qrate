import { animate, inView, spring } from "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";

const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
if (prefersReducedMotion) {
  // Respect reduced motion: leave existing GSAP/CSS behavior.
  // (No-op by design.)
} else {
  // Button micro-interactions (non-conflicting with GSAP magnetic effect)
  const pressableSelectors = [".btn-primary", ".btn-secondary", ".btn-login", ".btn-next"];
  const pressables = document.querySelectorAll(pressableSelectors.join(","));

  pressables.forEach((el) => {
    let controls = null;
    const pressIn = () => {
      controls?.cancel?.();
      controls = animate(
        el,
        { scale: 0.985, filter: "brightness(1.05)" },
        { duration: 0.15, easing: spring({ stiffness: 700, damping: 40 }) }
      );
    };
    const pressOut = () => {
      controls?.cancel?.();
      controls = animate(
        el,
        { scale: 1, filter: "brightness(1)" },
        { duration: 0.25, easing: spring({ stiffness: 500, damping: 35 }) }
      );
    };

    el.addEventListener("pointerdown", pressIn, { passive: true });
    el.addEventListener("pointerup", pressOut, { passive: true });
    el.addEventListener("pointercancel", pressOut, { passive: true });
    el.addEventListener("pointerleave", pressOut, { passive: true });
  });

  // Nav logo finesse
  const navLogo = document.querySelector(".nav-logo");
  if (navLogo) {
    let navControls = null;
    navLogo.addEventListener(
      "mouseenter",
      () => {
        navControls?.cancel?.();
        navControls = animate(
          navLogo,
          { letterSpacing: "0.16em", opacity: 1 },
          { duration: 0.25, easing: spring({ stiffness: 450, damping: 28 }) }
        );
      },
      { passive: true }
    );
    navLogo.addEventListener(
      "mouseleave",
      () => {
        navControls?.cancel?.();
        navControls = animate(
          navLogo,
          { letterSpacing: "0.1em", opacity: 1 },
          { duration: 0.35, easing: spring({ stiffness: 380, damping: 30 }) }
        );
      },
      { passive: true }
    );
  }

  // In-view accent on stack cards (safe properties only)
  inView(".stack-card", (info) => {
    const card = info.target;
    const badge = card.querySelector(".stack-badge");
    const title = card.querySelector("h3");

    if (badge) {
      animate(
        badge,
        { transform: ["translateY(8px)", "translateY(0px)"], opacity: [0.7, 1] },
        { duration: 0.35, easing: spring({ stiffness: 500, damping: 32 }) }
      );
    }

    if (title) {
      animate(
        title,
        { filter: ["blur(2px)", "blur(0px)"] },
        { duration: 0.45, easing: spring({ stiffness: 420, damping: 34 }) }
      );
    }
  });

  // Moment icons: animate when `.moment-line` becomes active (no conflicts with GSAP)
  const momentLines = document.querySelectorAll(".moment-line");
  if (momentLines.length) {
    const animateIcon = (lineEl) => {
      const icon = lineEl.querySelector(".moment-icon");
      if (!icon) return;
      if (icon.dataset.motionDone === "1") return;
      icon.dataset.motionDone = "1";

      animate(
        icon,
        { rotate: [-10, 0], filter: ["drop-shadow(0 0 0 rgba(0,0,0,0))", "drop-shadow(0 0 18px rgba(111,255,151,0.25))"] },
        { duration: 0.5, easing: spring({ stiffness: 420, damping: 30 }) }
      );
    };

    // Run for any already-active lines.
    momentLines.forEach((line) => {
      if (line.classList.contains("active")) animateIcon(line);
    });

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type !== "attributes" || m.attributeName !== "class") continue;
        const el = m.target;
        if (!(el instanceof HTMLElement)) continue;
        if (el.classList.contains("active")) animateIcon(el);
      }
    });

    momentLines.forEach((line) => obs.observe(line, { attributes: true }));
  }
}

