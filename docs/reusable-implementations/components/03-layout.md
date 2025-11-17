# Layout Component

Page wrapper providing consistent header and footer.

---

## Table of Contents

- [Import](#import)
- [Usage](#usage)
- [Props](#props)
- [Features](#features)
- [Structure](#structure)
- [Examples](#examples)
- [Files](#files)
- [Related](#related)

---

## Import

```tsx
import Layout from '@/components/layout/Layout';
```

---

## Usage

```tsx
<Layout fixedHeader={true}>
  <YourPageContent />
</Layout>
```

---

## Props

### `children`
- **Type:** `ReactNode`
- **Required:** Yes
- **Description:** Page content

### `fixedHeader`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Whether header should be fixed/sticky

### `desktopMenuItems`
- **Type:** `MenuItem[]`
- **Optional:** Yes
- **Description:** Desktop navigation items (passed to Header)

### `mobileMenuItems`
- **Type:** `MenuItem[]`
- **Optional:** Yes
- **Description:** Mobile navigation items (passed to Header)

---

## Features

- ✅ Consistent page structure
- ✅ Fixed or static header
- ✅ Responsive design
- ✅ Proper spacing for fixed header
- ✅ Fully typed with TypeScript

---

## Structure

```tsx
<div className="min-h-screen flex flex-col">
  {fixedHeader ? (
    <header className="fixed top-0">
      <Header {...menuItems} />
    </header>
  ) : (
    <Header {...menuItems} />
  )}
  
  <main className="flex-1">
    {children}
  </main>
  
  <Footer />
</div>
```

---

## Examples

### With Fixed Header
```tsx
<Layout fixedHeader={true}>
  <HomePage />
</Layout>
```

### With Menu Items
```tsx
<Layout 
  fixedHeader={true}
  desktopMenuItems={menuItems}
  mobileMenuItems={menuItems}
>
  <HomePage />
</Layout>
```

### Static Header
```tsx
<Layout fixedHeader={false}>
  <Dashboard />
</Layout>
```

---

## Files

```
src/components/layout/
├── Layout.tsx           # Component
└── Layout.types.ts      # TypeScript types
```

---

## Related

- [Header Component](./01-header.md)
- [Footer Component](./02-footer.md)
- [Section Component](./04-section.md)
