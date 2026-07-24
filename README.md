# QRATE. — Creative Communications Website

Official web application for **Qrate Creative Communications** (Kigali, Rwanda) — providing strategy, storytelling, design, and reporting for mission-driven organisations across Africa.

---

## 📁 Repository & Code Structure

```text
qrate/
├── index.html          ← Home (Hero fan, services overview, proof metrics)
├── about.html          ← About Qrate (Team & philosophy)
├── services.html       ← Full capabilities & service breakdowns
├── work.html           ← Field & BTS production gallery
├── plans.html          ← Engagement models & FAQ
├── resources.html      ← Open resource library with interactive modals
├── contact.html        ← Project inquiry form & Calendly integration
├── styles.css          ← Unified Design System, tokens & responsive styles
├── script.js           ← Shared JS, navigation, motion, modals & interactive components
├── og-image.png        ← Lightweight OpenGraph preview image (85 KB)
├── og-image.jpg        ← Fallback OpenGraph image (85 KB)
├── photos/             ← High-res field & hero photography
│   ├── hero-1..5.jpg / .webp
│   ├── bts-1..6.jpg / .webp
│   └── resources/      ← Custom cover graphics for resources library
└── logos/              ← Client and partner organisation logos
```

---

## 🚀 Standards & Performance Features

1. **Performance & Lightweight Payload:**
   - Pre-compressed WebP format images with fallback JPEG sources.
   - High-priority preloading (`fetchpriority="high"`) for above-the-fold hero images.
   - Lazy loading (`loading="lazy"`) and asynchronous decoding (`decoding="async"`) on all secondary media.
   - Micro-optimized social preview image (under 90 KB).

2. **Accessibility (WCAG Compliant):**
   - Accessible skip links (`.skip-link`) at the top of every HTML page.
   - Semantic landmark structure (`<header>`, `<main id="main-content">`, `<footer>`).
   - `:focus-visible` outline indicators for keyboard navigation.
   - Keyboard `Escape` key listeners and ARIA accessibility roles for modals and accordions.

3. **Deployment (GitHub Pages & Static Hosts):**
   - Fully compatible with **GitHub Pages**, Vercel, Netlify, and Cloudflare Pages.
   - Root-relative clean URL routing.

---

## 🛠️ Maintenance & Local Development

To run locally:
Simply open `index.html` in any browser or use a local static server:
```bash
npx serve .
```
