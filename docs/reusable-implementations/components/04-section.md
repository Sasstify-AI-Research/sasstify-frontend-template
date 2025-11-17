# Section Component

Reusable section wrapper with lazy loading support.

---

## Table of Contents

- [Import](#import)
- [Basic Usage](#basic-usage)
- [Props](#props)
- [Features](#features)
- [Examples](#examples)
- [Variants](#variants)
- [Performance](#performance)
- [Height Behavior](#height-behavior)
- [Containerization](#containerization)
- [Files](#files)
- [Related](#related)

---

## Import

```tsx
import Section from '@/components/section/Section';
```

---

## Basic Usage

```tsx
<Section id="about">
  <h2>About Us</h2>
  <p>Company information...</p>
</Section>
```

---

## Props

### `id` (Required)
- **Type:** `string`
- **Description:** Section identifier (for navigation anchors)

### `children` (Required)
- **Type:** `ReactNode`
- **Description:** Section content

### `variant`
- **Type:** `'white' | 'gray'`
- **Default:** `'white'`
- **Description:** Background color variant

### `minHeight`
- **Type:** `string`
- **Default:** `'auto'`
- **Description:** Minimum section height (e.g., '600px', '50vh')

### `viewportLazyLoad`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable viewport-based lazy loading

### `containerized`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Wrap content in max-width container

---

## Features

- ✅ Consistent section styling
- ✅ Optional lazy loading
- ✅ Background variants
- ✅ Custom min-height
- ✅ Containerized or full-width
- ✅ Fully typed

---

## Examples

### Basic Section
```tsx
<Section id="hero">
  <HeroContent />
</Section>
```

### With Lazy Loading
```tsx
<Section id="features" viewportLazyLoad>
  <FeaturesContent />
</Section>
```

### Gray Background
```tsx
<Section id="about" variant="gray">
  <AboutContent />
</Section>
```

### Custom Height
```tsx
<Section id="hero" minHeight="100vh">
  <FullScreenHero />
</Section>
```

### Full Width (No Container)
```tsx
<Section id="map" containerized={false}>
  <GoogleMap />
</Section>
```

### Combined Props
```tsx
<Section 
  id="features"
  variant="gray"
  minHeight="600px"
  viewportLazyLoad
>
  <FeaturesGrid />
</Section>
```

---

## Variants

### White (Default)
```tsx
<Section id="section1" variant="white">
  {/* White background */}
</Section>
```

### Gray
```tsx
<Section id="section2" variant="gray">
  {/* Light gray background */}
</Section>
```

---

## Performance

When using `viewportLazyLoad`:
- Content only loads when scrolled into view
- Uses Intersection Observer API
- Improves initial page load
- Reduces bundle size

**Perfect for:**
- Below-the-fold content
- Heavy sections
- Long pages

---

## Height Behavior

### Auto (Default)
```tsx
<Section id="about">
  {/* Height based on content */}
</Section>
```

### Fixed Minimum
```tsx
<Section id="hero" minHeight="600px">
  {/* At least 600px tall */}
</Section>
```

### Viewport-Based
```tsx
<Section id="hero" minHeight="100vh">
  {/* Full viewport height */}
</Section>
```

---

## Containerization

### Containerized (Default)
```tsx
<Section id="about" containerized={true}>
  {/* Content in max-width container */}
</Section>
```

**Result:**
- Max width: 1280px
- Centered
- Horizontal padding
- Responsive

### Non-Containerized
```tsx
<Section id="map" containerized={false}>
  {/* Content spans full width */}
</Section>
```

**Use for:**
- Full-width maps
- Hero images
- Background patterns

---

## 📂 Files

```
src/components/section/
├── Section.tsx           # Component
└── Section.types.ts      # TypeScript types
```

---

## 🔗 Related

- [ViewportLazyLoad Component](./05-viewport-lazy-load.md)
- [Viewport Lazy Loading Guide](../lazy-loading/02-viewport-lazy-loading.md)
- [Layout Component](./03-layout.md)
