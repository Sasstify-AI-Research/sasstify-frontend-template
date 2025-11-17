# Header Component

Responsive site header with navigation.

---

## Table of Contents

- [Import](#import)
- [Usage](#usage)
- [Props](#props)
- [Features](#features)
- [Behavior](#behavior)
- [Styling](#styling)
- [Files](#files)
- [Related](#related)

---

## Import

```tsx
import Header from '@/components/header/Header';
```

---

## Usage

```tsx
const menuItems = [
  { id: 'home', label: 'Home', onClick: () => scrollToSection('home') },
  { id: 'about', label: 'About', onClick: () => scrollToSection('about') },
];

<Header 
  desktopMenuItems={menuItems}
  mobileMenuItems={menuItems}
/>
```

---

## Props

### `desktopMenuItems`
- **Type:** `MenuItem[]`
- **Required:** Yes
- **Description:** Menu items for desktop view

### `mobileMenuItems`
- **Type:** `MenuItem[]`
- **Required:** Yes
- **Description:** Menu items for mobile view

### `MenuItem` Type
```typescript
{
  id: string;
  label: string;
  onClick: () => void;
}
```

---

## Features

- ✅ Responsive design (desktop & mobile)
- ✅ Sticky header on scroll
- ✅ Mobile hamburger menu
- ✅ Smooth animations
- ✅ Active state highlighting
- ✅ Fully typed with TypeScript

---

## Behavior

**Desktop (≥768px):**
- Horizontal menu bar
- Always visible

**Mobile (<768px):**
- Hamburger icon
- Slide-out menu
- Backdrop overlay

---

## Styling

Uses Tailwind CSS utility classes. Customize via:
```tsx
<Header className="custom-class" />
```

---

## Files

```
src/components/header/
├── Header.tsx           # Component
└── Header.types.ts      # TypeScript types
```

---

## Related

- [Layout Component](./03-layout.md)
- [useSectionNavigation Hook](../hooks/01-use-section-navigation.md)
