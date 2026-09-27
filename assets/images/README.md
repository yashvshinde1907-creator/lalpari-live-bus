# 🖼️ Universal PWA - Image Assets Guide

> **हे फाईल तुमच्या ॲपसाठी कोणती इमेज कुठे वापरायची ते दाखवते.**

## 📂 Folder Structure
```
assets/
├── icons/          ← ॲप Icons (PNG format)
├── images/         ← App Images (PNG/JPG/SVG)
└── logos/          ← Brand Logos
```

---

## 🎯 Icons (Required)

| File Name | Size | Where Used | Replace With |
|-----------|------|------------|--------------|
| `icon-72x72.png` | 72x72 | Android notification | Your app icon |
| `icon-96x96.png` | 96x96 | Android shortcut | Your app icon |
| `icon-128x128.png` | 128x128 | Chrome Web Store | Your app icon |
| `icon-144x144.png` | 144x144 | Android splash | Your app icon |
| `icon-152x152.png` | 152x152 | iPad touch icon | Your app icon |
| `icon-192x192.png` | 192x192 | Android home screen | Your app icon |
| `icon-384x384.png` | 384x384 | PWA splash | Your app icon |
| `icon-512x512.png` | 512x512 | PC install prompt | Your app icon |
| `apple-touch-icon.png` | 180x180 | iPhone home screen | Your app icon |

### 🎨 Icon Design Tips:
- **Background:** Transparent or solid color
- **Format:** PNG with transparency
- **Style:** Simple, recognizable at small sizes
- **Colors:** Match your brand colors

---

## 🖼️ App Images (Optional)

| File Name | Size | Where Used | Replace With |
|-----------|------|------------|--------------|
| `screenshot-pc.png` | 1280x720 | PWA manifest screenshot | Your PC app screenshot |
| `screenshot-mobile.png` | 390x844 | PWA manifest screenshot | Your mobile app screenshot |
| `offline-banner.png` | 800x400 | Offline page | Your "No Internet" illustration |
| `splash-bg.png` | 1920x1080 | Splash screen background | Your branded background |
| `hero-image.png` | 600x400 | Homepage hero | Your main product image |
| `avatar-default.png` | 200x200 | User avatars | Default user profile pic |
| `logo-full.png` | 400x100 | Header/footer logo | Your full brand logo |
| `logo-icon.png` | 100x100 | App icon/logo | Your icon only |

---

## 🎨 Design System Colors

### Current Theme (Dark Purple)
```css
--primary: #6366f1;      /* Main brand color */
--secondary: #8b5cf6;    /* Accent color */
--bg: #0f172a;           /* Dark background */
--bg-light: #1e293b;     /* Card background */
--text: #e2e8f0;         /* Main text */
--text-muted: #94a3b8;   /* Secondary text */
```

### How to Change Colors:
1. Open each HTML file
2. Find `:root` CSS variables
3. Replace hex codes with your brand colors

---

## 🚀 Quick Start for New Developer

1. **Replace Icons:**
   ```bash
   # Delete placeholder icons
   rm assets/icons/*.png

   # Add your icons (same file names)
   cp your-icon-192x192.png assets/icons/icon-192x192.png
   # ... repeat for all sizes
   ```

2. **Replace Images:**
   ```bash
   # Add your images
   cp your-screenshot.png assets/images/screenshot-pc.png
   cp your-hero.png assets/images/hero-image.png
   ```

3. **Change Colors:**
   - Open each HTML file
   - Find `/* Design System Colors */`
   - Replace with your brand colors

4. **Update Text:**
   - Search for `Universal PWA` in all files
   - Replace with your app name

---

## 📝 File Checklist

### Must Replace:
- [ ] `icon-192x192.png`
- [ ] `icon-512x512.png`
- [ ] `apple-touch-icon.png`

### Should Replace:
- [ ] `screenshot-pc.png`
- [ ] `screenshot-mobile.png`
- [ ] `offline-banner.png`

### Optional:
- [ ] `hero-image.png`
- [ ] `logo-full.png`
- [ ] `splash-bg.png`

---

## 🎨 Recommended Tools

- **Icons:** [Figma](https://figma.com), [Canva](https://canva.com), [IconKitchen](https://icon.kitchen)
- **Images:** [Unsplash](https://unsplash.com), [Pexels](https://pexels.com)
- **Colors:** [Coolors](https://coolors.co), [Adobe Color](https://color.adobe.com)

---

## 💡 Pro Tips

1. **Keep same file names** — code references these names
2. **Use same sizes** — prevents layout issues
3. **Optimize images** — use [TinyPNG](https://tinypng.com) for compression
4. **Test on all devices** — after replacing images

---

**Ready to customize?** Start with icons, then images, then colors! 🚀
