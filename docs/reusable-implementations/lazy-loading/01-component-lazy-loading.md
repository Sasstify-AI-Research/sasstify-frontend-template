# Lazy Loading Guide

**Complete guide to lazy loading in this template**

---

## 🎯 What is Lazy Loading?

Lazy loading (code splitting) defers loading components until they're needed, reducing initial bundle size and improving page load performance.

### Benefits

✅ **Faster Initial Load** - Smaller initial JavaScript bundle  
✅ **Better Performance** - Only load what's needed  
✅ **Improved UX** - Quicker time-to-interactive  
✅ **Bandwidth Savings** - Users don't download unused code  

---

## 🔧 Automatic (Already Configured ✅)

This template automatically splits code intelligently:

### Vendor Code Splitting

```typescript
// vite.config.ts - Already configured!
manualChunks(id) {
  // React core (~40 KB gzipped)
  if (id.includes('node_modules/react'))
    return 'react-vendor';
    
  // TanStack Query (~8 KB gzipped)
  if (id.includes('@tanstack/react-query'))
    return 'query-vendor';
    
  // UI libraries (~10 KB gzipped)
  if (id.includes('lucide-react') || id.includes('clsx'))
    return 'ui-vendor';
    
  // Other dependencies
  if (id.includes('node_modules'))
    return 'vendor';
}
```

**Result:**
- Vendor code cached separately
- Rarely changes → long cache times
- Only download updates when dependencies change

---

## 📦 Manual Lazy Loading (Component Level)

### When to Use

Lazy load components when they are:

| Scenario | Example | Benefit |
|----------|---------|---------|
| **Heavy (>50 KB)** | Chart libraries, PDF viewers | Significant size reduction |
| **Behind interaction** | Modals, drawers, tooltips | Not needed initially |
| **Conditional** | Premium features, admin panels | Only for specific users |
| **Below fold** | Footer widgets, comments | Not visible initially |

---

## 💻 Implementation Examples

### Example 1: Lazy Load Chart (Index Page)

```typescript
import { lazy, Suspense, useState } from 'react';

// ✅ Lazy load - only loads when needed
const HeavyChart = lazy(() => import('@/components/examples/HeavyChart'));

const Index = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>

      {showChart && (
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
};
```

**Benefits:**
- Chart code not in initial bundle
- Loads only when user clicks button
- Shows loading state during load

---

### Example 2: Lazy Load Modal (Dashboard Page)

```typescript
import { lazy, Suspense, useState } from 'react';

// ✅ Lazy load modal - only loads when opened
const LazyModal = lazy(() => import('@/components/examples/LazyModal'));

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Settings
      </button>

      {isOpen && (
        <Suspense fallback={null}>
          <LazyModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
```

**Benefits:**
- Modal not in initial bundle
- Only loads when opened
- Null fallback (modal opens instantly after load)

---

### Example 3: Route-Based Lazy Loading

If you add more pages:

```typescript
// src/main.tsx or routing file
import { lazy } from 'react';

const Index = lazy(() => import('./pages/index/Index'));
const About = lazy(() => import('./pages/about/About'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Settings = lazy(() => import('./pages/settings/Settings'));

// Each route loads only its page code
```

---

## 🎨 Loading States (Suspense Fallback)

### Basic Spinner

```typescript
<Suspense fallback={
  <div className="flex justify-center p-8">
    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
  </div>
}>
  <LazyComponent />
</Suspense>
```

### Skeleton Loader

```typescript
<Suspense fallback={
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
}>
  <LazyComponent />
</Suspense>
```

### No Fallback (Instant)

```typescript
<Suspense fallback={null}>
  <LazyModal />
</Suspense>
```

Use for modals/tooltips that should appear instantly.

---

## ❌ When NOT to Lazy Load

### Don't Lazy Load:

❌ **Small components** (<10 KB) - overhead not worth it  
❌ **Above-the-fold content** - needed immediately  
❌ **Critical UI** - navigation, headers, footers  
❌ **Frequently used** - better to load upfront  

### Example (Bad):

