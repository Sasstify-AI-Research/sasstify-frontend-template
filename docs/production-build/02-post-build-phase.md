# Post-Build Phase (Phase 2)

Directory restructuring and cleanup after Vite build completes.

---

## Overview

**Command:**
```bash
node scripts/post-build.js
```

**Duration:** < 1 second

**Purpose:** Transform nested source structure into flat, production-ready deployment structure

> 📖 **For detailed script documentation, usage examples, and troubleshooting:**  
> → **[scripts/03-POST_BUILD.md](../scripts/03-POST_BUILD.md)** - Complete post-build script guide

---

## Table of Contents

**Quick Navigation** - Jump to the section you need:

### 🔄 Build Pipeline Context
1. [Role in Build Pipeline](#role-in-build-pipeline) - How this phase fits
2. [Process Steps](#process-steps) - What happens
3. [Final Output](#final-directory-structure) - Production structure

### 📂 Technical Details
- [Transformation Logic](#transformation-logic) - How restructuring works
- [Build Output](#build-output) - Console output
- [Performance Impact](#performance-impact) - Script metrics

### 🔗 Next Steps
- [Deployment Compatibility](#deployment-compatibility) - Hosting platforms
- [Related Documentation](#related-documentation) - Additional resources

---

## Role in Build Pipeline

### Build Phase Sequence

```
Phase 1: Vite Build
   ↓
   Outputs to: dist/src/pages/[page]/index.html
   ↓
Phase 2: Post-Build (THIS PHASE)
   ↓
   Restructures to: dist/[page]/index.html
   ↓
Phase 3: Deployment
```

### Why This Phase Exists

**Problem:** Vite preserves source structure in output
```
dist/src/pages/page-not-found/index.html  ❌ (exposes internal structure)
```

**Solution:** Post-build flattens structure
```
dist/page-not-found/index.html  ✅ (clean, production-ready)
```

---

## Process Steps

### Step 1: Directory Flattening

**Objective:** Transform nested source structure into flat deployment structure

**Transformations:**
```
SOURCE                                   DESTINATION
dist/src/pages/index/index.html    →    dist/index.html
dist/src/pages/page-not-found/index.html →   dist/page-not-found/index.html
dist/src/pages/profile/index.html   →   dist/profile/index.html
dist/src/pages/page/index.html      →   dist/page/index.html
```

---

### Step 2: Cleanup Operations

**Removed:**
- `dist/src/` - Temporary nested structure
- `dist/index/` - If exists from alternative configurations

**Preserved:**
- `dist/static/` - All hashed assets (JS, CSS, images)
- `dist/favicon.ico` - Site favicon
- `dist/robots.txt` - SEO configuration
- All page directories (`page-not-found/`, `about/`, etc.)

---

## Transformation Logic

### Implementation Overview

```javascript
// 1. Copy pages from nested to flat structure
dist/src/pages/* → dist/

// 2. Handle special case for index page
dist/src/pages/index/* → dist/

// 3. Clean up temporary directories
rm -rf dist/src/
rm -rf dist/index/

// 4. Static assets remain untouched
dist/static/ (preserved)
```

### URL Normalization

**Before Post-Build:**
```
/src/pages/page-not-found/    ❌ (internal structure exposed)
```

**After Post-Build:**
```
/about/              ✅ (clean, SEO-friendly)
```

**Benefits:**
- Clean URLs for users
- SEO-friendly structure
- Standard hosting compatibility
- No source structure exposure

---

## Final Directory Structure

```
dist/
├── index.html                    # Root page (/)
├── page-not-found/
│   └── index.html               # 404 page (/page-not-found/)
├── profile/
│   └── index.html               # Profile page (/profile/)
├── page/
│   └── index.html               # Example page (/page/)
├── static/
│   ├── css/
│   │   ├── B6JKkzbn.css        # Page-specific styles (hashed)
│   │   ├── Pxgh2O4K.css        # Page-specific styles (hashed)
│   │   └── DSJ3S4vk.css        # Global styles (hashed)
│   └── js/
│       ├── CNkZXMZn.js         # Query vendor (hashed)
│       ├── Dj7pr43P.js         # React vendor (hashed)
│       ├── LIZo4OzT.js         # Main vendor (hashed)
│       ├── BDsDggUV.js         # Main entry (hashed)
│       ├── C3cfMgm3.js         # Dashboard entry (hashed)
│       └── [hash].js           # Additional chunks
├── favicon.ico
└── robots.txt
```

---

## Build Output

**Console Output:**
```
🔨 Starting post-build cleanup...
📦 Copying dist/src/pages/* to dist/...
  ✓ Copying page-not-found/ to dist/page-not-found/
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
  ├── page-not-found/
  │   └── index.html
  └── static/
      ├── css/
      ├── js/
      └── ...
```

---

## MPA Routing Behavior

### Production URLs

Each page is independently accessible:

```
http://example.com/              → dist/index.html
http://example.com/page-not-found/    → dist/page-not-found/index.html
http://example.com/profile/      → dist/profile/index.html
http://example.com/page/         → dist/page/index.html
```

### Server Configuration

**No special configuration needed** for MPA:
- Each page is a separate HTML file
- Direct navigation works out of the box
- Standard static hosting compatible

---

## Performance Impact

**Time:** < 1 second  
**Memory:** < 50 MB  
**Disk I/O:** Minimal (copy + delete operations)

**Metrics:**
- Files copied: 4-6 HTML files
- Directories created: 3-5
- Directories removed: 2
- No impact on asset hashing or caching

**Optimization:**
- Pure file system operations
- No parsing or transformation
- No impact on bundle size
- No runtime performance impact

---

## Deployment Compatibility

### Compatible Hosting Platforms

✅ **Vercel** - Auto-detected MPA, zero configuration  
✅ **Netlify** - Works directly, no redirects needed  
✅ **AWS S3 + CloudFront** - Standard static site configuration  
✅ **GitHub Pages** - Direct deployment  
✅ **Any Static CDN** - Standard HTML/CSS/JS hosting

### Deployment Commands

**Build command:**
```bash
npm run build
```

**Output directory:**
```
dist
```

**That's it!** The post-build script runs automatically as part of `npm run build`.

---

## Integration with Build Pipeline

### Automatic Execution

**In `package.json`:**
```json
{
  "scripts": {
    "build": "vite build && node scripts/post-build.js"
  }
}
```

**Runs automatically** - no manual intervention needed!

### CI/CD Integration

**GitHub Actions / GitLab CI / Any CI:**
```yaml
- name: Build
  run: npm run build
  # Post-build runs automatically after Vite build
```

---

## Related Documentation

### Script Documentation
- **[scripts/03-POST_BUILD.md](../scripts/03-POST_BUILD.md)** - ⭐ **Complete script guide** (usage, customization, troubleshooting)

### Build Pipeline
- **[01-vite-build-phase.md](./01-vite-build-phase.md)** - Previous phase (Vite build)
- **[06-deployment.md](./06-deployment.md)** - Next step (deployment)
- **[07-cicd.md](./07-cicd.md)** - CI/CD integration

### Script Management
- **[scripts/01-CREATE_PAGE.md](../scripts/01-CREATE_PAGE.md)** - Create new pages
- **[scripts/02-DELETE_PAGE.md](../scripts/02-DELETE_PAGE.md)** - Delete pages

---

## Quick Reference

**Need to know:**

| Topic | Resource |
|-------|----------|
| **How to use the script** | → [scripts/03-POST_BUILD.md](../scripts/03-POST_BUILD.md) |
| **Troubleshooting issues** | → [scripts/03-POST_BUILD.md#troubleshooting](../scripts/03-POST_BUILD.md#troubleshooting) |
| **Customize behavior** | → [scripts/03-POST_BUILD.md#customization](../scripts/03-POST_BUILD.md#customization) |
| **Error handling** | → [scripts/03-POST_BUILD.md#error-handling](../scripts/03-POST_BUILD.md#error-handling) |
| **Build pipeline overview** | → [README.md](./README.md) |

---

**Last Updated:** November 2025
