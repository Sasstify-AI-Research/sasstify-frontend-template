# Built-in Optimizations

What's already configured in this template to ensure optimal performance.

---

## Table of Contents

- [Performance Goals](#performance-goals)
- [Configured Optimizations](#configured-optimizations)
- [Verification](#verification)
- [Next Steps](#next-steps)

---

## Performance Goals

This template is optimized for excellent performance metrics:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **First Contentful Paint** | <1.5s (3G) | ~1.2s | ✅ Excellent |
| **Time to Interactive** | <2.0s (3G) | ~1.8s | ✅ Excellent |
| **Lighthouse Score** | >90 | 95+ | ✅ Excellent |
| **Bundle Size (gzip)** | <100 KB | ~55-70 KB | ✅ Excellent |

---

## Configured Optimizations

### 1. Smart Code Splitting

**What it does:**
- Separates vendor code from application code
- Creates optimal chunks for long-term caching
- Automatic chunking for lazy-loaded components

**Configuration:** `vite.config.ts`

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // React core → cached long-term
        if (id.includes('node_modules/react')) return 'react-vendor';
        
        // TanStack Query → cached long-term
        if (id.includes('@tanstack/react-query')) return 'query-vendor';
        
        // UI libraries → cached long-term
        if (id.includes('lucide-react') || id.includes('clsx')) return 'ui-vendor';
        
        // Other dependencies
        if (id.includes('node_modules')) return 'vendor';
      }
    }
  }
}
```

**Benefits:**
- Vendor chunks rarely change → 1 year cache
- Application code changes often → shorter cache
- Users only download changed chunks on updates

---

### 2. Production Optimizations

**Minification (esbuild):**
- Fast JavaScript minification
- Variable name mangling
- Whitespace removal
- Dead code elimination

**Tree Shaking:**
- Removes unused code from bundles
- Works with ES modules
- Reduces final bundle size

**Console Removal:**
- All `console.log` statements removed in production
- Reduces bundle size
- Prevents debug information leakage

**Configuration:** Built-in with Vite

---

### 3. Asset Optimization

**Hash-based Caching:**
- Content-based filename hashing
- Immutable cache headers
- Optimal browser caching

**CSS Code Splitting:**
- Separate CSS per page
- Automatic critical CSS extraction
- Prevents CSS bloat

**Efficient Chunk Naming:**
- Short, hashed filenames
- Predictable naming for caching
- Reduced request overhead

**Configuration:** `vite.config.ts`

```typescript
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'static/js/[name].[hash].js',
      chunkFileNames: 'static/js/[name].[hash].js',
      assetFileNames: 'static/[ext]/[name].[hash].[ext]'
    }
  }
}
```

---

### 4. Modern Targets

**ES2020 Target:**
- Smaller polyfills
- Native features used where possible
- Better browser performance

**Modern Browser Features:**
- ES modules
- Async/await
- Optional chaining
- Nullish coalescing

**Configuration:** `vite.config.ts`

```typescript
esbuild: {
  target: 'es2020'
}
```

**Browser Support:**
- Chrome 80+
- Firefox 72+
- Safari 13.1+
- Edge 80+

---

### 5. Tailwind CSS Optimization

**PurgeCSS Integration:**
- Scans all files for used classes
- Removes unused CSS
- Production build only includes used styles

**Result:**
- Development: Full Tailwind CSS (~3.5 MB)
- Production: Only used classes (~10-20 KB gzipped)

**Configuration:** `tailwind.config.ts`

```typescript
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  // Automatically purges unused styles
}
```

---

### 6. Cached Obfuscation

**Intelligent Caching:**
- Tracks source file content hashes
- Reuses cached obfuscated code for unchanged files
- Only re-obfuscates changed files

**Benefits:**
- 100% obfuscation coverage
- 100% hash stability
- 95% cache efficiency
- Fast builds (3-5s cached, 15-22s fresh)

**[→ Complete obfuscation documentation](../scripts/obfuscation/README.md)**

---

## Verification

### Check Bundle Structure

```bash
npm run build

# Check output
dist/static/js/
├── react-vendor.[hash].js    # ~40 KB gzipped
├── query-vendor.[hash].js    # ~8 KB gzipped
├── ui-vendor.[hash].js       # ~10 KB gzipped
└── [page].[hash].js          # ~5-10 KB gzipped
```

### Analyze Bundle

```bash
npm run build:analyze

# Opens visual bundle map
# Look for:
# ✅ Separate vendor chunks
# ✅ Small page chunks
# ✅ No large single chunks
```

### Run Lighthouse

```bash
npm run build
npm run preview

# Open Chrome DevTools → Lighthouse
# Run audit on http://localhost:8080

# Target scores:
# Performance: >90
# Accessibility: >95
# Best Practices: >95
# SEO: >90
```

---

## What's NOT Included

These optimizations require manual implementation:

### Image Optimization
- Image compression
- Modern formats (WebP, AVIF)
- Responsive images
- Lazy loading

**[→ See Asset Optimization](./03-asset-optimization.md#images)**

### Font Optimization
- Font subsetting
- Preloading
- Variable fonts

**[→ See Asset Optimization](./03-asset-optimization.md#fonts)**

### Component Memoization
- React.memo
- useMemo
- useCallback

**[→ See Code Optimization](./04-code-optimization.md#react-performance)**

---

## Next Steps

Now that you understand what's built-in, learn how to optimize further:

1. **[Bundle Optimization](./02-bundle-optimization.md)** - Analyze and reduce bundle size
2. **[Asset Optimization](./03-asset-optimization.md)** - Optimize images, fonts & CSS
3. **[Code Optimization](./04-code-optimization.md)** - JavaScript & React best practices
4. **[Network Optimization](./05-network-optimization.md)** - CDN, compression & caching
5. **[Monitoring & Tools](./06-monitoring-and-tools.md)** - Measure and track performance

---

## Summary

### Already Configured ✅

- Smart code splitting
- Production minification
- Tree shaking
- Console removal
- Hash-based caching
- CSS code splitting
- Modern ES2020 target
- Tailwind CSS purging
- Cached obfuscation

### Requires Manual Work ⚠️

- Image optimization
- Font optimization
- Component memoization
- Network configuration
- CDN setup

**Ready to go deeper?** Continue to [Bundle Optimization](./02-bundle-optimization.md)!

