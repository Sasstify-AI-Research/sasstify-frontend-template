# Building & Deploying

Build for production and deploy your application.

---

## Table of Contents

- [Production Build](#production-build)
- [Preview Build](#preview-build)
- [Bundle Analysis](#bundle-analysis)
- [Deployment Options](#deployment-options)

---

## Production Build

### Standard Build

```bash
npm run build
```

**What happens:**
1. TypeScript compilation
2. Code splitting (vendor chunks)
3. Minification & obfuscation
4. CSS optimization & purging
5. Hash-based caching
6. Output to `dist/`

**Output:**
```
dist/
├── index.html                     (~2 KB)
├── dashboard/
│   └── index.html                 (~2 KB)
└── static/
    ├── js/
    │   ├── CNkZXMZn.js            ← Query vendor (~2.5 KB gzipped)
    │   ├── LIZo4OzT.js            ← Other vendors (~45 KB gzipped)
    │   ├── Dj7pr43P.js            ← React vendor (~315 KB gzipped)
    │   ├── BDsDggUV.js            ← Main page (~8 KB gzipped)
    │   └── [hash].js              ← Other chunks (hashed)
    └── css/
        └── DSJ3S4vk.css           ← Styles (~4.7 KB gzipped)
```

**Note:** Filenames are content-based hashes only (e.g., `CNkZXMZn.js`), not descriptive names.

**Build time:**
- First build: ~15-20s
- Cached build: ~3-5s (95% cache efficiency)

---

### Clean Build

```bash
npm run build:clean
```

**What happens:**
1. Deletes `.vite-cache/`
2. Deletes `dist/`
3. Runs fresh build

**When to use:**
- Troubleshooting build issues
- After major config changes
- After dependency updates
- CI/CD pipelines

---

### Build with Analysis

```bash
npm run build:analyze
```

**What happens:**
1. Runs production build
2. Opens bundle analyzer in browser
3. Shows visual breakdown of bundle size

**Use this to:**
- Identify large dependencies
- Find optimization opportunities
- Verify code splitting
- Track bundle size changes

**[→ Bundle optimization guide](../performance-optimization-guide/02-bundle-optimization.md)**

---

## Preview Build

### Preview Locally

```bash
# First, build
npm run build

# Then preview
npm run preview
```

**Opens:** http://localhost:8080

**This serves:**
- Production build from `dist/`
- Minified & optimized code
- Exact production behavior

**Use this to:**
- Test before deployment
- Verify production build
- Check bundle loading
- Confirm optimizations

---

## Bundle Analysis

### Current Bundle Structure

**Vendor Chunks (content-hashed):**
- `Dj7pr43P.js` - React, ReactDOM (~315 KB → ~40 KB gzipped)
- `CNkZXMZn.js` - TanStack Query (~2.5 KB gzipped)
- `LIZo4OzT.js` - Other vendors (~45 KB gzipped)

**Page Chunks (content-hashed):**
- `BDsDggUV.js` - Main/Index page (~8 KB gzipped)
- `[hash].js` - Dashboard & other pages (~0.3 KB gzipped each)

**CSS (content-hashed):**
- `DSJ3S4vk.css` - All styles (~4.7 KB gzipped)

**Total:** ~55-70 KB gzipped

**Note:** Hash values change only when file content changes, ensuring optimal caching.

---

### Performance Metrics

**Lighthouse Scores:**
- Performance: 95+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 100

**Core Web Vitals (3G):**
- First Contentful Paint: ~1.2s
- Time to Interactive: ~1.8s
- Largest Contentful Paint: ~2.0s

**[→ Performance optimization guide](../performance-optimization-guide/)**

---

## Deployment Options

### Static Hosting

**Compatible with:**
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages
- Any static file host

**What to deploy:**
```
dist/  ← Deploy this entire folder
```

---

### AWS S3 + CloudFront

**1. Build:**
```bash
npm run build
```

**2. Upload to S3:**
```bash
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

**3. Configure CloudFront:**
- Create distribution
- Point to S3 bucket
- No special error responses needed (MPA)

**4. Invalidate cache (after update):**
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

### Netlify

**1. Build:**
```bash
npm run build
```

**2. Deploy:**

**Option A: Drag & Drop**
- Go to Netlify dashboard
- Drag `dist/` folder
- Done!

**Option B: CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option C: Git Integration**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

---

### Vercel

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy:**
```bash
# First build
npm run build

# Deploy
vercel --prod
```

**3. Configure:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### GitHub Pages

**1. Build:**
```bash
npm run build
```

**2. Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

**3. Add deploy script:**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**4. Deploy:**
```bash
npm run deploy
```

---

## Caching Strategy

### File Hashing

All assets have content-based hashes:
```
react-vendor.Xa8f9B2c.js
main.Zc3d4E5f.js
main.Ya7b8C9d.css
```

**Benefits:**
- Only changed files get new names
- Unchanged files use cached version
- Optimal cache efficiency

---

### Cache Headers

**Recommended:**
```
# HTML files
Cache-Control: no-cache

# JS/CSS files (hashed)
Cache-Control: public, max-age=31536000, immutable

# Static assets
Cache-Control: public, max-age=86400
```

**[→ Hash stability implementation](../scripts/obfuscation/04-performance.md)**

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }}/ --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**[→ CI/CD documentation](../production-build/07-cicd.md)**

---

## Quick Reference

| Command | Purpose | Time |
|---------|---------|------|
| `npm run build` | Production build | ~3-5s (cached) |
| `npm run build:clean` | Clean build | ~15-20s |
| `npm run build:analyze` | Build + analysis | ~5-10s |
| `npm run preview` | Preview build | ~300ms |

---

## Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test with `npm run preview`
- [ ] Check bundle size (`npm run build:analyze`)
- [ ] Verify all pages load
- [ ] Test on mobile devices
- [ ] Check Lighthouse scores
- [ ] Configure cache headers
- [ ] Set up CI/CD (optional)

---

## Next Steps

→ [Troubleshooting](./06-troubleshooting.md) - Fix common issues

→ [Production Build Documentation](../production-build/) - Deep dive

→ [Performance Guide](../performance-optimization-guide/) - Optimize further

---

**Ready to deploy!** See [Troubleshooting](./06-troubleshooting.md) if you encounter issues.

