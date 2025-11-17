# use-mobile Hook

Detects if the device is mobile-sized (< 768px).

---

## Table of Contents

- [Import](#import)
- [Usage](#usage)
- [Returns](#returns)
- [Features](#features)
- [Breakpoint](#breakpoint)
- [Examples](#examples)
- [SSR Considerations](#ssr-considerations)
- [Files](#files)
- [Related](#related)

---

## 📦 Import

```tsx
import { useIsMobile } from '@/hooks/use-mobile';
```

---

## 💡 Usage

```tsx
function Component() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

---

## 📤 Returns

### `isMobile`
- **Type:** `boolean`
- **Description:** `true` if viewport < 768px, otherwise `false`

---

## ✨ Features

- ✅ Responsive breakpoint detection
- ✅ Window resize listener
- ✅ SSR-safe (defaults to false)
- ✅ Debounced for performance
- ✅ Fully typed

---

## 🎯 Breakpoint

**Mobile:** `< 768px`  
**Desktop:** `≥ 768px`

Matches Tailwind's `md:` breakpoint.

---

## 📚 Examples

### Conditional Rendering
```tsx
const isMobile = useIsMobile();

<Header 
  menu={isMobile ? mobileMenu : desktopMenu}
/>
```

### Different Components
```tsx
const isMobile = useIsMobile();

{isMobile ? (
  <MobileNav />
) : (
  <DesktopNav />
)}
```

### Conditional Props
```tsx
const isMobile = useIsMobile();

<Gallery 
  columns={isMobile ? 1 : 3}
  size={isMobile ? 'small' : 'large'}
/>
```

---

## ⚠️ SSR Considerations

Initial render always returns `false` to prevent hydration mismatches.

**Recommendation:** Use CSS media queries for critical above-the-fold content.

---

## 📂 Files

```
src/hooks/
└── use-mobile.tsx      # Hook implementation
```

---

## 🔗 Related

- [Header Component](../components/01-header.md)
