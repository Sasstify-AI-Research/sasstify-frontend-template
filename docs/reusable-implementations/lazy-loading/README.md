# Lazy Loading Patterns

Complete guide to lazy loading patterns implemented in this template.

---

## Table of Contents

- [Overview](#overview)
- [Patterns Implemented](#patterns-implemented)
- [Documentation](#documentation)
- [Quick Reference](#quick-reference)

---

## Overview

This template implements **three types of lazy loading patterns** to optimize performance:

1. **Component-Level Lazy Loading** - Load components on user interaction (button clicks, modals)
2. **Viewport-Based Lazy Loading** - Load content when scrolled into view
3. **Automatic Code Splitting** - Vendor and page-level splitting (already configured)

---

## 🧩 Patterns Implemented

### 1. Component-Level (Button-Click)

**When to use:** Heavy components loaded behind user interactions

**Examples:**
- Charts and graphs
- Modals and dialogs
- PDF viewers
- Rich text editors

**Implementation:** React `lazy()` + `Suspense`

**Documentation:** [01-component-lazy-loading.md](./01-component-lazy-loading.md)

---

### 2. Viewport-Based (Scroll-Triggered)

**When to use:** Below-the-fold content sections

**Examples:**
- Feature sections
- About sections
- Image galleries
- Product listings

**Implementation:** `ViewportLazyLoad` component + Intersection Observer API

**Documentation:** [02-viewport-lazy-loading.md](./02-viewport-lazy-loading.md)

---

### 3. Automatic Code Splitting

**When to use:** Always enabled (configured in `vite.config.ts`)

**What it does:**
- Splits vendor code (React, UI libraries)
- Splits page code (Index, Dashboard)
- Generates separate chunks for lazy components

**Result:** Optimal caching and performance

---

## 📚 Documentation

| Document | Description | Time |
|----------|-------------|------|
| [01-component-lazy-loading.md](./01-component-lazy-loading.md) | Button-click lazy loading patterns | 5 min |
| [02-viewport-lazy-loading.md](./02-viewport-lazy-loading.md) | Viewport-based lazy loading guide | 5 min |

---

## Quick Reference

### Button-Click Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  {showComponent && <HeavyComponent />}
</Suspense>
```

### Viewport-Based Lazy Loading

```typescript
import { Section } from '@/components/section/Section';

<Section
  id="features"
  viewportLazyLoad={true}
>
  <FeaturesContent />
</Section>
```

---

## 🔗 Related

- [Components Documentation](../components/)
- [Performance Optimization Guide](../../performance-optimization-guide/)
- [Production Build](../../production-build/)

---

**Ready to optimize?** Choose the right lazy loading pattern for your use case!

