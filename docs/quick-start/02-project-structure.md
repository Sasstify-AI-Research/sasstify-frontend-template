# Project Structure

Understanding the directory layout and where everything lives.

---

## Table of Contents

- [Overview](#overview)
- [Source Code](#source-code)
- [Configuration Files](#configuration-files)
- [Documentation](#documentation)
- [Build Output](#build-output)

---

## Overview

```
sasstify-frontend-template/
├── src/                    ← Source code
├── public/                 ← Static assets
├── docs/                   ← Documentation
├── scripts/                ← Automation scripts
├── dist/                   ← Production build (generated)
├── node_modules/           ← Dependencies (generated)
├── .vite-cache/            ← Build cache (generated)
├── vite.config.ts          ← Vite configuration
├── tailwind.config.ts      ← Tailwind CSS config
├── tsconfig.json           ← TypeScript config
└── package.json            ← Dependencies & scripts
```

---

## Source Code

### Pages Directory (Multi-Page Application)

```
src/pages/
├── index/                  ← Index page (/)
│   ├── index.html          ← HTML entry point
│   ├── main.tsx            ← React entry point
│   ├── Index.tsx           ← Page component
│   ├── Index.module.css    ← Page-specific styles
│   └── components/         ← Page-specific components
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       └── AboutSection.tsx
└── dashboard/              ← Dashboard page (/dashboard/)
    ├── index.html
    ├── main.tsx
    ├── Dashboard.tsx
    └── Dashboard.module.css
```

**Key Points:**
- Each page has its own directory
- Each page has `index.html` + `main.tsx` + `[Page].tsx`
- Page-specific components go in `components/` subfolder
- URLs map directly: `pages/about/` → `/about/`

---

### Components Directory (Reusable)

```
src/components/
├── layout/                 ← Layout components
│   └── layout/
│       ├── Layout.tsx
│       └── Layout.types.ts
├── header/                 ← Header component
│   └── header/
│       ├── Header.tsx
│       └── Header.types.ts
├── footer/                 ← Footer component
│   └── footer/
│       ├── Footer.tsx
│       └── Footer.types.ts
├── section/                ← Section wrapper
│   └── Section.tsx
└── viewport-lazy-load/     ← Lazy loading wrapper
    ├── ViewportLazyLoad.tsx
    └── ViewportLazyLoad.types.ts
```

**Key Points:**
- Only truly **reusable** components go here
- Page-specific components stay in `pages/[page]/components/`
- Each component has its own folder
- Types in separate `.types.ts` files

**[→ Component documentation](../reusable-implementations/)**

---

### Hooks Directory

```
src/hooks/
└── useSectionNavigation.ts   ← Smooth scroll & navigation
```

**Custom React hooks:**
- Reusable stateful logic
- Can be used across pages
- Follow `use[Name]` naming convention

**[→ Hooks documentation](../reusable-implementations/hooks/)**

---

### Utils Directory

```
src/utils/
└── smoothScroll.ts           ← Smooth scrolling utilities
```

**Utility functions:**
- Pure helper functions
- No React dependencies
- Can be imported anywhere

**[→ Utils documentation](../reusable-implementations/utils/)**

---

## Configuration Files

### Root Level

**vite.config.ts** - Vite configuration
- Build settings
- Dev server config
- Plugins (obfuscation, etc.)
- Multi-page setup

**tailwind.config.ts** - Tailwind CSS
- Theme customization
- Content paths
- Plugins

**tsconfig.json** - TypeScript
- Compiler options
- Path aliases (`@/` → `src/`)
- Target: ES2020

**package.json** - Project metadata
- Dependencies
- npm scripts
- Project info

**[→ Build configuration docs](../production-build/03-configuration.md)**

---

## Documentation

```
docs/
├── README.md                      ← Main documentation index
├── quick-start/                   ← You are here! ⭐
│   ├── README.md
│   ├── 01-installation.md
│   ├── 02-project-structure.md
│   ├── 03-making-changes.md
│   ├── 04-common-tasks.md
│   ├── 05-building-and-deploying.md
│   └── 06-troubleshooting.md
├── scripts/                       ← NPM scripts & automation
├── production-build/              ← Build process
├── performance-optimization-guide/← Performance tips
└── reusable-implementations/      ← Component library
```

**[→ Complete documentation index](../README.md)**

---

## Build Output

### Development

When running `npm run dev`:
- No build output
- Files served from memory
- HMR enabled
- Source maps available

### Production

After running `npm run build`:

```
dist/
├── index.html                     ← Index page
├── dashboard/
│   └── index.html                 ← Dashboard page
└── static/
    ├── js/
    │   ├── CNkZXMZn.js            ← Query vendor chunk (~2.5 KB gzipped)
    │   ├── LIZo4OzT.js            ← Other vendors (~45 KB gzipped)
    │   ├── Dj7pr43P.js            ← React vendor (~315 KB gzipped)
    │   ├── BDsDggUV.js            ← Main page code (~8 KB gzipped)
    │   └── [hash].js              ← Additional chunks (hashed)
    └── css/
        └── DSJ3S4vk.css           ← Styles (~4.7 KB gzipped)
```

**Key Points:**
- Clean URL structure
- Only hash-based filenames (no descriptive names)
- Separate vendor chunks for optimal caching
- Optimized, minified & obfuscated

**[→ Build process documentation](../production-build/)**

---

## Important Directories

### .vite-cache/

**Purpose:** Build cache for faster subsequent builds

**Contains:**
- Compiled code cache
- Obfuscation cache
- Dependency cache

**When to delete:**
- Troubleshooting build issues
- After major config changes
- Use: `npm run build:clean`

---

### node_modules/

**Purpose:** Installed dependencies

**Size:** ~500MB

**When to delete:**
- Troubleshooting dependency issues
- Reinstall: `rm -rf node_modules && npm install`

---

## Path Aliases

TypeScript path aliases configured:

```typescript
// Instead of:
import { Header } from '../../../components/header/header/Header';

// You can use:
import { Header } from '@/components/header/header/Header';
```

**Alias:** `@/` → `src/`

**Configured in:** `tsconfig.json` and `vite.config.ts`

---

## File Naming Conventions

### Components
- **PascalCase:** `MyComponent.tsx`
- **Types:** `MyComponent.types.ts`
- **Styles:** `MyComponent.module.css`

### Hooks
- **camelCase:** `useSectionNavigation.ts`
- **Prefix:** Always start with `use`

### Utils
- **camelCase:** `smoothScroll.ts`

### Pages
- **kebab-case:** Folder names (`about-us/`)
- **PascalCase:** Component files (`AboutUs.tsx`)

---

## Quick Reference

| Location | Purpose | Example |
|----------|---------|---------|
| `src/pages/` | MPA pages | `pages/about/` → `/about/` |
| `src/components/` | Reusable components | `Header`, `Footer` |
| `src/hooks/` | Custom React hooks | `useSectionNavigation` |
| `src/utils/` | Utility functions | `smoothScroll` |
| `scripts/` | Automation scripts | `create-page.js` |
| `docs/` | Documentation | You are here! |
| `dist/` | Production build | Deploy this |

---

## Next Steps

→ [Making Changes](./03-making-changes.md) - Start editing pages and components

→ [Common Tasks](./04-common-tasks.md) - Practical examples

---

**Now you understand the structure!** Continue to [Making Changes](./03-making-changes.md).

