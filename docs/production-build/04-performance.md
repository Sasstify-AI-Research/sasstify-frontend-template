# Performance Optimization

Performance metrics, optimization techniques, and best practices for production builds.

---

## Table of Contents

**Quick Navigation** - Jump to the section you need:

### ⚡ Performance Metrics
- [Build Performance](#build-performance) - Build times & caching
- [Runtime Performance](#runtime-performance) - Core Web Vitals & bundle sizes
- [Network Performance](#network-performance) - Load times by connection

### 🎯 Optimization
- [Optimization Techniques](#optimization-techniques) - Code splitting, tree shaking, assets
- [Caching Strategy](#caching-strategy) - Browser & CDN caching
- [Monitoring & Analysis](#monitoring-analysis) - Bundle analysis & Lighthouse

### ✅ Best Practices
- [Best Practices](#best-practices) - Development, build, & deployment tips
- [Performance Checklist](#performance-checklist) - Pre & post-deployment checks

### 🔗 Next Steps
- [Related Documentation](#related-documentation) - Additional resources

---

## Build Performance

### Metrics

| Scenario | Time | Cache Hit | Obfuscated |
|----------|------|-----------|------------|
| First build | 20-25s | 0% | All (14+) |
| No changes | 15-18s | 100% | None |
| 1 file changed | 16-19s | ~93% | 1-2 |
| Many changes | 18-22s | ~50% | 7-8 |

### Optimization Strategies

**1. Use Cached Builds**
```bash
npm run build          # Use cache
npm run build:clean    # Skip cache (slower)
```

**2. Incremental Development**
- Make focused changes to minimize re-obfuscation
- Test locally before committing

**3. CI/CD Caching**
```yaml
# GitHub Actions example
- name: Cache obfuscation
  uses: actions/cache@v3
  with:
    path: .vite-cache
    key: ${{ runner.os }}-obfuscation-${{ hashFiles('**/*.{ts,tsx}') }}
```

---

## Runtime Performance

### Core Web Vitals

**Target Metrics:**
- LCP (Largest Contentful Paint): < 1.5s
- FID (First Input Delay): < 50ms
- CLS (Cumulative Layout Shift): < 0.1

**Typical Results:**
- LCP: ~1.2s (3G) | ~0.4s (4G)
- FID: ~20ms
- CLS: ~0.05

### Bundle Size

**Total Sizes:**
- Uncompressed: ~1.1 MB
- Minified: ~850 KB
- Gzipped: ~450 KB
- Brotli: ~380 KB

**By Category:**
| Type | Size (gzip) | Load Priority |
|------|-------------|---------------|
| HTML | < 1 KB | Critical |
| CSS | ~5 KB | Critical |
| React Vendor | ~315 KB | High |
| App Code | ~50 KB | High |
| Lazy Chunks | ~70 KB | Low |

---

## Optimization Techniques

### 1. Code Splitting

**Automatic Splitting:**
```typescript
// Vite automatically splits vendor code
// No configuration needed
```

**Manual Splitting:**
```typescript
// For large features
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 2. Tree Shaking

**Effective Usage:**
```typescript
// ✅ Good - Named imports
import { specific } from 'library';

// ❌ Bad - Default import
import library from 'library';
```

**Results:**
- ~40% reduction in library code
- ~15% reduction in app code

### 3. Asset Optimization

**Images:**
- Use WebP format when possible
- Implement lazy loading
- Compress before import

**Fonts:**
- Use `font-display: swap`
- Subset fonts to required characters
- Preload critical fonts

### 4. CSS Optimization

**Tailwind Purging:**
- Automatic in production
- ~24KB → ~5KB (79% reduction)

**Critical CSS:**
- Inline critical styles
- Defer non-critical CSS

---

## Caching Strategy

### Browser Caching

**Recommended Headers:**
```nginx
# Hashed assets (1 year)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML (no cache)
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache";
}
```

### CDN Caching

**Strategy:**
- Edge caching: 1 year for assets
- Origin revalidation: HTML only
- Stale-while-revalidate: Enabled

**Benefits:**
- 95%+ cache hit rate
- Reduced bandwidth: ~21 GB/100k users
- Faster load times globally

---

## Network Performance

### Initial Load (Cold Cache)

**3G Network:**
- HTML: ~200ms
- CSS: ~300ms
- JS: ~2.5s
- **Total:** ~3s

**4G Network:**
- HTML: ~100ms
- CSS: ~150ms
- JS: ~800ms
- **Total:** ~1s

**WiFi:**
- HTML: ~50ms
- CSS: ~50ms
- JS: ~200ms
- **Total:** ~300ms

### Subsequent Loads (Warm Cache)

**All Networks:**
- HTML: <100ms (fresh)
- Other assets: Cached
- **Total:** <100ms

---

## Monitoring & Analysis

### Bundle Analysis

```bash
npm run build:analyze
```

**Insights:**
- Chunk sizes
- Duplicate dependencies
- Import paths
- Optimization opportunities

### Lighthouse Audit

```bash
npm run preview
# Open in Chrome
# DevTools → Lighthouse → Run Audit
```

**Target Scores:**
- Performance: 95-100
- Accessibility: 90-100
- Best Practices: 95-100
- SEO: 100

---

## Best Practices

### Development

✅ Use lazy loading for large components  
✅ Implement virtual scrolling for long lists  
✅ Optimize images before import  
✅ Use React.memo for expensive components  
✅ Avoid unnecessary re-renders  

### Build

✅ Enable all production optimizations  
✅ Use cached builds when possible  
✅ Monitor bundle sizes regularly  
✅ Keep dependencies up to date  
✅ Remove unused code  

### Deployment

✅ Enable compression (gzip/brotli)  
✅ Use CDN for static assets  
✅ Configure aggressive caching  
✅ Enable HTTP/2 or HTTP/3  
✅ Monitor real-user metrics  

---

## Performance Checklist

**Pre-Deployment:**
- [ ] Run `npm run build:analyze`
- [ ] Check bundle sizes < targets
- [ ] Test on 3G network
- [ ] Verify lazy loading works
- [ ] Check Lighthouse scores
- [ ] Validate caching headers

**Post-Deployment:**
- [ ] Monitor Core Web Vitals
- [ ] Check CDN cache hit rate
- [ ] Review error logs
- [ ] Monitor build times
- [ ] Track bundle size trends

---

## Related Documentation

- **[Vite Build Phase](./vite-build-phase.md)** - Build optimizations
- **[Obfuscation Documentation](../scripts/obfuscation/README.md)** - Obfuscation performance
- **[Lazy Loading Patterns](../reusable-implementations/lazy-loading/)** - Component lazy loading

---

**Last Updated:** November 2025
