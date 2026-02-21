# Delete Page Script

Complete documentation for the automated page deletion script.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
  - [Interactive Mode](#interactive-mode)
  - [CLI Mode](#cli-mode)
- [CLI Arguments](#cli-arguments)
- [What It Does](#what-it-does)
- [Safety Features](#safety-features)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Script:** `scripts/delete-page.js`

**Command:** `npm run delete:page`

**Purpose:** Safely delete MPA pages with automatic cleanup of all related files, configurations, exclusive components, and unused npm dependencies.

**Safety Level:** 🔒 High (multiple confirmations, protected pages, shows preview)

---

## Usage

### Interactive Mode

```bash
npm run delete:page
```

The script will guide you through:

1. **Show Available Pages**
   ```
   📋 Available pages to delete:
      1. demo-dashboard
      2. page-not-found
   ```

2. **Enter Page Name**
   ```
   ? Page name to delete (kebab-case): demo-dashboard
   ```

3. **Show Dependency Analysis**
   ```
   🔍 Analyzing dependencies...

   - Dependencies Used:
     • chart.js (safe to delete)
     • dayjs (used elsewhere)
     • framer-motion (safe to delete)
     • lucide-react (protected)
     • react (protected)

   - Components Used:
     • activity-feed (safe to delete)
     • layout (used elsewhere)
     • ui/progress-ring (safe to delete)
   ```

4. **Confirmation & Deletion**
   ```
   ? Are you sure you want to delete "demo-dashboard"? (yes/no): yes
   ? Type the page name again to confirm: demo-dashboard
   ```

---

### CLI Mode

For automation and scripting, use CLI arguments:

```bash
# Delete with all confirmations skipped
npm run delete:page -- --name=demo-dashboard --yes

# Delete with dependency cleanup
npm run delete:page -- --name=demo-dashboard --deps --yes

# Delete with cascade component cleanup
npm run delete:page -- --name=demo-dashboard --cascade --yes

# Delete with both cascade and deps cleanup
npm run delete:page -- --name=demo-dashboard --cascade --deps --yes
```

---

## CLI Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `--name=<page>` | Page name to delete (kebab-case) | - |
| `--deps` | Uninstall unused npm dependencies after deletion | `false` |
| `--cascade` | Delete components that become unused after page deletion | `false` |
| `--yes` | Skip all confirmation prompts | `false` |
| `--help` | Show help message | - |

### Argument Details

#### `--name=<page>`
Specifies the page to delete. Must be in kebab-case format.

```bash
npm run delete:page -- --name=demo-dashboard
```

#### `--deps`
When enabled, the script will:
1. Analyze npm dependencies used by the page and its components
2. Identify dependencies not used by other pages/components
3. Automatically run `npm uninstall` for unused dependencies

```bash
npm run delete:page -- --name=demo-dashboard --deps --yes
```

**Output:**
```
📦 Unused dependencies found:
  • chart.js
  • react-chartjs-2
  • uuid

🗑️  Uninstalling dependencies...
✅ Successfully uninstalled dependencies!
```

#### `--cascade`
When enabled, the script will:
1. Find shared components used **only** by this page
2. Delete those components along with the page
3. Recursively find cascade components (components only used by deleted components)

```bash
npm run delete:page -- --name=demo-dashboard --cascade --yes
```

**Output:**
```
🧹 Removing unused shared components...
  ✅ Deleted component activity-feed
  ✅ Deleted component ui/progress-ring

🔄 Checking for cascade components...
  ✅ Deleted cascade component date-formatter
```

#### `--yes`
Skips all interactive confirmation prompts. **Use with caution!**

```bash
npm run delete:page -- --name=demo-dashboard --yes
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

### 2. Dependency Analysis

The script analyzes:

| Category | Analysis |
|----------|----------|
| **Page Dependencies** | NPM packages imported directly in page files |
| **Component Dependencies** | NPM packages used by page's components |
| **Shared Components** | Components from `src/components/` used by the page |
| **Page Sub-Components** | Components in `src/pages/[page]/components/` |

**Dependency Classification:**
- 🔴 **Safe to delete** - Only used by this page
- 🔵 **Used elsewhere** - Used by other pages/components
- 🟡 **Protected** - Core dependencies (react, react-dom, etc.)

---

### 3. File System Operations

**Deletes:**
```
src/pages/[page]/          ← Entire directory
├── index.html             ← HTML entry point
├── main.tsx               ← React entry point
├── [Page].tsx             ← Page component
├── [Page].module.css      ← CSS file (if exists)
└── components/            ← Page sub-components folder (if exists)
    └── *.tsx              ← All sub-components

tests/e2e/[page].spec.ts   ← E2E test file (if exists)

tests/unit/pages/[page]/   ← Page sub-component unit tests (if exist)
└── *.test.tsx             ← All sub-component tests

dist/[page]/               ← Built assets (if exist)
```

**With `--cascade` flag, also deletes:**
```
src/components/[component]/     ← Exclusive shared components
tests/unit/components/[component].test.tsx  ← Component unit tests
```

---

### 4. Configuration Updates

**Updates `vite.config.ts`:**

**Removes from `rollupOptions.input`:**
```typescript
// Before
input: {
  main: resolve(__dirname, 'src/pages/index/index.html'),
  'demo-dashboard': resolve(__dirname, 'src/pages/demo-dashboard/index.html'),  // ← REMOVED
  page: resolve(__dirname, 'src/pages/page/index.html'),
}

// After
input: {
  main: resolve(__dirname, 'src/pages/index/index.html'),
  page: resolve(__dirname, 'src/pages/page/index.html'),
}
```

**Removes from `devServerMiddleware`:**
```typescript
// Before
// Demo Dashboard page
else if (pathname === '/demo-dashboard' || pathname === '/demo-dashboard/') {
  req.url = url.replace(pathname, '/src/pages/demo-dashboard/index.html');
} else if (pathname === '/demo-dashboard/index.html') {
  req.url = url.replace(pathname, '/src/pages/demo-dashboard/index.html');
}
// ← ENTIRE BLOCK REMOVED (including comment)
```

---

### 5. NPM Dependency Cleanup (with `--deps`)

**Process:**
1. Identify all npm dependencies used by the page
2. Check each dependency against other pages and components
3. Build list of "safe to delete" dependencies
4. Run `npm uninstall` for unused packages

**Protected Dependencies (never deleted):**
- `react`, `react-dom`
- `@tanstack/react-query`
- `lucide-react`
- `tailwindcss`, `autoprefixer`, `postcss`
- `vite`, `typescript`
- All `@types/*` packages
- All `eslint*` packages

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

### 2. Double Confirmation (Interactive Mode)

**Step 1: Yes/No**
```
? Are you sure you want to delete "demo-dashboard"? (yes/no):
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

Shows complete analysis:
```
🔍 Analyzing dependencies...

   ⚙️  vite.config.ts (will be updated)

- Dependencies Used:
  • chart.js (safe to delete)
  • dayjs (used elsewhere)
  • lucide-react (protected)

- Components Used:
  • activity-feed (safe to delete)
  • layout (used elsewhere)
```

---

### 4. Lists Available Pages

Only shows deletable pages:
```
📋 Available pages to delete:
   1. demo-dashboard
   2. page-not-found

(only the index page is protected)
```

---

## Examples

### Example 1: Interactive Deletion with Dependency Cleanup

```bash
$ npm run delete:page

🗑️  Delete Page from MPA

📋 Available pages to delete:
   1. demo-dashboard
   2. page-not-found

? Page name to delete (kebab-case): demo-dashboard

🔍 Analyzing dependencies...

- Dependencies Used:
  • chart.js (safe to delete)
  • dayjs (safe to delete)
  • framer-motion (safe to delete)
  • lucide-react (protected)
  • react (protected)
  • react-chartjs-2 (safe to delete)
  • uuid (safe to delete)

- Components Used:
  • activity-feed (safe to delete)
  • footer (used elsewhere)
  • header (used elsewhere)
  • layout (used elsewhere)
  • ui/progress-ring (safe to delete)

? Are you sure you want to delete "demo-dashboard"? (yes/no): yes
? Type the page name again to confirm: demo-dashboard

🗑️  Deleting page...

  ✅ Deleted src/pages/demo-dashboard/
  ✅ Updated vite.config.ts (removed 2/2 sections)
  ✅ Deleted tests/e2e/demo-dashboard.spec.ts
  ✅ Deleted tests/unit/pages/demo-dashboard/ (page sub-component tests)

🧹 Removing unused shared components...
  ✅ Deleted component activity-feed
  ✅ Deleted component ui/progress-ring

✅ Success! Page deleted!

📦 Unused dependencies found:
  • chart.js
  • react-chartjs-2
  • uuid
  • dayjs
  • framer-motion

🗑️  Uninstalling dependencies...
✅ Successfully uninstalled dependencies!

📝 Next steps:
  1. Restart dev server if running (npm run dev)
  2. Rebuild if needed (npm run build)
```

---

### Example 2: CLI Mode - Full Cleanup

```bash
$ npm run delete:page -- --name=demo-dashboard --cascade --deps --yes

🗑️  Delete Page from MPA

🔍 Analyzing dependencies...

   ⚙️  vite.config.ts (will be updated)

- Dependencies Used:
  • chart.js (safe to delete)
  • dayjs (safe to delete)
  • lucide-react (protected)

- Components Used:
  • activity-feed (safe to delete)
  • layout (used elsewhere)

🗑️  Deleting page...

  ✅ Deleted src/pages/demo-dashboard/
  ✅ Updated vite.config.ts (removed 2/2 sections)
  ✅ Deleted tests/e2e/demo-dashboard.spec.ts
  ✅ Deleted tests/unit/pages/demo-dashboard/ (page sub-component tests)

🧹 Removing unused shared components...
  ✅ Deleted component activity-feed

📦 Unused dependencies found:
  • chart.js
  • dayjs

🗑️  Uninstalling dependencies...
✅ Successfully uninstalled dependencies!

✅ Success! Page deleted!
```

---

### Example 3: CLI Mode - Page Only (No Cleanup)

```bash
$ npm run delete:page -- --name=demo-dashboard --yes

🗑️  Delete Page from MPA

🔍 Analyzing dependencies...

🗑️  Deleting page...

  ✅ Deleted src/pages/demo-dashboard/
  ✅ Updated vite.config.ts (removed 2/2 sections)
  ✅ Deleted tests/e2e/demo-dashboard.spec.ts

✅ Success! Page deleted!

📝 Next steps:
  1. Restart dev server if running (npm run dev)
```

---

### Example 4: Protected Page Error

```bash
$ npm run delete:page -- --name=index --yes

🗑️  Delete Page from MPA

❌ Cannot delete the index page!
   The index page is required for the application.
```

---

### Example 5: Page Not Found

```bash
$ npm run delete:page -- --name=nonexistent --yes

🗑️  Delete Page from MPA

❌ Page "nonexistent" not found!
   Available pages: demo-dashboard, page-not-found
```

---

### Example 6: Show Help

```bash
$ npm run delete:page -- --help

🗑️  Delete Page from MPA

Usage: node scripts/delete-page.js [options]

Options:
  --name=<page>   Page name to delete (kebab-case)
  --deps          Uninstall unused npm dependencies
  --cascade       Delete components exclusive to this page
  --yes           Skip confirmation prompts
  --help          Show this help message

Examples:
  npm run delete:page                              # Interactive mode
  npm run delete:page -- --name=my-page --yes     # CLI mode, skip prompts
  npm run delete:page -- --name=my-page --deps    # With dependency cleanup
  npm run delete:page -- --name=my-page --cascade --deps --yes  # Full cleanup
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

### Issue: Dependencies Not Uninstalled

**Symptoms:**
- `--deps` flag used but packages still in package.json

**Causes:**
1. Dependencies are used by other pages/components
2. Dependencies are protected
3. npm uninstall failed

**Solution:**
```bash
# Check what's using the dependency
npm run analyze

# Manually uninstall if needed
npm uninstall <package-name>
```

---

### Issue: Component Still Exists After Deletion

**Symptoms:**
- `--cascade` flag used but component not deleted

**Causes:**
1. Component is used by other pages
2. Component is used by other components

**Solution:**
```bash
# Check component usage
npm run analyze

# Use delete:component for manual cleanup
npm run delete:component -- --name=component-name --yes
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
- Run `npm run analyze` to check dependencies
- Check if page components are used elsewhere
- Note down page content if you might need it

❌ **DON'T:**
- Delete pages during active development
- Delete without reading the preview
- Use `--yes` without understanding what will be deleted

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

# Also restore components if needed
git checkout HEAD~1 -- src/components/[component]/

# Manually restore vite.config.ts entries
```

**Option 2: Recreate**
```bash
# Use create:page script
npm run create:page

# Manually add back your custom content
```

**Option 3: Reinstall Dependencies**
```bash
# If dependencies were uninstalled
npm install <package-name>
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
- `child_process` - npm uninstall execution
- `./analyze-components.js` - Dependency analysis
- `./delete-component.js` - Shared deletion functions

### Exit Codes
- `0` - Success or cancelled by user
- `1` - Error occurred

---

## Related Documentation

- **[02-CREATE_PAGE.md](./02-CREATE_PAGE.md)** - Create new pages
- **[01-POST_BUILD.md](./01-POST_BUILD.md)** - Post-build process
- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Delete components
- **[04-CREATE_COMPONENT.md](./04-CREATE_COMPONENT.md)** - Create components
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**delete-page.js provides:**
- ✅ Safe page deletion with multiple confirmations
- ✅ Automatic config cleanup (vite.config.ts)
- ✅ E2E test cleanup
- ✅ Page sub-component unit test cleanup
- ✅ Cascade component deletion (`--cascade`)
- ✅ NPM dependency cleanup (`--deps`)
- ✅ CLI mode for automation (`--name`, `--yes`)
- ✅ Protection for core pages
- ✅ Preview before deletion
- ✅ Complete file tree removal
- ✅ Helpful error messages

**Perfect for:**
- Cleaning up test pages
- Removing unused pages with full cleanup
- CI/CD automation
- Maintaining clean project structure
- Quick iteration during development

---

**Last Updated:** November 2025  
**Script Version:** 2.0.0
