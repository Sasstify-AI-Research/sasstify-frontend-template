# NPM Scripts & Automation

Complete guide to all npm scripts and automation tools in this project.

---

## Table of Contents

- [Available Scripts](#available-scripts)
- [Quick Navigation](#quick-navigation)
- [Overview](#overview)
- [Development](#development)
- [Build](#build)
- [Page Management](#page-management)
- [Code Quality](#code-quality)
- [Preview](#preview)
- [Performance](#performance)
- [Workflows](#workflows)
- [Quick Reference](#quick-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

## Available Scripts

```json
{
  "dev": "vite",
  "build": "vite build && node scripts/post-build.js",
  "build:clean": "rm -rf .vite-cache dist && vite build && node scripts/post-build.js",
  "build:analyze": "ANALYZE=true vite build && node scripts/post-build.js",
  "create:page": "node scripts/create-page.js",
  "delete:page": "node scripts/delete-page.js",
  "create:component": "node scripts/create-component.js",
  "delete:component": "node scripts/delete-component.js",
  "create:ui-component": "node scripts/create-ui-component.js",
  "delete:ui-component": "node scripts/delete-ui-component.js",
  "create:block": "node scripts/create-block.js",
  "delete:block": "node scripts/delete-block.js",
  "analyze:components": "node scripts/analyze-components.js",
  "analyze:blocks": "node scripts/analyze-blocks.js",
  "analyze:ui-components": "node scripts/analyze-ui-components.js",
  "analyze:pages": "node scripts/analyze-pages.js",
  "analyze:deps": "node scripts/analyze-deps.js",
  "add:shadcn": "node scripts/add-shadcn-component.js",
  "manage:registry": "node scripts/manage-shadcn-registry.js",
  "list:registry": "node scripts/list-registry-components.js",
  "lint": "eslint .",
  "type-check": "tsc --noEmit",
  "preview": "vite preview"
}
```

---

## Quick Navigation

| Script | Purpose | Documentation |
|--------|---------|---------------|
| [post-build.js](./01-POST_BUILD.md) | Post-build directory restructuring | (runs automatically) |
| [create-page.js](#npm-run-createpage) | Create new MPA page | [Complete Guide →](./02-CREATE_PAGE.md) |
| [delete-page.js](#npm-run-deletepage) | Delete existing MPA page | [Complete Guide →](./03-DELETE_PAGE.md) |
| [create-component.js](#npm-run-createcomponent) | Create regular component | [Complete Guide →](./04-CREATE_COMPONENT.md) |
| [delete-component.js](#npm-run-deletecomponent) | Delete regular component | [Complete Guide →](./05-DELETE_COMPONENT.md) |
| [create-ui-component.js](#npm-run-createuicomponent) | Create UI component | [Complete Guide →](./06-CREATE_UI_COMPONENT.md) |
| [delete-ui-component.js](#npm-run-deleteuicomponent) | Delete UI component | [Complete Guide →](./07-DELETE_UI_COMPONENT.md) |
| [create-block.js](#npm-run-createblock) | Create block component | [Complete Guide →](./14-CREATE_BLOCK.md) |
| [delete-block.js](#npm-run-deleteblock) | Delete block component | [Complete Guide →](./15-DELETE_BLOCK.md) |
| [add-shadcn-component.js](#npm-run-addshadcn) | Add & adapt shadcn component | [Complete Guide →](./12-ADD_SHADCN_COMPONENT.md) |
| [manage-shadcn-registry.js](#npm-run-manageregistry) | Manage shadcn registries | [Complete Guide →](./16-MANAGE_SHADCN_REGISTRY.md) |
| [list-registry-components.js](#npm-run-listregistry) | List registry components | [Complete Guide →](./17-LIST_REGISTRY_COMPONENTS.md) |
| [analyze-pages.js](#npm-run-analyzepages) | Analyze pages | [Complete Guide →](./08-ANALYZE_PAGES.md) |
| [analyze-components.js](#npm-run-analyzecomponents) | Analyze regular components | [Complete Guide →](./09-ANALYZE_COMPONENTS.md) |
| [analyze-blocks.js](#npm-run-analyzeblocks) | Analyze block components | [Complete Guide →](./10-ANALYZE_BLOCKS.md) |
| [analyze-ui-components.js](#npm-run-analyzeuicomponents) | Analyze UI components | [Complete Guide →](./13-ANALYZE_UI_COMPONENTS.md) |
| [analyze-deps.js](#npm-run-analyzedeps) | Analyze NPM dependencies | [Complete Guide →](./11-ANALYZE_DEPS.md) |
| [cached-obfuscation-plugin.js](./obfuscation/README.md) | Cached obfuscation system | (runs automatically) |

---

## Overview

### Page Management Scripts

**Create & Delete pages easily:**
- ✅ Interactive CLI prompts
- ✅ Automatic file generation
- ✅ Updates `vite.config.ts` automatically
- ✅ Safe with validations and confirmations

### Build Scripts

**Automated build process:**
- ✅ Directory restructuring
- ✅ Clean URL generation
- ✅ Production-ready output
- ✅ Cached obfuscation
- ✅ Hash stability

---

## Development

### `npm run dev`

**Purpose:** Start development server

**What it does:**
- Starts server on `http://localhost:8080`
- Hot Module Replacement (HMR)
- Fast refresh on file changes
- TypeScript compilation on-the-fly

**Output:**
```
VITE v7.0.4  ready in 299 ms

➜  Local:   http://localhost:8080/
➜  Network: http://192.168.1.x:8080/
```

**Features:**
- Instant start (~300ms)
- Lightning-fast HMR (<100ms)
- Dev server middleware
- Source maps enabled

**When to use:**
- ✅ During development
- ✅ Testing features
- ✅ Debugging

---

## Build

### `npm run build`

**Purpose:** Build for production

**Command:** `vite build && node scripts/post-build.js`

**Time:** ~3-5 seconds

**Output:**
```
✓ 1710 modules transformed
✓ built in 3.73s
📦 Post-build cleanup complete!
```

**Result:**
- Optimized bundles (~78KB gzipped)
- Clean URL structure
- Production-ready `dist/` folder

**When to use:**
- ✅ Before deploying
- ✅ Testing production build
- ✅ Creating release

**What's included:**
- Cached obfuscation (automatic)
- Code splitting & minification
- CSS optimization
- Hash stability

**[→ Complete build documentation](../production-build/README.md)**

---

### `npm run build:analyze`

**Purpose:** Build with bundle analysis

**What it does:**
- Everything `npm run build` does
- Opens interactive bundle analyzer

**Shows:**
- 📊 Bundle contents treemap
- 📈 Chunk sizes (raw, gzip, brotli)
- 🔍 Duplicate dependencies
- 💡 Optimization opportunities

**When to use:**
- ✅ Optimizing bundle size
- ✅ Finding large dependencies
- ✅ Detecting duplicate code

**[→ See performance optimization](../production-build/04-performance.md)**

---

### `npm run build:clean`

**Purpose:** Clean build from scratch

**Command:** `rm -rf .vite-cache dist && vite build && node scripts/post-build.js`

**What it does:**
- 🗑️ Deletes `.vite-cache/` directory (includes obfuscation cache)
- 🗑️ Deletes `dist/` directory
- 🔨 Runs full fresh build

**Time:** ~15-22 seconds (no cache)

**When to use:**
- ✅ Troubleshooting cache issues
- ✅ After changing build configuration
- ✅ Clean CI/CD builds
- ✅ When hashes seem inconsistent

**[→ See cache management](../production-build/07-cicd.md#cache-management)**

---

## Page Management

### `npm run create:page`

**Purpose:** Create new MPA page automatically

**Time saved:** 15-30 minutes per page

**[→ Complete guide](./02-CREATE_PAGE.md)**

---

### `npm run delete:page`

**Purpose:** Delete existing page safely

**Time saved:** 10-15 minutes per page

**[→ Complete guide](./03-DELETE_PAGE.md)**

---

## Component Management

### `npm run create:component`

**Purpose:** Create new component with types and tests

**Time saved:** 10-15 minutes per component

**Features:**
- ✅ Interactive or CLI mode
- ✅ Regular or UI component types
- ✅ Automatic TypeScript types
- ✅ Automatic unit test generation
- ✅ Duplicate detection

**[→ Complete guide](./04-CREATE_COMPONENT.md)**

---

### `npm run add:shadcn`

**Purpose:** Add and adapt shadcn/ui components to project structure

**Time saved:** 10-15 minutes per component

**Features:**
- ✅ Wraps `npx shadcn@latest add`
- ✅ Automatic type extraction to separate file
- ✅ CSS module generation (if styles detected)
- ✅ Folder structure reorganization
- ✅ Test file generation
- ✅ Repository selection support (CLI args or interactive)

**[→ Complete guide](./12-ADD_SHADCN_COMPONENT.md)**

---

### `npm run delete:component`

**Purpose:** Delete existing component safely

**Time saved:** 5-10 minutes per component

**Features:**
- ✅ Usage analysis before deletion
- ✅ Cascade deletion of child components
- ✅ Automatic test file cleanup
- ✅ NPM dependency cleanup

**[→ Complete guide](./05-DELETE_COMPONENT.md)**

---

## Analysis Scripts

### `npm run analyze:components`

**Purpose:** Analyze shared components in `src/components/`

**Features:**
- ✅ Component dependency tracking
- ✅ Component relationship mapping
- ✅ Orphan component detection
- ✅ Page usage analysis
- ✅ JSON export support

**[→ Complete guide](./09-ANALYZE_COMPONENTS.md)**

---

### `npm run analyze:pages`

**Purpose:** Analyze pages in `src/pages/`

**Features:**
- ✅ Page dependency tracking
- ✅ Component usage per page
- ✅ UI component tracking
- ✅ JSON export support

**[→ Complete guide](./08-ANALYZE_PAGES.md)**

---

### `npm run analyze:components`

**Purpose:** Analyze all shared components in `src/components/`

**Features:**
- ✅ Component dependency tracking
- ✅ Component-to-component relationships
- ✅ Page usage tracking
- ✅ Orphan component detection
- ✅ JSON export support

**[→ Complete guide](./09-ANALYZE_COMPONENTS.md)**

---

### `npm run analyze:blocks`

**Purpose:** Analyze block components in `src/components/blocks/`

**Features:**
- ✅ Block dependency tracking
- ✅ UI component usage per block
- ✅ Block-to-component relationships
- ✅ Page usage tracking
- ✅ Orphan block detection
- ✅ JSON export support

**[→ Complete guide](./10-ANALYZE_BLOCKS.md)**

---

### `npm run analyze:ui-components`

**Purpose:** Analyze UI components in `src/components/ui/`

**Features:**
- ✅ UI component dependency tracking
- ✅ UI component-to-UI component relationships
- ✅ Block-to-UI component relationships
- ✅ Page usage tracking
- ✅ Orphan UI component detection
- ✅ JSON export support

**[→ Complete guide](./13-ANALYZE_UI_COMPONENTS.md)**

---

### `npm run analyze:deps`

**Purpose:** Analyze NPM dependencies from `package.json`

**Features:**
- ✅ Used/unused dependency detection
- ✅ Usage location tracking
- ✅ Protected dependency identification
- ✅ Cleanup suggestions
- ✅ JSON export support

**[→ Complete guide](./11-ANALYZE_DEPS.md)**

---

---

## Code Quality

### `npm run lint`

**Purpose:** Check code for errors

**Command:** `eslint .`

**Checks:**
- TypeScript ESLint rules
- React Hooks rules
- React Refresh rules
- Custom project rules

**Fix automatically:**
```bash
npx eslint . --fix
```

**When to use:**
- ✅ Before committing
- ✅ In CI/CD pipeline

---

### `npm run type-check`

**Purpose:** Check TypeScript types

**Command:** `tsc --noEmit`

**What it does:**
- Type checking only (no output)
- Validates interfaces and types
- Catches type errors

**Fast:** ~2-5 seconds

**When to use:**
- ✅ Before building
- ✅ In CI/CD
- ✅ After adding code

---

## Preview

### `npm run preview`

**Purpose:** Preview production build

**Command:** `vite preview`

**Prerequisites:**
```bash
npm run build  # Build first
```

**Output:**
```
➜  Local:   http://localhost:8080/
➜  Network: http://192.168.1.x:8080/
```

**When to use:**
- ✅ Testing production build
- ✅ Before deploying
- ✅ QA testing

**Difference from dev:**
- Serves built files (not source)
- Production minification
- No HMR

---

## Performance

| Script | Time | Output |
|--------|------|--------|
| `dev` | ~300ms | Dev server |
| `build` | ~3-5s | Production |
| `build:clean` | ~15-22s | Clean prod |
| `build:analyze` | ~4-6s | Prod + stats |
| `lint` | ~2-3s | Report |
| `type-check` | ~2-5s | Type errors |
| `preview` | ~100ms | Prod server |
| `create:page` | ~10s | New page |
| `delete:page` | ~5s | Remove page |
| `create:component` | ~2s | New component |
| `delete:component` | ~3s | Remove component |

---

## Workflows

### Development
```bash
npm run dev              # Start dev
npm run type-check       # Check types (optional)
npm run lint             # Check code (optional)
```

### Pre-Deployment
```bash
npm run type-check       # 1. Type check
npm run lint             # 2. Lint
npm run build:analyze    # 3. Build & analyze
npm run preview          # 4. Preview
# 5. Deploy if all pass
```

### Adding New Page
```bash
npm run create:page      # 1. Create page
npm run dev              # 2. Test in dev
npm run build            # 3. Build
npm run preview          # 4. Preview
```

### Troubleshooting Build Issues
```bash
npm run build:clean      # 1. Clean everything
npm run build            # 2. Fresh build
npm run preview          # 3. Test
```

### Removing a Page
```bash
npm run delete:page      # 1. Delete page
npm run build            # 2. Rebuild
npm run preview          # 3. Verify removal
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build prod | `npm run build` |
| Clean build | `npm run build:clean` |
| Bundle analyze | `npm run build:analyze` |
| Create page | `npm run create:page` |
| Delete page | `npm run delete:page` |
| Create component | `npm run create:component` |
| Add shadcn component | `npm run add:shadcn button` |
| List registry components | `npm run list:registry` |
| Delete component | `npm run delete:component` |
| Analyze components | `npm run analyze:components` |
| Analyze pages | `npm run analyze:pages` |
| Analyze dependencies | `npm run analyze:deps` |
| Check types | `npm run type-check` |
| Lint | `npm run lint` |
| Preview | `npm run preview` |

---

## Best Practices

### Page Management

✅ **DO:**
- Use kebab-case for page names (`user-profile`, `about-us`)
- Test pages in dev mode before building
- Keep page names short and descriptive
- Delete unused pages to keep project clean

❌ **DON'T:**
- Delete core pages (index, page-not-found)
- Use spaces or special characters in names
- Create pages with the same name as existing pages

### Safety

✅ **Always:**
- Review vite.config.ts after page operations
- Restart dev server after creating/deleting pages
- Commit changes before major page operations
- Test deleted pages don't break navigation

---

## Troubleshooting

### Common Issues

**Script fails to run:**
```bash
# Make scripts executable
chmod +x scripts/*.js

# Or run directly with node
node scripts/create-page.js
```

**vite.config.ts not updated properly:**
- Manually review the file
- Check for syntax errors
- Restart dev server

**Page doesn't appear after creation:**
- Restart dev server (`npm run dev`)
- Check browser console for errors
- Verify vite.config.ts has the entry

**Build cache issues:**
```bash
npm run build:clean  # Clear all caches and rebuild
```

---

## Related Documentation

### 📦 Build & Deployment
- **[01-POST_BUILD.md](./01-POST_BUILD.md)** - Post-build process documentation
- **[obfuscation/](./obfuscation/)** - Cached obfuscation system documentation
- **[production-build/](../production-build/)** - Build process documentation

### 📄 Page Management
- **[02-CREATE_PAGE.md](./02-CREATE_PAGE.md)** - Complete page creation guide
- **[03-DELETE_PAGE.md](./03-DELETE_PAGE.md)** - Complete page deletion guide

### 🧩 Component Management
- **[04-CREATE_COMPONENT.md](./04-CREATE_COMPONENT.md)** - Complete component creation guide
- **[12-ADD_SHADCN_COMPONENT.md](./12-ADD_SHADCN_COMPONENT.md)** - Add & adapt shadcn components guide
- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Complete component deletion guide

### 📊 Analysis & Insights
- **[08-ANALYZE_PAGES.md](./08-ANALYZE_PAGES.md)** - Page analysis guide
- **[09-ANALYZE_COMPONENTS.md](./09-ANALYZE_COMPONENTS.md)** - Shared component analysis guide
- **[11-ANALYZE_DEPS.md](./11-ANALYZE_DEPS.md)** - NPM dependency analysis guide

### Other Resources
- **[performance-optimization-guide/](../performance-optimization-guide/)** - Performance optimization guide

---

**All scripts optimized for speed!** ⚡

**Last Updated:** November 2025
