# Post-Build Script

Documentation for the post-build directory restructuring script.

---

## Overview

**Script:** `scripts/post-build.js`  
**Trigger:** Automatic (runs after `vite build`)  
**Purpose:** Transform nested source structure into flat, production-ready deployment structure

---

## When It Runs

The post-build script runs automatically as part of the build process:

```bash
# Runs automatically
npm run build
# → vite build && node scripts/post-build.js
```

**You don't need to run it manually!**

---

## What It Does

### 1. Directory Flattening

**Transforms:**
```
BEFORE (after vite build)          AFTER (post-build)
dist/                               dist/
├── src/                            ├── index.html
│   └── pages/                      ├── dashboard/
│       ├── index/                  │   └── index.html
│       │   └── index.html          ├── profile/
│       ├── dashboard/              │   └── index.html
│       │   └── index.html          ├── page/
│       ├── profile/                │   └── index.html
│       │   └── index.html          └── static/
│       └── page/                       ├── css/
│           └── index.html              └── js/
└── static/
    ├── css/
    └── js/
```

**Result:** Clean URLs like `/dashboard/` instead of `/src/pages/dashboard/`

---

### 2. Operations Performed

**Step 1: Copy Pages**
```javascript
dist/src/pages/index/        → dist/
dist/src/pages/dashboard/    → dist/dashboard/
dist/src/pages/profile/      → dist/profile/
dist/src/pages/page/         → dist/page/
```

**Step 2: Cleanup**
```javascript
rm -rf dist/src/     // Remove nested structure
rm -rf dist/index/   // Remove if exists (legacy)
```

**Step 3: Preserve**
```javascript
dist/static/         // Keep all hashed assets
dist/favicon.ico     // Keep site favicon
dist/robots.txt      // Keep SEO config
```

---

## Console Output

### Successful Run

```bash
🔨 Starting post-build cleanup...
📦 Copying dist/src/pages/* to dist/...
  ✓ Copying dashboard/ to dist/dashboard/
  ✓ Copying index/ to dist/
  ✓ Copying page/ to dist/page/
  ✓ Copying profile/ to dist/profile/
ℹ️  No dist/index/ directory found, skipping...
🗑️  Cleaning up temporary directories...
  ✓ Removing dist/src/
✅ Post-build cleanup complete!

📁 Final structure:
  dist/
  ├── index.html
  ├── dashboard/
  │   └── index.html
  ├── profile/
  │   └── index.html
  ├── page/
  │   └── index.html
  └── static/
      ├── css/
      └── js/
```

---

## URL Mapping

### Development Mode

**Before post-build:**
- Not applicable (dev server handles routing)

**Dev URLs:**
```
http://localhost:8080/              → src/pages/index/index.html
http://localhost:8080/dashboard/    → src/pages/dashboard/index.html
http://localhost:8080/profile/      → src/pages/profile/index.html
```

---

### Production Mode

**After post-build:**

```
https://example.com/              → dist/index.html
https://example.com/dashboard/    → dist/dashboard/index.html
https://example.com/profile/      → dist/profile/index.html
https://example.com/page/         → dist/page/index.html
```

✅ **Clean, user-friendly URLs!**

---

## Why It's Needed

### Problem Without Post-Build

**Vite outputs to:**
```
dist/src/pages/dashboard/index.html
```

**Would require URLs like:**
```
https://example.com/src/pages/dashboard/
```

❌ **Ugly, exposes internal structure**

---

### Solution With Post-Build

**After post-build:**
```
dist/dashboard/index.html
```

**Clean URLs:**
```
https://example.com/dashboard/
```

✅ **Professional, SEO-friendly**

---

## Deployment Compatibility

### Works With All Platforms

✅ **Vercel** - Auto-detected MPA, zero config  
✅ **Netlify** - Works directly, no redirects needed  
✅ **AWS S3 + CloudFront** - Standard static hosting  
✅ **GitHub Pages** - Direct deployment  
✅ **Any Static CDN** - Standard HTML/CSS/JS hosting

