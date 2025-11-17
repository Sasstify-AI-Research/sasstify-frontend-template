# Monitoring & Tools

Performance measurement, monitoring, and tools for continuous optimization.

---

## Table of Contents

- [Lighthouse](#lighthouse)
- [Web Vitals](#web-vitals)
- [Bundle Size Tracking](#bundle-size-tracking)
- [Performance Tools](#performance-tools)
- [Performance Checklist](#performance-checklist)
- [Expected Results](#expected-results)

---

## Lighthouse

### Running Lighthouse

**Development:**
```bash
npm run dev
# Open http://localhost:8080
# Chrome DevTools → Lighthouse → Run
```

**Production:**
```bash
npm run build
npm run preview
# Open http://localhost:8080
# Chrome DevTools → Lighthouse → Run
```

---

### Target Scores

| Category | Excellent | Good | Needs Work |
|----------|-----------|------|------------|
| **Performance** | >95 | 80-95 | <80 |
| **Accessibility** | >95 | 85-95 | <85 |
| **Best Practices** | >95 | 85-95 | <85 |
| **SEO** | >90 | 80-90 | <80 |

---

### Understanding Metrics

**First Contentful Paint (FCP):**
- First text/image rendered
- Target: <1.5s (3G)
- Impact: User sees content

**Largest Contentful Paint (LCP):**
- Largest element rendered
- Target: <2.5s
- Impact: Page feels loaded

**Time to Interactive (TTI):**
- Page fully interactive
- Target: <2.0s (3G)
- Impact: User can interact

**Total Blocking Time (TBT):**
- Main thread blocked
- Target: <200ms
- Impact: Page responsiveness

**Cumulative Layout Shift (CLS):**
- Visual stability
- Target: <0.1
- Impact: No layout jumps

---

## Web Vitals

### Core Web Vitals

```typescript
// Install web-vitals
npm install web-vitals

// Add to your app
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getFCP(console.log); // First Contentful Paint
getLCP(console.log); // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

---

### Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | <2.5s | 2.5-4.0s | >4.0s |
| **FID** | <100ms | 100-300ms | >300ms |
| **CLS** | <0.1 | 0.1-0.25 | >0.25 |

---

### Real User Monitoring

```typescript
// Send to analytics
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
    }),
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

---

## Bundle Size Tracking

### After Every Build

```bash
npm run build

# Check output
✓ 1710 modules transformed.
dist/static/js/react-vendor.js    179.43 kB │ gzip: 57.19 kB
dist/static/js/main.js               9.66 kB │ gzip:  3.28 kB
dist/static/css/main.css            23.62 kB │ gzip:  6.89 kB

# Total: ~67 KB gzipped ✅
```

---

### Bundle Analyzer

```bash
npm run build:analyze

# Opens interactive visualization
# Look for:
# - Large chunks (>100 KB)
# - Duplicate dependencies
# - Unused code
```

---

### Set Size Limits

```typescript
// vite.config.ts
build: {
  chunkSizeWarningLimit: 500, // Warn if chunk > 500 KB
}
```

---

## Performance Tools

### Analysis Tools

#### 1. Lighthouse
**Purpose:** Overall performance audit  
**Command:** Chrome DevTools → Lighthouse  
**Use for:** Initial assessment, CI checks

#### 2. WebPageTest
**Purpose:** Detailed waterfall analysis  
**URL:** https://webpagetest.org  
**Use for:** Network analysis, real-world testing

#### 3. Chrome DevTools

**Performance Tab:**
- Record page load
- Analyze main thread
- Find bottlenecks

**Network Tab:**
- Check request sizes
- Verify compression
- Check cache headers

**Coverage Tab:**
- Find unused code
- Target: <20% unused

#### 4. Bundle Analyzer
**Command:** `npm run build:analyze`  
**Use for:** Bundle composition, large dependencies

---

### Monitoring Services

#### 1. Vercel Analytics
**Features:**
- Real user monitoring
- Core Web Vitals
- Geographic data
**Setup:** Enable in Vercel dashboard

#### 2. Google Analytics 4
**Features:**
- Page load times
- User behavior
- Custom events
**Setup:** Add GA4 tracking code

#### 3. Sentry
**Features:**
- Performance monitoring
- Error tracking
- Transaction tracing
**Setup:**
```bash
npm install @sentry/react
```

#### 4. LogRocket
**Features:**
- Session replay
- Performance metrics
- User monitoring
**Setup:**
```bash
npm install logrocket
```

---

## Performance Checklist

### Initial Load

- [ ] Bundle size < 100 KB gzipped
- [ ] Critical CSS inlined
- [ ] Fonts preloaded
- [ ] Images optimized
- [ ] No render-blocking resources
- [ ] Lazy load below fold

### Runtime

- [ ] Lazy load heavy components
- [ ] Memoize expensive computations
- [ ] Virtualize long lists (>100 items)
- [ ] Debounce/throttle events
- [ ] Use React.memo for heavy components

### Network

- [ ] Use CDN
- [ ] Enable compression (gzip/brotli)
- [ ] Set cache headers
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] Minimize API requests
- [ ] Use data caching (TanStack Query)

### Build

- [ ] Tree shaking enabled
- [ ] Code splitting configured
- [ ] Source maps disabled (production)
- [ ] Console logs removed (production)
- [ ] Dependencies up to date

### Assets

- [ ] Images <100 KB
- [ ] Use WebP/AVIF
- [ ] Fonts <30 KB per file
- [ ] CSS <20 KB gzipped
- [ ] Lazy load images

---

## Expected Results

### Before Optimization

```
Initial Bundle: 200 KB gzipped
Load Time (3G): 4.5s
Lighthouse: 75
FCP: 3.2s
TTI: 5.0s
```

### After Optimization (This Template)

```
Initial Bundle: 55-70 KB gzipped  ✅ 65% reduction
Load Time (3G): 1.8s              ✅ 60% faster
Lighthouse: 95+                   ✅ Excellent
FCP: 1.2s                         ✅ 62% faster
TTI: 1.8s                         ✅ 64% faster
```

---

## Quick Wins

### 1-Minute Performance Check

```bash
# 1. Check bundle size
npm run build
# Look for warnings about large chunks

# 2. Run Lighthouse
npm run preview
# Chrome DevTools → Lighthouse → Run
# Target: All scores >90

# 3. Check Web Vitals
# Open Chrome DevTools → Console
# Look for CLS, LCP, FID metrics

# 4. Analyze bundle
npm run build:analyze
# Look for large red blocks (>100 KB)
```

---

## Continuous Monitoring

### Setup CI/CD Checks

```yaml
# .github/workflows/performance.yml
name: Performance Check

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:8080
          uploadArtifacts: true
```

---

### Weekly Performance Review

```bash
# 1. Check bundle size trends
npm run build
# Compare with last week

# 2. Run Lighthouse
npm run preview
# Chrome DevTools → Lighthouse → Run
# Track score over time

# 3. Review analytics
# Check Vercel/GA4 dashboard
# Look for slow pages

# 4. Update dependencies
npm outdated
npm update
npm run build
# Verify no regressions
```

---

## Further Reading

- [Web.dev: Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

---

## Summary

### Tools to Use

| Tool | Purpose | When |
|------|---------|------|
| **Lighthouse** | Overall audit | Every deploy |
| **Bundle Analyzer** | Size analysis | Weekly |
| **Chrome DevTools** | Detailed analysis | When debugging |
| **Web Vitals** | Real user metrics | Always monitoring |

### Key Metrics

- Lighthouse Score: >90
- Bundle Size: <100 KB gzipped
- FCP: <1.5s
- TTI: <2.0s
- LCP: <2.5s
- CLS: <0.1

---

**Need help?** Check `npm run build:analyze` and look for large chunks! 🔍

