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
  "lint": "eslint .",
  "type-check": "tsc --noEmit",
  "preview": "vite preview"
}
```

---

## Quick Navigation

| Script | Purpose | Documentation |
|--------|---------|---------------|
| [create-page.js](#npm-run-createpage) | Create new MPA page | [Complete Guide →](./01-CREATE_PAGE.md) |
| [delete-page.js](#npm-run-deletepage) | Delete existing MPA page | [Complete Guide →](./02-DELETE_PAGE.md) |
| [post-build.js](./03-POST_BUILD.md) | Post-build directory restructuring | (runs automatically) |
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

**[→ Complete guide](./01-CREATE_PAGE.md)**

---

### `npm run delete:page`

**Purpose:** Delete existing page safely

**Time saved:** 10-15 minutes per page

**[→ Complete guide](./02-DELETE_PAGE.md)**

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
| Analyze | `npm run build:analyze` |
| Create page | `npm run create:page` |
| Delete page | `npm run delete:page` |
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
- Delete core pages (index, dashboard)
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

- **[01-CREATE_PAGE.md](./01-CREATE_PAGE.md)** - Complete page creation guide
- **[02-DELETE_PAGE.md](./02-DELETE_PAGE.md)** - Complete page deletion guide
- **[03-POST_BUILD.md](./03-POST_BUILD.md)** - Post-build process documentation
- **[obfuscation/](./obfuscation/)** - Cached obfuscation system documentation
- **[production-build/](../production-build/)** - Build process documentation
- **[performance-optimization-guide/](../performance-optimization-guide/)** - Performance optimization guide

---

**All scripts optimized for speed!** ⚡

**Last Updated:** November 2025
