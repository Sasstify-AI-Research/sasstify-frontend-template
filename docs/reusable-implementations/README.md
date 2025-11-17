# Component Library

Complete reference for all reusable components, hooks, and utilities.

---

## Table of Contents

- [Pages](#pages)
- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Lazy Loading Patterns](#lazy-loading-patterns)
- [Quick Examples](#quick-examples)
- [Related Documentation](#related-documentation)

---

## Pages

Complete page implementations that demonstrate best practices for full-page experiences.

| Page | Purpose | Documentation |
|------|---------|---------------|
| `404 Page Not Found` | Professional error page with animations | [→](./pages/01-404-page.md) |

---

## Components

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| `Header` | Site header with navigation | [→](./components/01-header.md) |
| `Footer` | Site footer | [→](./components/02-footer.md) |
| `Layout` | Page wrapper (Header + Footer) | [→](./components/03-layout.md) |
| `Section` | Section wrapper with lazy loading | [→](./components/04-section.md) |
| `ViewportLazyLoad` | Lazy load on viewport entry | [→](./components/05-viewport-lazy-load.md) |

---

## Hooks

| Hook | Purpose | Documentation |
|------|---------|---------------|
| `useSectionNavigation` | Smooth scroll & active sections | [→](./hooks/01-use-section-navigation.md) |
| `use-mobile` | Mobile device detection | [→](./hooks/02-use-mobile.md) |

---

## Utilities

| Utility | Purpose | Documentation |
|---------|---------|---------------|
| `smoothScroll` | Smooth scrolling functions | [→](./utils/01-smooth-scroll.md) |

---

## Lazy Loading Patterns

Complete guide to implementing lazy loading in your application.

| Pattern | Purpose | Documentation |
|---------|---------|---------------|
| **Overview** | All lazy loading patterns | [→](./lazy-loading/) |
| **Component-Level** | Button-click lazy loading | [→](./lazy-loading/01-component-lazy-loading.md) |
| **Viewport-Based** | Scroll-triggered lazy loading | [→](./lazy-loading/02-viewport-lazy-loading.md) |

### Quick Examples

**Button-Click Lazy Loading:**
```tsx
import { lazy, Suspense } from 'react';

const Modal = lazy(() => import('./Modal'));

<button onClick={() => setShow(true)}>Open</button>
{show && <Suspense><Modal /></Suspense>}
```

**Viewport Lazy Loading:**
```tsx
import Section from '@/components/section/Section';

<Section id="features" viewportLazyLoad>
  <FeaturesContent />
</Section>
```

---

## Quick Examples

### Layout
```tsx
import Layout from '@/components/layout/Layout';

<Layout fixedHeader={true}>
  <YourPageContent />
</Layout>
```

### Section
```tsx
import Section from '@/components/section/Section';

<Section 
  id="about" 
  variant="gray" 
  minHeight="600px"
  viewportLazyLoad
>
  <AboutContent />
</Section>
```

### Hook
```tsx
import { useSectionNavigation } from '@/hooks/useSectionNavigation';

const { activeSection, scrollToSection } = useSectionNavigation({
  sections: ['home', 'about', 'contact'],
  headerOffset: 80,
});
```

---

## Related Documentation

- [Create Page Script](../scripts/01-CREATE_PAGE.md)
- [Performance Optimization Guide](../performance-optimization-guide/)
- [Lazy Loading Patterns](./lazy-loading/)

---

**All components are fully typed with TypeScript!** 🎯
