# Usage Guide

How to use the cached obfuscation system in development and production.

---

## Table of Contents

**Quick Navigation:**

- [Normal Build](#normal-build)
- [Clean Build](#clean-build)
- [Development Mode](#development-mode)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Files Modified](#files-modified)

---

## Normal Build

### Command

```bash
npm run build
```

### What Happens

1. **First Build (No Cache):**
   - Obfuscates all chunks
   - Saves obfuscated output to cache
   - Saves output hashes
   - Build time: ~20s

2. **Subsequent Builds:**
   - Checks cache for each chunk
   - Reuses cached obfuscated code for unchanged files
   - Re-obfuscates only changed files
   - Build time: ~16s (23% faster)

### Example Output

```bash
$ npm run build

> build
> vite build && node scripts/post-build.js

vite v7.0.4 building for production...
transforming...
✓ 1714 modules transformed.

♻️  Reusing cached obfuscated: query-vendor (CNkZXMZn)
♻️  Reusing cached obfuscated: ui-vendor (iKnrhT8c)
♻️  Reusing cached obfuscated: react-vendor (Dj7pr43P)
♻️  Reusing cached obfuscated: vendor (LIZo4OzT)
🔒 Newly obfuscated: main (BDsDggUV)
♻️  Reusing cached obfuscated: dashboard (C3cfMgm3)

rendering chunks...
computing gzip size...

dist/static/css/DSJ3S4vk.css    23.62 kB │ gzip:   4.72 kB
dist/static/js/CNkZXMZn.js        4.71 kB │ gzip:   2.45 kB
dist/static/js/iKnrhT8c.js        8.32 kB │ gzip:   4.12 kB
dist/static/js/Dj7pr43P.js      770.32 kB │ gzip: 315.00 kB
dist/static/js/LIZo4OzT.js      108.52 kB │ gzip:  44.99 kB
dist/static/js/BDsDggUV.js       12.45 kB │ gzip:   5.23 kB

╔═══════════════════════════════════════════════════╗
║       📊 Obfuscation Cache Statistics            ║
╚═══════════════════════════════════════════════════╝
   Cached & reused:  13 chunks
   Newly obfuscated: 1 chunk
   Total chunks:     14
   Cache hit rate:   93%
═════════════════════════════════════════════════════

✓ built in 16.54s

🔨 Starting post-build cleanup...
📦 Copying dist/src/pages/* to dist/...
  ✓ Copying index/ to dist/
  ✓ Copying dashboard/ to dist/dashboard/
✅ Post-build cleanup complete!
```

### When to Use

✅ **Use for:**
- Regular production builds
- CI/CD pipelines
- Deployment builds
- Development testing

---

## Clean Build

### Command

```bash
npm run build:clean
```

### What It Does

```bash
# Removes cache and dist, then rebuilds
rm -rf dist .vite-cache && npm run build
```

### When to Use

✅ **Use when:**
- Cache is corrupted
- Getting unexpected results
- Obfuscation settings changed
- Want to verify fresh build
- Testing build process

❌ **Don't use for:**
- Regular builds (slower)
- CI/CD (cache is beneficial)
- Production deployments (use normal build)

### Example

```bash
$ npm run build:clean

Removing dist and cache...
Building from scratch...

vite v7.0.4 building for production...
transforming...
✓ 1714 modules transformed.

🔒 Newly obfuscated: query-vendor (CNkZXMZn)
🔒 Newly obfuscated: ui-vendor (iKnrhT8c)
🔒 Newly obfuscated: react-vendor (Dj7pr43P)
... (all 14 chunks)

╔═══════════════════════════════════════════════════╗
║       📊 Obfuscation Cache Statistics            ║
╚═══════════════════════════════════════════════════╝
   Cached & reused:  0 chunks
   Newly obfuscated: 14 chunks
   Cache hit rate:   0%
═════════════════════════════════════════════════════

✅ Saved obfuscation cache: 14 chunks (4543 KB)

✓ built in 20.72s
```

---

## Development Mode

### Command

```bash
npm run dev
```

### What Happens

**Obfuscation is DISABLED in development mode:**
- Faster hot reload
- Easier debugging
- Readable error messages
- No caching overhead

### Why No Obfuscation in Dev?

**Development priorities:**
- ⚡ Fast feedback loop
- 🐛 Easy debugging
- 📊 Readable stack traces
- 🔄 Quick iterations

**Production priorities:**
- 🔐 Code protection
- 🗜️ Size optimization
- 📦 Asset caching

### Configuration

```typescript
// vite.config.ts
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    react(),
    // Only obfuscate in production
    ...(isProduction ? [cachedObfuscation({ ... })] : [])
  ]
});
```

---

## CI/CD Integration

### GitHub Actions

#### Option 1: Without Cache (Simple)

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Deploy
        run: npm run deploy
```

**Result:** Each build starts fresh (~20s)

---

#### Option 2: With Cache (Optimal)

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      # Cache obfuscation
      - name: Cache obfuscation
        uses: actions/cache@v3
        with:
          path: .vite-cache
          key: ${{ runner.os }}-obfuscation-${{ hashFiles('**/*.{ts,tsx,js,jsx}') }}
          restore-keys: |
            ${{ runner.os }}-obfuscation-
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Deploy
        run: npm run deploy
```

**Result:** Cached builds are faster (~16s)

**See:** [CI/CD Cache Management](../production-build/07-cicd.md#cache-management)

---

### GitLab CI/CD

```yaml
stages:
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/
    - .vite-cache/

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy:
  stage: deploy
  script:
    - npm run deploy
  only:
    - main
```

---

### CircleCI

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-deps-{{ checksum "package-lock.json" }}
            - v1-obfuscation-{{ checksum "src/**" }}
      - run: npm ci
      - run: npm run build
      - save_cache:
          key: v1-obfuscation-{{ checksum "src/**" }}
          paths:
            - .vite-cache
      - persist_to_workspace:
          root: .
          paths:
            - dist

workflows:
  build_and_deploy:
    jobs:
      - build
```

---

## Troubleshooting

### Cache Not Working

**Symptoms:**
- Every build shows "Newly obfuscated" for all chunks
- Build always takes ~20s
- No "Reusing cached" messages

**Solutions:**

1. **Check cache exists:**
   ```bash
   ls -la .vite-cache/
   # Should see: obfuscation-cache.json
   ```

2. **Check cache file:**
   ```bash
   cat .vite-cache/obfuscation-cache.json | head -20
   # Should see valid JSON
   ```

3. **Rebuild cache:**
   ```bash
   npm run build:clean
   npm run build  # Should now use cache
   ```

---

### Hashes Changing Every Build

**Symptoms:**
- Same code produces different hashes
- Cache hit rate is 100% but hashes still change

**Causes:**
- Cache corrupted
- Source files being modified by build process
- Obfuscation settings changed

**Solutions:**

1. **Clear cache and rebuild:**
   ```bash
   npm run build:clean
   ```

2. **Check for file modifications:**
   ```bash
   git status  # Should show no changes
   ```

3. **Verify cache working:**
   ```bash
   npm run build
   npm run build
   # Second build should show "Reusing cached" with SAME hashes
   ```

---

### Build Fails After Obfuscation

**Symptoms:**
- Build completes but app doesn't work
- Console errors in production
- White screen

**Common causes:**

1. **Dynamic imports broken:**
   ```typescript
   // Check reservedStrings in vite.config.ts
   reservedStrings: [
     '@/',
     'components',
     'pages',
     // Add your patterns here
   ]
   ```

2. **Obfuscation too aggressive:**
   ```typescript
   // Reduce thresholds
   controlFlowFlatteningThreshold: 0.5,  // From 0.75
   deadCodeInjectionThreshold: 0.2,      // From 0.4
   ```

3. **Code uses eval or Function:**
   ```javascript
   // Avoid these (obfuscation breaks them)
   eval('code');
   new Function('code');
   ```

---

### Cache Too Large

**Symptoms:**
- `.vite-cache/obfuscation-cache.json` > 10 MB
- Slow cache read/write

**Solutions:**

1. **Clean and rebuild:**
   ```bash
   npm run build:clean
   ```

2. **Check project size:**
   ```bash
   # Cache should be ~4-5 MB for typical project
   du -sh .vite-cache/
   ```

---

### CI/CD Cache Not Restored

**Symptoms:**
- CI builds always show 0% cache hit rate
- "Cache not found" in CI logs

**Solutions:**

1. **Check cache key:**
   ```yaml
   # Ensure key includes source file hashes
   key: ${{ runner.os }}-obfuscation-${{ hashFiles('**/*.{ts,tsx}') }}
   ```

2. **Check restore-keys:**
   ```yaml
   restore-keys: |
     ${{ runner.os }}-obfuscation-
   ```

3. **Verify cache step runs before build:**
   ```yaml
   - name: Cache obfuscation  # ← Before build
   - name: Build              # ← After cache
   ```

---

## Files Modified

### Project Files Changed

**New Files:**
1. ✅ `scripts/obfuscation-cache.js` (~200 lines)
2. ✅ `scripts/cached-obfuscation-plugin.js` (~180 lines)

**Modified Files:**
3. ✅ `vite.config.ts` - Use `cachedObfuscation()` instead of `JavaScriptObfuscator()`
4. ✅ `.gitignore` - Added `.vite-cache/`
5. ✅ `package.json` - Added `build:clean` script

---

### Generated Files (Git-Ignored)

**Cache:**
- `.vite-cache/obfuscation-cache.json` (~4-5 MB)

**Build output:**
- `dist/` - Production build

---

### What to Commit

✅ **Commit:**
- `scripts/obfuscation-cache.js`
- `scripts/cached-obfuscation-plugin.js`
- `vite.config.ts`
- `.gitignore`
- `package.json`

❌ **Don't Commit:**
- `.vite-cache/` (ignored by Git)
- `dist/` (ignored by Git)

---

## Quick Reference

### Common Commands

```bash
# Regular build (uses cache)
npm run build

# Clean build (no cache)
npm run build:clean

# Development mode (no obfuscation)
npm run dev

# Check cache
ls -la .vite-cache/

# Clear cache manually
rm -rf .vite-cache

# Test production build locally
npm run preview
```

---

### Cache Locations

| File | Path | Size | Purpose |
|------|------|------|---------|
| Cache | `.vite-cache/obfuscation-cache.json` | ~4-5 MB | Stores obfuscated code |
| Build | `dist/` | ~1 MB | Production output |

---

### Build Times

| Scenario | Time | Cache Hit |
|----------|------|-----------|
| First build | ~20s | 0% |
| Rebuild (no changes) | ~16s | 100% |
| 1 file changed | ~16.5s | 93% |
| 3 files changed | ~17s | 86% |

---

## Next Steps

### Learn More

- **[Overview](./01-overview.md)** - Why we built this
- **[Implementation](./02-implementation.md)** - How it works
- **[Cache Structure](./03-cache-structure.md)** - Cache format
- **[Performance](./04-performance.md)** - Performance metrics
- **[Security](./05-security.md)** - Security features

### Get Help

**Issues:**
- Check [Troubleshooting](#troubleshooting) section
- Review [CI/CD Cache Management](../production-build/07-cicd.md#cache-management)
- Open GitHub issue with build logs

---

## Summary

**Simple to use:**
- ✅ `npm run build` - Just works!
- ✅ Cache automatic
- ✅ No configuration needed

**Easy to debug:**
- ✅ Clear log messages
- ✅ Cache statistics
- ✅ `build:clean` for fresh start

**CI/CD ready:**
- ✅ Works without cache (simple)
- ✅ Works with cache (optimal)
- ✅ All major platforms supported

---

**Status:** ✅ **PRODUCTION READY**  
**Last Updated:** November 2025


