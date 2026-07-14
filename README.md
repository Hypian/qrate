# QRATE. Website

## File structure
```
qrate/
├── index.html       ← main HTML
├── styles.css       ← all styles
├── script.js        ← all JavaScript + photo config
└── photos/          ← add your images here
    ├── hero-1.jpg   (Three women farming — Slide 1)
    ├── hero-2.jpg   (Mothers + children — Slide 2)
    ├── hero-3.jpg   (Teacher + classroom — Slide 3)
    ├── hero-4.jpg   (Woman planting — Slide 4)
    ├── hero-5.jpg   (Laptop collaboration — Slide 5)
    ├── bts-1.jpg    (BTS photo 1)
    ├── bts-2.jpg    (BTS photo 2)
    ├── bts-3.jpg    (BTS photo 3)
    ├── bts-4.jpg    (BTS photo 4)
    ├── bts-5.jpg    (BTS photo 5)
    └── bts-6.jpg    (BTS photo 6)
```

## To add photos
1. Drop your image files into the `/photos/` folder
2. Open `script.js`
3. Update the `PHOTOS` object at the top with your filenames
4. That's it.

## To deploy
- **Netlify Drop**: drag the entire `qrate/` folder to netlify.com/drop — live in 60 seconds
- **Vercel**: `npx vercel` in this folder
- **Any host**: upload all files maintaining the same folder structure

## Fonts
Loaded from Google Fonts (Montserrat + Inter). Requires internet connection.
For offline/production, download and self-host the fonts.
