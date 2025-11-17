# smoothScroll Utility

Functions for smooth scrolling behavior.

---

## Table of Contents

- [Import](#import)
- [Functions](#functions)
- [Features](#features)
- [Use Cases](#use-cases)
- [Behavior](#behavior)
- [Files](#files)
- [Related](#related)

---

## 📦 Import

```tsx
import { 
  scrollToElement,
  scrollToTop,
  scrollToSection 
} from '@/utils/smoothScroll';
```

---

## 🔧 Functions

### `scrollToElement(element, offset?)`

Smoothly scrolls to a DOM element.

**Parameters:**
- `element`: `HTMLElement` - Element to scroll to
- `offset`: `number` (optional, default: 0) - Pixels to offset

**Example:**
```tsx
const el = document.getElementById('features');
scrollToElement(el, 80); // 80px offset for header
```

---

### `scrollToTop()`

Smoothly scrolls to the top of the page.

**Example:**
```tsx
<button onClick={scrollToTop}>
  Back to Top
</button>
```

---

### `scrollToSection(sectionId, offset?)`

Smoothly scrolls to a section by ID.

**Parameters:**
- `sectionId`: `string` - Element ID to scroll to
- `offset`: `number` (optional, default: 0) - Pixels to offset

**Example:**
```tsx
<button onClick={() => scrollToSection('about', 100)}>
  Go to About
</button>
```

---

## ✨ Features

- ✅ Smooth scroll animation
- ✅ Custom offset support
- ✅ Header-aware scrolling
- ✅ Cross-browser compatible
- ✅ Respects `prefers-reduced-motion`

---

## 📚 Use Cases

### Navigation Menus
```tsx
const menuItems = [
  { id: 'home', onClick: () => scrollToSection('home', 80) },
  { id: 'about', onClick: () => scrollToSection('about', 80) },
];
```

### Back to Top Button
```tsx
<button 
  onClick={scrollToTop}
  className="back-to-top"
>
  ↑ Top
</button>
```

### Dynamic Scrolling
```tsx
const ref = useRef<HTMLDivElement>(null);

const handleClick = () => {
  if (ref.current) {
    scrollToElement(ref.current, 100);
  }
};
```

---

## 🎨 Behavior

### Smooth Animation
Uses native `scrollIntoView` with smooth behavior.

### Offset Calculation
```
Final position = Element top - Offset
```

Perfect for fixed headers!

### Accessibility
Respects user's motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  /* Instant scroll instead of smooth */
}
```

---

## 📂 Files

```
src/utils/
└── smoothScroll.ts      # Utility functions
```

---

## 🔗 Related

- [useSectionNavigation Hook](../hooks/01-use-section-navigation.md)
- [Section Component](../components/04-section.md)
- [Header Component](../components/01-header.md)