**No special server configuration needed!**

---

## Error Handling

### Missing Directories

```bash
ℹ️  No dist/index/ directory found, skipping...
```

**Normal behavior:** Some directories may not exist depending on your pages.

---

### Permission Errors

```bash
❌ Error: EACCES: permission denied
```

**Solution:**
```bash
# Check permissions
ls -la dist/

# Fix permissions
chmod -R 755 dist/
```

---

## Customization

### Script Location

```
scripts/post-build.js
```

### Modify Behavior

**Example: Add custom processing**

```javascript
// In scripts/post-build.js

// After copying pages, add custom logic:
const distDir = path.join(__dirname, '../dist');

// Example: Copy additional files
fs.copySync(
  path.join(__dirname, '../public/sitemap.xml'),
  path.join(distDir, 'sitemap.xml')
);

// Example: Generate custom files
fs.writeFileSync(
  path.join(distDir, '_redirects'),
  '/* /index.html 200'
);
```

---

## Performance

**Typical metrics:**
- Duration: < 1 second
- Files copied: 4-6 HTML files
- Directories created: 3-5
- Directories removed: 2

**No impact on:**
- Asset hashing
- Bundle size
- Runtime performance

---

## Troubleshooting

### Issue: Pages Not Found After Build

**Symptoms:**
- `/dashboard/` returns 404
- Only root page works

**Diagnosis:**
```bash
# Check if post-build ran
ls dist/
# Should see: index.html, dashboard/, profile/, etc.

# If you see: src/
# Post-build didn't run or failed
```

**Solutions:**

1. **Check build script:**
   ```json
   // package.json
   {
     "scripts": {
       "build": "vite build && node scripts/post-build.js"
     }
   }
   ```
   ✅ Make sure `&& node scripts/post-build.js` is present

2. **Run manually:**
   ```bash
   npm run build
   node scripts/post-build.js
   ```

3. **Check for errors:**
   ```bash
   npm run build 2>&1 | tee build.log
   # Review build.log for errors
   ```

---

### Issue: Some Pages Missing

**Symptoms:**
- Some pages work, others don't
- Inconsistent page structure

**Diagnosis:**
```bash
# Check source structure
ls dist/src/pages/

# Check final structure  
ls dist/
```

**Solution:**
- Ensure all pages exist in `src/pages/`
- Verify vite.config.ts has all page entries
- Rebuild: `npm run build:clean`

---

### Issue: Assets Not Loading

**Symptoms:**
- Pages load but no styles/scripts
- Console errors: "Failed to load resource"

**Diagnosis:**
```bash
# Check static assets exist
ls dist/static/css/
ls dist/static/js/
```

**Solution:**
- Static assets should NOT be moved by post-build
- Check vite build completed successfully
- Verify base path in vite.config.ts is `/`

---

## Integration

### With CI/CD

**GitHub Actions:**
```yaml
- name: Build
  run: npm run build
  # Post-build runs automatically
```

**GitLab CI:**
```yaml
build:
  script:
    - npm run build
    # Post-build runs automatically
```

**No extra steps needed!**

---

### With Other Scripts

**Combined commands:**
```bash
# Clean build (includes post-build)
npm run build:clean

# Analyze build (includes post-build)
npm run build:analyze

# Preview build (runs build first)
npm run preview
```

---

## Related Documentation

- **[production-build/02-post-build-phase.md](../production-build/02-post-build-phase.md)** - Build pipeline context and technical flow
- **[01-CREATE_PAGE.md](./01-CREATE_PAGE.md)** - Create pages
- **[02-DELETE_PAGE.md](./02-DELETE_PAGE.md)** - Delete pages

---

## Summary

**post-build.js provides:**
- ✅ Automatic directory restructuring
- ✅ Clean, professional URLs
- ✅ Deployment-ready structure
- ✅ Fast execution (< 1s)
- ✅ Error handling
- ✅ Universal hosting compatibility

**Runs automatically** - no manual intervention needed!

---

**Last Updated:** November 2025  
**Script Version:** 1.0.0


