# Asset Optimization

Optimizing images, fonts, and CSS for maximum performance.

---

## Table of Contents

- [Images](#images)
- [Fonts](#fonts)
- [CSS Optimization](#css-optimization)

---

## Images

### Best Practices

#### 1. Use Modern Formats

```html
<!-- ✅ WebP with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Description" />
</picture>

<!-- ✅ AVIF (even better compression) -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>
```

**Savings:**
- JPEG: Baseline
- WebP: 25-35% smaller
- AVIF: 40-50% smaller

#### 2. Lazy Load Images

```html
<!-- ✅ Below fold images -->
<img loading="lazy" src="image.jpg" alt="..." />

<!-- ❌ Above fold (hero images) -->
<img loading="lazy" src="hero.jpg" alt="..." />
<!-- This delays critical content! -->

<!-- ✅ Above fold -->
<img src="hero.jpg" alt="..." />
```

#### 3. Responsive Images

```html
<!-- ✅ Different sizes for different screens -->
<img
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px,
         (max-width: 900px) 800px,
         1200px"
  src="image-800.jpg"
  alt="..."
/>
```

#### 4. Optimize Image Size

```bash
# Install tools
npm install -D imagemin imagemin-webp imagemin-avif

# Compress images
npx imagemin src/assets/*.jpg --out-dir=dist/assets --plugin=webp
```

**Target Sizes:**
- Hero images: <100 KB
- Thumbnails: <20 KB
- Icons: <5 KB (use SVG)

---

### Image CDN

**Recommended Services:**

```typescript
// Cloudinary
<img src="https://res.cloudinary.com/demo/image/upload/w_400,f_auto/sample.jpg" />

// Imgix
<img src="https://demo.imgix.net/sample.jpg?w=400&auto=format" />

// Cloudflare Images
<img src="https://imagedelivery.net/demo/sample/w=400,format=auto" />
```

**Benefits:**
- Automatic format selection
- On-the-fly resizing
- Global CDN delivery
- WebP/AVIF support

---

## Fonts

### Best Practices

#### 1. Use System Fonts

```css
/* ✅ Zero download, instant rendering */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Helvetica', 'Arial', sans-serif;
```

**Benefits:**
- No network request
- No render delay
- Native OS appearance
- Perfect for body text

#### 2. Preload Critical Fonts

```html
<!-- ✅ Preload in <head> -->
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**When to Preload:**
- Hero headings
- Primary branding
- Above-fold text

**Don't Preload:**
- Body fonts (if using system fonts)
- Below-fold fonts
- Rarely used weights

#### 3. Use font-display

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
  font-weight: 400;
}
```

**Options:**
- `swap` - Show fallback, swap when loaded (recommended)
- `block` - Wait max 3s, then show fallback
- `fallback` - Wait 100ms, swap within 3s
- `optional` - Use font if cached, else skip

#### 4. Subset Fonts

**Only Include Needed Characters:**

```bash
# Install glyphhanger
npm install -g glyphhanger

# Generate subset
glyphhanger --whitelist=ABCabc --subset=font.ttf
```

**Savings:**
- Full font: 150 KB
- Latin subset: 30 KB
- Custom subset: 10 KB

#### 5. Use Variable Fonts

```css
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-weight: 100 900; /* All weights in one file */
}
```

**Benefits:**
- One file for all weights
- Smaller than multiple files
- Smooth weight transitions

---

### Font Loading Strategy

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 1. Preload critical font -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />
  
  <!-- 2. Use system font initially -->
  <style>
    body {
      font-family: -apple-system, sans-serif;
    }
  </style>
  
  <!-- 3. Load custom font async -->
  <link rel="stylesheet" href="/fonts/fonts.css" />
</head>
</html>
```

---

## CSS Optimization

### Built-in Optimizations (Tailwind)

#### Automatic Purging

```javascript
// tailwind.config.ts - Already configured
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Removes unused styles in production
}
```

**Result:**
- Development: ~3.5 MB (all utilities)
- Production: ~10-20 KB (only used classes)

---

### Additional CSS Tips

#### 1. Use CSS Modules

```typescript
// ✅ Scoped styles
import styles from './Component.module.css';

<div className={styles.container}>
  Content
</div>
```

**Benefits:**
- No global pollution
- Better tree shaking
- Automatic critical CSS

#### 2. Avoid Inline Styles

```typescript
// ❌ Bad - prevents optimization
<div style={{ color: 'red', padding: '10px' }}>
  Content
</div>

// ✅ Good - can be purged
<div className="text-red-600 p-4">
  Content
</div>
```

#### 3. Critical CSS

```html
<!-- ✅ Inline critical CSS -->
<style>
  .hero { /* Above fold styles */ }
</style>

<!-- ✅ Defer non-critical CSS -->
<link rel="preload" href="/styles/below-fold.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
```

---

## Quick Wins

### 1-Minute Optimizations

```html
<!-- ✅ Lazy load images -->
<img loading="lazy" src="..." alt="..." />

<!-- ✅ Use WebP -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>

<!-- ✅ Preload fonts -->
<link rel="preload" href="/fonts/font.woff2" as="font" crossorigin />

<!-- ✅ Use system fonts -->
<style>
  body { font-family: -apple-system, sans-serif; }
</style>
```

---

## Performance Targets

| Asset | Target | Excellent | Acceptable | Too Large |
|-------|--------|-----------|------------|-----------|
| **Hero Image** | <100 KB | <50 KB | 50-100 KB | >100 KB |
| **Thumbnail** | <20 KB | <10 KB | 10-20 KB | >20 KB |
| **Font File** | <30 KB | <20 KB | 20-30 KB | >30 KB |
| **CSS Bundle** | <20 KB | <10 KB | 10-20 KB | >20 KB |

---

## Tools

### Image Optimization
- **[Squoosh](https://squoosh.app/)** - Online image compressor
- **[ImageOptim](https://imageoptim.com/)** - Mac app
- **[TinyPNG](https://tinypng.com/)** - PNG compression

### Font Tools
- **[Google Fonts](https://fonts.google.com/)** - Free fonts
- **[Glyphhanger](https://github.com/filamentgroup/glyphhanger)** - Font subsetting
- **[Transfonter](https://transfonter.org/)** - Font converter

### CSS Tools
- **[PurgeCSS](https://purgecss.com/)** - Remove unused CSS
- **[CriticalCSS](https://github.com/addyosmani/critical)** - Extract critical CSS

---

## Next Steps

- **[Code Optimization](./04-code-optimization.md)** - JavaScript & React performance
- **[Network Optimization](./05-network-optimization.md)** - CDN & compression
- **[Monitoring & Tools](./06-monitoring-and-tools.md)** - Measure performance

---

**Quick check:** Are your images <100 KB? Fonts preloaded? CSS purged? ✅

