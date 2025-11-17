# Delete Page Script

Complete documentation for the automated page deletion script.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What It Does](#what-it-does)
- [Safety Features](#safety-features)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Script:** `scripts/delete-page.js`

**Command:** `npm run delete:page`

**Purpose:** Safely delete MPA pages with automatic cleanup of all related files and configurations.

**Safety Level:** 🔒 High (multiple confirmations, protected pages, shows preview)

---

## Usage

### Basic Usage

```bash
npm run delete:page
```

### Interactive Prompts

The script will guide you through:

1. **Show Available Pages**
   ```
   📋 Available pages to delete:
      1. profile
      2. page
      3. test-page
   ```

2. **Enter Page Name**
   ```
   ? Page name to delete (kebab-case): profile
   ```

3. **Show What Will Be Deleted**
   ```
   ⚠️  This will DELETE the following:
      📁 src/pages/profile/
         📄 src/pages/profile/index.html
         📄 src/pages/profile/main.tsx
         📄 src/pages/profile/Profile.tsx
         📄 src/pages/profile/Profile.module.css
         📁 src/pages/profile/components/
            📄 src/pages/profile/components/TestComponent.tsx
      ⚙️  vite.config.ts (will be updated)
   ```

4. **First Confirmation**
   ```
   ? Are you sure you want to delete "profile"? (yes/no): yes
   ```

5. **Second Confirmation**
   ```
   ? Type the page name again to confirm: profile
   ```

6. **Deletion Process**
   ```
   🗑️  Deleting page...
   
     ✅ Deleted src/pages/profile/
     ✅ Updated vite.config.ts (removed 2/2 sections)
     ✅ Deleted dist/profile/
   
   ✅ Success! Page deleted!
   ```

---

## What It Does

### 1. Validation

**Checks:**
- ✅ Page exists
- ✅ Page is not the protected index page
- ✅ Page name is valid

**Protected Pages:**
- `index` - Main landing page (cannot be deleted - required for the application)

---

### 2. File System Operations

**Deletes:**
```
src/pages/[page]/          ← Entire directory
├── index.html             ← HTML entry point
├── main.tsx               ← React entry point
├── [Page].tsx             ← Page component
├── [Page].module.css      ← CSS file (if exists)
└── components/            ← Components folder (if exists)
    └── *.tsx              ← All components

dist/[page]/               ← Built assets (if exist)
```

---

### 3. Configuration Updates

**Updates `vite.config.ts`:**

**Removes from `rollupOptions.input`:**
```typescript
// Before
input: {
  main: resolve(__dirname, 'src/pages/index/index.html'),
  dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
  profile: resolve(__dirname, 'src/pages/profile/index.html'),  // ← REMOVED
  page: resolve(__dirname, 'src/pages/page/index.html'),
}

// After
input: {
  main: resolve(__dirname, 'src/pages/index/index.html'),
  dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
  page: resolve(__dirname, 'src/pages/page/index.html'),
}
```

**Removes from `devServerMiddleware`:**
```typescript
// Before
// Profile page
else if (pathname === '/profile' || pathname === '/profile/') {
  req.url = url.replace(pathname, '/src/pages/profile/index.html');
} else if (pathname === '/profile/index.html') {
  req.url = url.replace(pathname, '/src/pages/profile/index.html');
}
// ← ENTIRE BLOCK REMOVED (including comment)

// After
// (block no longer exists)
```

**Note:** The script handles multiline formatting and properly removes the entire middleware block including the comment.

---

## Safety Features

### 1. Protected Pages

**Cannot delete:**
- ✅ `index` - Essential landing page (required for the application)

**Attempting to delete shows:**
```
❌ Cannot delete the index page!
   This page is essential for the application.
```

---

### 2. Double Confirmation

**Step 1: Yes/No**
```
? Are you sure you want to delete "profile"? (yes/no):
```
- Must type exactly "yes" (case-insensitive)
- Any other input cancels deletion

**Step 2: Name Verification**
```
? Type the page name again to confirm:
```
- Must type exact page name
- Prevents accidental deletions

---

### 3. Preview Before Delete

Shows complete file tree:
```
⚠️  This will DELETE the following:
   📁 src/pages/profile/
      📄 src/pages/profile/index.html
      📄 src/pages/profile/main.tsx
      ...
```

---

### 4. Lists Available Pages

Only shows deletable pages:
```
📋 Available pages to delete:
   1. dashboard
   2. profile
   3. page
   4. test-page

(only the index page is protected)
```

---

## Examples

### Example 1: Successful Deletion

```bash
$ npm run delete:page

🗑️  Delete Page from MPA

📋 Available pages to delete:
   1. profile
   2. page
   3. test-page

? Page name to delete (kebab-case): profile

⚠️  This will DELETE the following:
   📁 src/pages/profile/
      📄 src/pages/profile/index.html
      📄 src/pages/profile/main.tsx
      📄 src/pages/profile/Profile.tsx
      📄 src/pages/profile/Profile.module.css
      📁 src/pages/profile/components/
         📄 src/pages/profile/components/ProfileCard.tsx
   ⚙️  vite.config.ts (will be updated)

? Are you sure you want to delete "profile"? (yes/no): yes
? Type the page name again to confirm: profile

🗑️  Deleting page...

  ✅ Deleted src/pages/profile/
  ✅ Updated vite.config.ts (removed 2/2 sections)
  ✅ Deleted dist/profile/

✅ Success! Page deleted!

📝 Next steps:
  1. Review vite.config.ts to ensure proper cleanup
  2. Restart dev server if running (npm run dev)
  3. Rebuild if needed (npm run build)

💡 Tip: You can recreate this page anytime with:
     npm run create:page
```

---

### Example 2: Cancelled Deletion

```bash
$ npm run delete:page

🗑️  Delete Page from MPA

📋 Available pages to delete:
   1. profile
   2. page

? Page name to delete (kebab-case): profile

⚠️  This will DELETE the following:
   📁 src/pages/profile/
   ...

? Are you sure you want to delete "profile"? (yes/no): no

❌ Deletion cancelled.
```

---

### Example 3: Protected Page

```bash
$ npm run delete:page

🗑️  Delete Page from MPA

📋 Available pages to delete:
   1. dashboard
   2. profile
   3. page

? Page name to delete (kebab-case): index

❌ Cannot delete the index page!
   The index page is required for the application.
```

---

### Example 4: Name Mismatch

```bash
$ npm run delete:page

🗑️  Delete Page from MPA

📋 Available pages to delete:
   1. profile
   2. page

? Page name to delete (kebab-case): profile

⚠️  This will DELETE the following:
   📁 src/pages/profile/
   ...

? Are you sure you want to delete "profile"? (yes/no): yes
? Type the page name again to confirm: profil

❌ Page name did not match. Deletion cancelled.
```

---

### Example 5: No Deletable Pages

```bash
$ npm run delete:page

🗑️  Delete Page from MPA

❌ No deletable pages found!
   (only the index page is protected and cannot be deleted)
```

---

## Troubleshooting

### Issue: Script Won't Run

**Error:** `Permission denied`

**Solution:**
```bash
# Make script executable
chmod +x scripts/delete-page.js

# Or run with node directly
node scripts/delete-page.js
```

---

### Issue: vite.config.ts Not Updated

**Symptoms:**
- Page deleted but entry still in vite.config.ts
- Dev server shows errors

**Solution:**
```bash
# Manually edit vite.config.ts
# Remove the page entry from:
# 1. rollupOptions.input
# 2. devServerMiddleware

# Then restart dev server
npm run dev
```

---

### Issue: Page Still Appears After Deletion

**Causes:**
1. Dev server not restarted
2. Browser cache
3. vite.config.ts not updated

**Solutions:**
```bash
# 1. Restart dev server
# Ctrl+C to stop, then
npm run dev

# 2. Hard refresh browser
# Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)

# 3. Rebuild
npm run build
```

---

### Issue: Partial Update Warning

**Message:**
```
⚠️  Partially updated vite.config.ts (removed 1/2 sections)
```

**Meaning:**
- Only part of the config was updated
- Manual cleanup required

**Solution:**
1. Open `vite.config.ts`
2. Check both locations:
   - `rollupOptions.input`
   - `devServerMiddleware`
3. Manually remove remaining references
4. Save and restart dev server

---

## Best Practices

### Before Deleting

✅ **DO:**
- Commit current changes to git
- Check if page is referenced elsewhere
- Test that app works without the page
- Note down page content if you might need it

❌ **DON'T:**
- Delete pages during active development
- Delete without reading the preview
- Skip confirmations by force

---

### After Deleting

✅ **DO:**
- Restart dev server
- Test navigation in app
- Check for broken links
- Review vite.config.ts
- Rebuild and test production

❌ **DON'T:**
- Continue development without restart
- Ignore partial update warnings
- Skip testing

---

## Recovery

### Accidentally Deleted a Page?

**Option 1: Git Recovery (if committed)**
```bash
# See what was deleted
git log --all --full-history -- "src/pages/[page]/"

# Restore from last commit
git checkout HEAD~1 -- src/pages/[page]/

# Manually restore vite.config.ts entries
```

**Option 2: Recreate**
```bash
# Use create:page script
npm run create:page

# Manually add back your custom content
```

---

## Script Details

### File Location
```
scripts/delete-page.js
```

### Dependencies
- `fs` - File system operations
- `path` - Path manipulation
- `readline` - Interactive CLI

### Exit Codes
- `0` - Success or cancelled by user
- `1` - Error occurred

---

## Related Documentation

- **[01-CREATE_PAGE.md](./01-CREATE_PAGE.md)** - Create new pages
- **[03-POST_BUILD.md](./03-POST_BUILD.md)** - Post-build process
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**delete-page.js provides:**
- ✅ Safe page deletion with multiple confirmations
- ✅ Automatic config cleanup
- ✅ Protection for core pages
- ✅ Preview before deletion
- ✅ Complete file tree removal
- ✅ Helpful error messages

**Perfect for:**
- Cleaning up test pages
- Removing unused pages
- Maintaining clean project structure
- Quick iteration during development

---

**Last Updated:** November 2025  
**Script Version:** 1.0.0