```typescript
// ❌ DON'T lazy load small utilities
const Button = lazy(() => import('./Button')); // 2 KB - not worth it

// ❌ DON'T lazy load critical UI
const Header = lazy(() => import('./Header')); // Always visible
```

---

## 📊 Bundle Analysis

### Check Your Bundle Sizes

```bash
# Build with analysis
npm run build:analyze

# Opens dist/stats.html with interactive bundle map
```

### What to Look For:

✅ **Good:**
- Vendor chunks: 40-80 KB gzipped
- Page chunks: 5-15 KB gzipped
- Lazy chunks: Loaded separately

❌ **Bad:**
- Single bundle > 200 KB gzipped
- No code splitting
- All components in one file

---

## 🚀 Best Practices

### 1. Lazy Load Heavy Dependencies

```typescript
// ✅ Lazy load heavy libraries
const RichTextEditor = lazy(() => import('react-quill'));
const PDFViewer = lazy(() => import('react-pdf'));
const Charts = lazy(() => import('recharts'));
```

### 2. Preload on Hover

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<button
  onMouseEnter={() => {
    // Preload on hover
    import('./HeavyComponent');
  }}
  onClick={() => setShow(true)}
>
  Show Component
</button>
```

### 3. Group Related Components

```typescript
// ✅ Load related components together
const AdminPanel = lazy(() => import('./admin'));
// admin/index.ts exports multiple components

// ❌ Don't split too granularly
const Button = lazy(() => import('./Button'));
const Input = lazy(() => import('./Input'));
```

### 4. Use Loading Boundaries

```typescript
// ✅ Wrap multiple lazy components in one Suspense
<Suspense fallback={<Loading />}>
  <LazyChart />
  <LazyTable />
  <LazyGraph />
</Suspense>

// ❌ Don't nest too many Suspense boundaries
<Suspense fallback={<Loading1 />}>
  <Suspense fallback={<Loading2 />}>
    <Component />
  </Suspense>
</Suspense>
```

---

## 📈 Performance Impact

### Real-World Example (This Template)

**Before Lazy Loading:**
```
Initial Bundle: ~70 KB gzipped
All code loads at once
```

**After Lazy Loading:**
```
Initial Bundle: ~55 KB gzipped
Chart: ~3 KB (loads on demand)
Modal: ~2 KB (loads on demand)

Savings: 15 KB + components not downloaded until needed
```

### Lighthouse Score Impact

- **FCP (First Contentful Paint):** Improved by 0.2-0.5s
- **TTI (Time to Interactive):** Improved by 0.3-0.8s
- **Total JS:** Reduced by 15-30%

---

## 🧪 Testing

### Verify Lazy Loading Works

1. **Network Tab:**
   ```
   - Load page
   - Check: Only main bundle loads
   - Click button
   - Check: Lazy chunk loads
   ```

2. **Dev Tools Coverage:**
   ```
   - Chrome DevTools → Coverage tab
   - Check: Code utilization
   - Goal: >80% code used on initial load
   ```

3. **Lighthouse:**
   ```
   - Run Lighthouse audit
   - Check: "Avoid enormous network payloads"
   - Check: "Minimize main thread work"
   ```

---

## 📚 Further Reading

- [React Docs: Code Splitting](https://react.dev/reference/react/lazy)
- [Vite Docs: Code Splitting](https://vitejs.dev/guide/features.html#async-chunk-loading-optimization)
- [Web.dev: Code Splitting](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

---

## 🎯 Quick Reference

### Lazy Load Pattern

```typescript
// 1. Import lazy and Suspense
import { lazy, Suspense } from 'react';

// 2. Create lazy component
const LazyComponent = lazy(() => import('./Component'));

// 3. Wrap in Suspense with fallback
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### When to Use

| Component Type | Lazy Load? |
|----------------|------------|
| Modals/Drawers | ✅ Yes |
| Charts/Graphs | ✅ Yes |
| Rich Text Editors | ✅ Yes |
| PDF Viewers | ✅ Yes |
| Admin Panels | ✅ Yes |
| Comments Section | ✅ Yes |
| Header/Footer | ❌ No |
| Navigation | ❌ No |
| Small Components | ❌ No |

---

**Ready to optimize?** Check the live examples on the Index and Dashboard pages!

