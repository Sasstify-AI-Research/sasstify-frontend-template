# Bundle Optimization

Understanding and optimizing your JavaScript bundle size for optimal performance.

---

## Table of Contents

- [Current Bundle Structure](#current-bundle-structure)
- [Analyzing Your Bundle](#analyzing-your-bundle)
- [Optimization Strategies](#optimization-strategies)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

---

## Current Bundle Structure

### Production Build Output

```
dist/static/js/
├── react-vendor.js    (~40 KB gzipped)  # React core - cached long-term
├── query-vendor.js    (~8 KB gzipped)   # TanStack Query - cached long-term
├── ui-vendor.js       (~10 KB gzipped)  # UI libraries - cached long-term
├── main.js            (~8 KB gzipped)   # Index page - changes often
└── dashboard.js       (~0.3 KB gzipped) # Dashboard page - changes often
```

### Why This Structure?

**Vendor Chunks (Cached 1 Year):**
- Rarely change
- Shared across pages
- Can be cached aggressively

**Page Chunks (Cached 1 Month):**
- Change frequently
- Page-specific code
- Shorter cache duration

**Lazy Chunks (On-Demand):**
- Loaded when needed
- Reduce initial bundle
- Better Time to Interactive

---

## Analyzing Your Bundle

### Step 1: Build with Analyzer

```bash
npm run build:analyze
```

**What Opens:**
- Interactive treemap visualization
- Size breakdown (parsed, gzipped, brotli)
- Chunk contents explorer

### Step 2: Identify Large Dependencies

**Look for:**

```
Red blocks (>100 KB):
- Moment.js (315 KB) ❌ Use date-fns or dayjs
- Lodash (70 KB) ❌ Import individual functions
- Chart.js (250 KB) ⚠️ Consider lazy loading
```

**Good:**

```
Green blocks (<50 KB):
- React (40 KB) ✅ Core framework
- React Router (10 KB) ✅ Navigation
- Clsx (2 KB) ✅ Utility
```

### Step 3: Find Duplicates

**Check for:**
- Same library multiple versions
- Duplicate utilities
- Repeated code patterns

**Example Issue:**
```
node_modules/
├── react@18.2.0 (used by app)
└── some-lib/node_modules/react@17.0.2 (duplicate!)
```

**Solution:**
```json
// package.json
{
  "resolutions": {
    "react": "18.2.0"
  }
}
```

---

## Optimization Strategies

### 1. Tree Shaking

**Use Named Imports:**

```typescript
// ❌ Bad - imports entire library
import * as Icons from 'react-icons/fa';
import _ from 'lodash';

// ✅ Good - tree-shakeable
import { FaHome, FaUser } from 'react-icons/fa';
import { debounce, throttle } from 'lodash-es';
```

**Verify Tree Shaking:**
```bash
npm run build:analyze
# Check if unused code is eliminated
```

---

### 2. Lazy Loading

**Heavy Components:**

```typescript
import { lazy, Suspense } from 'react';

// ❌ Loaded immediately (large bundle)
import HeavyChart from './HeavyChart';

// ✅ Loaded on demand (smaller initial bundle)
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyChart />
    </Suspense>
  );
}
```

**When to Lazy Load:**
- Charts/graphs
- PDF viewers
- Rich text editors
- Admin panels
- Modal content

**[→ Complete lazy loading guide](../reusable-implementations/lazy-loading/)**

---

### 3. Replace Heavy Dependencies

**Common Replacements:**

| Heavy Library | Lightweight Alternative | Savings |
|---------------|------------------------|---------|
| Moment.js (315 KB) | date-fns (15 KB) | -95% |
| Lodash (70 KB) | lodash-es (individual imports) | -80% |
| Axios (13 KB) | Native fetch | -100% |
| jQuery (87 KB) | Native DOM APIs | -100% |

**Example Migration:**

```typescript
// ❌ Before - Moment.js
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');

// ✅ After - date-fns
import { format } from 'date-fns';
const date = format(new Date(), 'yyyy-MM-dd');
```

---

### 4. Dynamic Imports

**Load Code When Needed:**

```typescript
// ❌ Always loaded
import { parseMarkdown } from 'markdown-parser';

// ✅ Load only when needed
async function handleMarkdown(text: string) {
  const { parseMarkdown } = await import('markdown-parser');
  return parseMarkdown(text);
}
```

**Use Cases:**
- Feature flags
- Admin-only features
- Conditional functionality
- Large utilities

---

### 5. Remove Unused Code

**Find Unused Code:**

```bash
# Open Chrome DevTools
# → Coverage tab
# → Reload page
# → Check percentage of unused code

# Target: <20% unused code
```

**Remove Dead Code:**

```typescript
// ❌ Imported but never used
import { unusedFunction } from './utils';

// ❌ Defined but never called
function deadCode() {
  // ...
}

// ✅ Only import what you use
import { usedFunction } from './utils';
```

---

## Common Issues

### Issue 1: Large Vendor Chunk

**Symptom:**
```
vendor.js: 500 KB (200 KB gzipped)
```

**Solution:**
Split into multiple vendor chunks:

```typescript
// vite.config.ts
manualChunks(id) {
  if (id.includes('node_modules/react')) return 'react-vendor';
  if (id.includes('node_modules/chart')) return 'chart-vendor';
  if (id.includes('node_modules')) return 'vendor';
}
```

---

### Issue 2: Duplicate Dependencies

**Symptom:**
```
Bundle contains:
- lodash@4.17.21
- lodash@4.17.20 (duplicate!)
```

**Solution:**

```json
// package.json
{
  "resolutions": {
    "lodash": "4.17.21"
  }
}
```

```bash
npm install
```

---

### Issue 3: Large Initial Chunk

**Symptom:**
```
main.js: 300 KB (100 KB gzipped)
```

**Solution:**
Lazy load below-the-fold content:

```typescript
const AboutSection = lazy(() => import('./AboutSection'));
const ContactForm = lazy(() => import('./ContactForm'));
```

---

## Best Practices

### 1. Set Performance Budget

```typescript
// vite.config.ts
build: {
  chunkSizeWarningLimit: 500, // KB
  rollupOptions: {
    output: {
      // Warn if chunk > 500 KB
      manualChunks: ...
    }
  }
}
```

### 2. Monitor Bundle Size

```bash
# After every feature
npm run build
npm run build:analyze

# Check for growth
# Target: Keep total bundle < 100 KB gzipped
```

### 3. Use Import Cost Extension

**VS Code Extension:**
- `wix.vscode-import-cost`
- Shows size next to imports
- Helps make informed decisions

### 4. Audit Dependencies Regularly

```bash
# Check bundle size impact
npx bundle-wizard

# Find unused dependencies
npx depcheck
```

---

## Quick Wins

### 1-Minute Optimizations

```typescript
// ✅ Use lodash-es instead of lodash
npm install lodash-es
npm uninstall lodash

// ✅ Lazy load modals
const Modal = lazy(() => import('./Modal'));

// ✅ Use tree-shakeable imports
import { useState } from 'react'; // not import React

// ✅ Remove moment.js
npm uninstall moment
npm install date-fns
```

---

## Bundle Size Targets

| Bundle Type | Target | Excellent | Acceptable | Too Large |
|-------------|--------|-----------|------------|-----------|
| **Initial Bundle** | <100 KB | <60 KB | 60-100 KB | >100 KB |
| **Vendor Chunk** | <80 KB | <50 KB | 50-80 KB | >80 KB |
| **Page Chunk** | <20 KB | <10 KB | 10-20 KB | >20 KB |
| **Lazy Chunk** | <30 KB | <15 KB | 15-30 KB | >30 KB |

---

## Next Steps

- **[Asset Optimization](./03-asset-optimization.md)** - Optimize images, fonts & CSS
- **[Code Optimization](./04-code-optimization.md)** - JavaScript & React performance
- **[Lazy Loading Guide](../reusable-implementations/lazy-loading/)** - Detailed lazy loading patterns

---

**Need help?** Run `npm run build:analyze` and look for red blocks (>100 KB)!

