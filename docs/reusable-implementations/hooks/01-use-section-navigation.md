# useSectionNavigation Hook

Manages smooth scrolling, active section tracking, and hash-based navigation.

---

## Table of Contents

- [Import](#import)
- [Usage](#usage)
- [Options](#options)
- [Returns](#returns)
- [Features](#features)
- [Behavior](#behavior)
- [Examples](#examples)
- [URL Hash Management](#url-hash-management)
- [Lazy Loading Support](#lazy-loading-support)
- [Header Offset](#header-offset)
- [Implementation Details](#implementation-details)
- [Files](#files)
- [Related](#related)
- [Tips](#tips)

---

## 📦 Import

```tsx
import { useSectionNavigation } from '@/hooks/useSectionNavigation';
```

---

## 💡 Usage

```tsx
const { activeSection, scrollToSection } = useSectionNavigation({
  sections: ['home', 'features', 'about', 'contact'],
  headerOffset: 80,
});

// Use in menu items
const menuItems = sections.map(id => ({
  id,
  label: capitalize(id),
  onClick: () => scrollToSection(id),
  isActive: activeSection === id,
}));
```

---

## 🔧 Options

### `sections` (Required)
- **Type:** `string[]`
- **Description:** Array of section IDs to track

### `headerOffset`
- **Type:** `number`
- **Default:** `80`
- **Description:** Pixels to offset scroll (for fixed headers)

---

## 📤 Returns

### `activeSection`
- **Type:** `string`
- **Description:** Currently active section ID

### `scrollToSection`
- **Type:** `(sectionId: string) => void`
- **Description:** Function to scroll to a section

---

## ✨ Features

- ✅ Smooth scrolling to sections
- ✅ Active section detection on scroll
- ✅ URL hash management (#section)
- ✅ Page reload scroll restoration
- ✅ Lazy-loaded section support
- ✅ Header offset adjustment
- ✅ Browser back/forward support

---

## 🎯 Behavior

### On Page Load
1. Always scrolls to top first
2. Reads hash from URL (#about)
3. Smoothly scrolls to section (if exists)
4. Updates active section

### On Menu Click
1. Updates URL hash (#features)
2. Scrolls to section (smooth)
3. Updates active section
4. Handles lazy-loaded sections

### On Scroll
1. Detects which section is visible
2. Updates active section
3. Updates URL hash
4. Respects header offset

### On Browser Back/Forward
1. Reads new hash from URL
2. Scrolls to that section
3. Updates active section

---

## 📚 Examples

### Basic Setup
```tsx
function HomePage() {
  const { activeSection, scrollToSection } = useSectionNavigation({
    sections: ['home', 'about', 'contact'],
    headerOffset: 80,
  });

  return (
    <Layout>
      <Section id="home">Home</Section>
      <Section id="about">About</Section>
      <Section id="contact">Contact</Section>
    </Layout>
  );
}
```

### With Menu Items
```tsx
const { activeSection, scrollToSection } = useSectionNavigation({
  sections: ['home', 'features', 'about'],
  headerOffset: 150,
});

const menuItems = [
  {
    id: 'home',
    label: 'Home',
    onClick: () => scrollToSection('home'),
  },
  {
    id: 'features',
    label: 'Features',
    onClick: () => scrollToSection('features'),
  },
  {
    id: 'about',
    label: 'About',
    onClick: () => scrollToSection('about'),
  },
];

<Header 
  desktopMenuItems={menuItems}
  mobileMenuItems={menuItems}
/>
```

### With Active State
```tsx
const menuItems = sections.map(id => ({
  id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
  onClick: () => scrollToSection(id),
  className: activeSection === id ? 'active' : '',
}));
```

---

## 🎨 URL Hash Management

### Direct Links
Users can share URLs with sections:
```
https://yoursite.com/#features
https://yoursite.com/#about
```

On load, page scrolls to that section!

### Browser History
- Back/Forward buttons work correctly
- Each section is a history entry
- Bookmarkable sections

---

## 🚀 Lazy Loading Support

**Problem:** Lazy-loaded sections don't exist in DOM initially.

**Solution:**
1. Scrolls to estimated position
2. Triggers IntersectionObserver
3. Section loads
4. Scrolls to exact position

**Result:** Smooth navigation even for lazy sections!

---

## ⚙️ Header Offset

### Why Needed?
Fixed headers cover content when scrolling.

### How to Calculate
```
Header height + shadows + desired spacing = offset
```

**Examples:**
```tsx
// Small header (60px)
headerOffset: 80

// Medium header (80px)  
headerOffset: 120

// Large header (100px)
headerOffset: 150
```

---

## 🔍 Implementation Details

### Active Section Detection
- Uses Intersection Observer
- Tracks visible sections
- Picks topmost visible section
- Updates on scroll

### Scroll Behavior
- Smooth scroll animation
- Respects `prefers-reduced-motion`
- Works with lazy-loaded content
- Handles edge cases

### Hash Management
- Reads/writes `window.location.hash`
- Listens to `hashchange` events
- Handles page reload
- Updates browser history

---

## 📂 Files

```
src/hooks/
└── useSectionNavigation.ts      # Hook implementation
```

---

## 🔗 Related

- [Section Component](../components/04-section.md)
- [Layout Component](../components/03-layout.md)
- [smoothScroll Utility](../utils/01-smooth-scroll.md)
- [Viewport Lazy Loading](../lazy-loading/02-viewport-lazy-loading.md)

---

## 💡 Tips

✅ **DO:**
- Use consistent section IDs
- Include 'home' as first section
- Adjust offset for header height
- Test on mobile devices

❌ **DON'T:**
- Use special chars in section IDs
- Forget header offset
- Mix with other scroll libraries
- Manually update hashes
