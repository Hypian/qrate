// From the repository root, use the Tailwind v3.4.17 standalone CLI:
// tailwindcss -c ui/tailwind.config.cjs --minify -o ui/layout.css
module.exports = {
  content: ['./*.html', './script.js'],
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#f7f7f5",
        "surface": "#f7f7f5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f2ef",
        "surface-container": "#ecece7",
        "surface-container-high": "#e2e5e1",
        "surface-container-highest": "#d6d9d4",
        "surface-variant": "#e9eaeb",
        "on-surface": "#09131f",
        "on-surface-variant": "#4b5058",
        "primary": "#09131f",
        "primary-fixed": "#09131f",
        "kraft": "#ff6b35",
        "kraft-dark": "#e55d2d",
        "forest": "#09131f",
        "forest-dark": "#071018",
        "rust": "#ff6b35",
        "rust-dark": "#d45426",
        "rust-hover": "#e85f2e",
        "secondary": "#ff6b35",
        "tertiary": "#4b5058",
        "sage-light": "#6d7681",
        "ochre-gold": "#ffdc50",
        "outline": "#a2a9b0",
        "outline-variant": "#d9dbd7"
      },
      fontFamily: {
        "serif": ["Newsreader", "Georgia", "serif"],
        "display-serif": ["Newsreader", "Georgia", "serif"],
        "display-xl": ["Newsreader", "Space Grotesk", "serif"],
        "headline-lg": ["Newsreader", "Space Grotesk", "serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "headline-sm": ["Space Grotesk", "sans-serif"],
        "body-lg": ["Geist", "sans-serif"],
        "body-base": ["Geist", "sans-serif"],
        "label-md": ["Geist", "sans-serif"],
        "label-sm": ["Geist", "sans-serif"],
        "mono": ["Geist", "monospace"]
      },
      spacing: {
        "gutter-desktop": "64px",
        "gutter-tablet": "32px",
        "gutter-mobile": "16px",
        "container-max": "1440px"
      }
    }
  }
};
