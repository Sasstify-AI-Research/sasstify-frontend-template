# Making Changes

Learn how to edit pages, add new pages, and use components.

---

## Table of Contents

- [Edit Existing Pages](#edit-existing-pages)
- [Add New Page](#add-new-page)
- [Use Components](#use-components)
- [Add Styles](#add-styles)

---

## Edit Existing Pages

### Index Page

**File:** `src/pages/index/Index.tsx`

```typescript
import { Layout } from '@/components/layout/layout/Layout';

export default function Index() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold">
        Welcome to My App
      </h1>
      <p className="mt-4">
        Start editing to see changes instantly!
      </p>
    </Layout>
  );
}
```

**Save the file** → See instant update in browser (HMR)

---

### Dashboard Page

**File:** `src/pages/dashboard/Dashboard.tsx`

```typescript
import { Layout } from '@/components/layout/layout/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>Your dashboard content here</p>
    </Layout>
  );
}
```

---

## Add New Page

### Option 1: Automated (Recommended)

```bash
npm run create:page
```

**Interactive prompts:**
```
? Page name (kebab-case): about
? Page title: About Us
? Page description: Learn about our company
? Create CSS file? (Y/n): Y
? Create components folder? (Y/n): Y
? Initial component name (optional): TeamSection
```

**Result:**
- Creates `src/pages/about/`
- All files generated
- `vite.config.ts` updated automatically
- Page available at `/about/`

**[→ Complete guide](../scripts/01-CREATE_PAGE.md)**

---

### Option 2: Manual

1. **Create directory:**
```bash
mkdir -p src/pages/about
```

2. **Create HTML entry:**
```html
<!-- src/pages/about/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About Us</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.tsx"></script>
</body>
</html>
```

3. **Create React entry:**
```typescript
// src/pages/about/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import About from './About';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <About />
  </React.StrictMode>
);
```

4. **Create page component:**
```typescript
// src/pages/about/About.tsx
import { Layout } from '@/components/layout/layout/Layout';

export default function About() {
  return (
    <Layout>
      <h1>About Us</h1>
      <p>Welcome to our about page</p>
    </Layout>
  );
}
```

5. **Update vite.config.ts:**
```typescript
// Add to rollupOptions.input
input: {
  main: resolve(__dirname, 'src/pages/index/index.html'),
  dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
  about: resolve(__dirname, 'src/pages/about/index.html'), // Add this
},
```

---

## Use Components

### Layout Component

**Wrap all pages:**
```typescript
import { Layout } from '@/components/layout/layout/Layout';

export default function MyPage() {
  return (
    <Layout>
      {/* Your content */}
    </Layout>
  );
}
```

**[→ Layout documentation](../reusable-implementations/components/03-layout.md)**

---

### Section Component

**Create page sections:**
```typescript
import { Section } from '@/components/section/Section';

export default function MyPage() {
  return (
    <Layout>
      <Section id="hero" className="bg-blue-600 text-white">
        <h1>Hero Section</h1>
      </Section>
      
      <Section id="features" viewportLazyLoad={true}>
        <h2>Features</h2>
        <p>This section lazy loads when scrolled into view</p>
      </Section>
    </Layout>
  );
}
```

**[→ Section documentation](../reusable-implementations/components/04-section.md)**

---

### ViewportLazyLoad Component

**Lazy load content:**
```typescript
import { ViewportLazyLoad } from '@/components/viewport-lazy-load/ViewportLazyLoad';

export default function MyPage() {
  return (
    <Layout>
      <ViewportLazyLoad>
        <HeavyComponent />
      </ViewportLazyLoad>
    </Layout>
  );
}
```

**[→ ViewportLazyLoad documentation](../reusable-implementations/components/05-viewport-lazy-load.md)**

---

### useSectionNavigation Hook

**Smooth scrolling navigation:**
```typescript
import { useSectionNavigation } from '@/hooks/useSectionNavigation';

export default function MyPage() {
  const { scrollToSection } = useSectionNavigation({
    sections: ['hero', 'features', 'about'],
  });
  
  return (
    <Layout>
      <nav>
        <button onClick={() => scrollToSection('hero')}>Hero</button>
        <button onClick={() => scrollToSection('features')}>Features</button>
      </nav>
      
      <Section id="hero">...</Section>
      <Section id="features">...</Section>
    </Layout>
  );
}
```

**[→ useSectionNavigation documentation](../reusable-implementations/hooks/01-use-section-navigation.md)**

---

## Add Styles

### Tailwind CSS

**Use utility classes:**
```typescript
<div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg">
  <h1 className="text-4xl font-bold mb-4">Heading</h1>
  <p className="text-lg">Paragraph</p>
</div>
```

**Responsive:**
```typescript
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-2xl md:text-4xl lg:text-6xl">
    Responsive Heading
  </h1>
</div>
```

---

### CSS Modules

**Create module:**
```css
/* MyComponent.module.css */
.container {
  padding: 2rem;
  background-color: #f0f0f0;
}

.title {
  font-size: 2rem;
  font-weight: bold;
}
```

**Use in component:**
```typescript
import styles from './MyComponent.module.css';

export function MyComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Title</h1>
    </div>
  );
}
```

---

### Global Styles

**File:** `public/styles/global.css`

```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add your custom global styles below */
.custom-button {
  @apply bg-blue-600 text-white px-4 py-2 rounded;
}

/* Custom utility classes */
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
```

**Note:** This file is imported in `src/components/header/Header.tsx`, which is part of the `Layout` component, so it's automatically included on all pages.

**Alternative:** For page-specific styles, create a `.module.css` file in the page directory.

---

## Quick Reference

| Task | How To |
|------|--------|
| Edit page | Edit `src/pages/[page]/[Page].tsx` |
| Add page | `npm run create:page` |
| Use layout | Import `Layout` component |
| Use section | Import `Section` component |
| Add styles | Use Tailwind classes |
| Custom CSS | Create `.module.css` file |

---

## Next Steps

→ [Common Tasks](./04-common-tasks.md) - Practical examples

→ [Component Library](../reusable-implementations/) - All available components

---

**Ready to build!** Continue to [Common Tasks](./04-common-tasks.md) for practical examples.

