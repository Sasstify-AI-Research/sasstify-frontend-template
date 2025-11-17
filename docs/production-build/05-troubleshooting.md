# Build Troubleshooting

Common build issues and their solutions.

---

## Table of Contents

**Quick Navigation** - Jump to the section you need:

### 🚨 Build Issues
- [Build Failures](#build-failures) - TypeScript errors, OOM, slow builds
- [Obfuscation Issues](#obfuscation-issues) - Breaking builds, too aggressive
- [Asset Issues](#asset-issues) - 404s, missing CSS

### 🔍 Debugging
- [Hash Stability Issues](#hash-stability-issues) - Changing hashes
- [Post-Build Issues](#post-build-issues) - Pages not found
- [Development vs Production Differences](#development-vs-production-differences) - Env-specific issues

### 🔧 System Issues
- [Cache Issues](#cache-issues) - Corrupted cache, browser cache
- [Dependency Issues](#dependency-issues) - Module not found, version conflicts
- [Diagnostic Commands](#diagnostic-commands) - Check environment & analyze

### 💬 Support
- [Getting Help](#getting-help) - What to provide when asking for help

### 🔗 Next Steps
- [Related Documentation](#related-documentation) - Additional resources

---

## Build Failures

### TypeScript Errors

**Issue:** Build fails with type errors

**Solution:**
```bash
# Check types separately
npm run type-check

# Fix errors or add @ts-ignore if needed
// @ts-ignore - TODO: Fix this type
```

**Note:** Vite build doesn't fail on type errors by design. Run `type-check` separately.

---

### Out of Memory

**Issue:** `FATAL ERROR: Reached heap limit`

**Solution:**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

Or in `package.json`:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build && node scripts/post-build.js"
  }
}
```

---

### Slow Builds

**Issue:** Build takes > 30 seconds

**Causes & Solutions:**

**1. First Build (Expected)**
- First build obfuscates all code
- Expected time: 20-25s
- Solution: Normal behavior

**2. Cache Not Working**
```bash
# Check cache exists
ls -la .vite-cache/

# If missing, rebuild will create it
npm run build
```

**3. Too Many Files Changed**
- Many changes require re-obfuscation
- Expected behavior
- Solution: Use incremental development

---

## Obfuscation Issues

### Build Breaking After Obfuscation

**Issue:** App works in dev but breaks in production

**Causes:**

**1. Dynamic Imports Broken**
```typescript
// Check reserved strings in vite.config.ts
reservedStrings: [
  '@/',      // Path alias
  'components',
  'pages',
]
```

**2. String References Obfuscated**
```typescript
// Add to reservedStrings
'your-dynamic-string',
```

**3. Eval or Function Constructor**
- Obfuscation breaks dynamic code
- Solution: Avoid eval, use alternative approaches

---

### Obfuscation Too Aggressive

**Issue:** Runtime errors in production

**Solution:** Adjust settings in `vite.config.ts`:
```typescript
cachedObfuscation({
  controlFlowFlatteningThreshold: 0.5,  // Reduce from 0.75
  deadCodeInjectionThreshold: 0.2,      // Reduce from 0.4
  // ... other settings
})
```

---

## Asset Issues

### Assets Not Found (404)

**Issue:** Images, fonts, or other assets return 404

**Causes & Solutions:**

**1. Incorrect Import**
```typescript
// ❌ Wrong
<img src="./image.png" />

// ✅ Correct
import image from './image.png';
<img src={image} />
```

**2. Missing from Public**
```bash
# Assets in public/ are served as-is
public/
├── favicon.ico     ✅ Accessible as /favicon.ico
└── robots.txt      ✅ Accessible as /robots.txt
```

**3. Wrong Base Path**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // Ensure this matches deployment
});
```

---

### CSS Not Applied

**Issue:** Styles missing in production

**Causes:**

**1. CSS Module Scope**
```typescript
// ❌ Wrong - class not scoped
<div className="button" />

// ✅ Correct - import CSS module
import styles from './Button.module.css';
<div className={styles.button} />
```

**2. Tailwind Purging**
```typescript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Ensure all files included
  ],
}
```

---

## Hash Stability Issues

### Hashes Change Every Build

**Issue:** Asset hashes change even when code unchanged

**Diagnosis:**
```bash
# Build twice and compare hashes
npm run build
ls dist/static/js/*.js  # Note hashes

npm run build
ls dist/static/js/*.js  # Compare hashes
```

**Causes & Solutions:**

**1. Dynamic Values in Code**
```typescript
// ❌ Don't inject timestamps
define: {
  __BUILD_TIME__: new Date().toISOString()  // Changes every build
}

// ✅ Use version instead
define: {
  __APP_VERSION__: process.env.npm_package_version
}
```

**2. Obfuscation Randomness**
- Cached obfuscation solves this
- Ensure `.vite-cache/` exists
- Check obfuscation stats in build output

**3. Source File Modifications**
```bash
# Check git status
git status

# Ensure no uncommitted changes
```

---

## Post-Build Issues

### Pages Not Found

**Issue:** `/dashboard/` returns 404

**Causes:**

**1. Post-Build Script Not Running**
```json
// package.json - ensure && is present
{
  "scripts": {
    "build": "vite build && node scripts/post-build.js"
  }
}
```

**2. Script Failure**
```bash
# Run script manually to see errors
node scripts/post-build.js
```

**3. Incorrect Dist Structure**
```bash
# Check dist structure
ls -R dist/

# Should have:
# dist/index.html
# dist/dashboard/index.html
```

---

## Development vs Production Differences

### Works in Dev, Fails in Production

**Common Causes:**

**1. Environment Variables**
```typescript
// Check env variables
console.log(import.meta.env);

// Ensure variables defined in production
```

**2. Lazy Loading Issues**
```typescript
// Add error boundary
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

**3. API Endpoints**
```typescript
// Use environment-specific URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## Cache Issues

### Build Cache Corrupted

**Issue:** Unexpected build behavior

**Solution:**
```bash
# Clear all caches
npm run build:clean

# Or manually
rm -rf .vite-cache dist node_modules/.vite
npm run build
```

---

### Browser Cache Not Clearing

**Issue:** Old version still loading

**Solutions:**

**1. Hard Refresh**
- Chrome: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Firefox: Ctrl+Shift+R
- Safari: Cmd+Option+R

**2. Clear Site Data**
- Chrome DevTools → Application → Clear Storage

**3. Verify Hash Changed**
```bash
# Check JS hash in HTML
cat dist/index.html | grep -o 'static/js/[^"]*'
```

---

## Dependency Issues

### Module Not Found

**Issue:** `Cannot find module 'xyz'`

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or
npm ci  # Clean install
```

---

### Version Conflicts

**Issue:** Peer dependency warnings

**Solution:**
```bash
# Check for conflicts
npm ls

# Update dependencies
npm update

# Or use --legacy-peer-deps
npm install --legacy-peer-deps
```

---

## Diagnostic Commands

### Check Build Environment

```bash
# Node version
node --version  # Should be 18+

# npm version
npm --version

# Check disk space
df -h

# Check memory
free -m  # Linux
vm_stat  # Mac
```

### Analyze Build

```bash
# Detailed build output
npm run build -- --debug

# Bundle analysis
npm run build:analyze

# Check types
npm run type-check

# Lint code
npm run lint
```

---

## Getting Help

### Information to Provide

When asking for help, include:

1. **Error Message** - Full error output
2. **Build Command** - Exact command used
3. **Environment**
   ```bash
   node --version
   npm --version
   cat package.json | grep "vite"
   ```
4. **Steps to Reproduce** - How to trigger the issue
5. **Expected vs Actual** - What should happen vs what happens

### Useful Logs

```bash
# Verbose build output
npm run build -- --debug > build.log 2>&1

# Share build.log for analysis
```

---

## Related Documentation

- **[Vite Build Phase](./vite-build-phase.md)** - Build process details
- **[Configuration](./configuration.md)** - Config reference
- **[Obfuscation Documentation](../scripts/obfuscation/README.md)** - Obfuscation issues

---

**Last Updated:** November 2025
