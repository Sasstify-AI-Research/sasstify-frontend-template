# Analyze Dependencies Script

Complete documentation for the NPM dependency analysis script.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What It Analyzes](#what-it-analyzes)
- [Console Output](#console-output)
- [JSON Output](#json-output)
- [Key Information](#key-information)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

## Overview

**Script:** `scripts/analyze-deps.js`

**Command:** `npm run analyze:deps`

**Purpose:** Analyze NPM dependencies from `package.json`, identifying used, unused, and protected packages.

**Use Cases:**
- 🧹 Finding unused dependencies to remove
- 📊 Understanding which packages are used where
- 🔒 Identifying protected core dependencies
- 📦 Auditing dependency usage

---

## Usage

### Basic Usage

```bash
npm run analyze:deps
```

### CLI Arguments

| Argument | Description |
|----------|-------------|
| `--json` | Output results as JSON to console |
| `--help` / `-h` | Show help message |

### Examples

```bash
# Show formatted console output
npm run analyze:deps

# Output as JSON (useful for piping to other tools)
npm run analyze:deps -- --json

# Show help
npm run analyze:deps -- --help
```

---

## What It Analyzes

### Dependencies Scanned

1. **dependencies** - Production dependencies from `package.json`
2. **devDependencies** - Development dependencies (excluded from unused check)

### Source Files Scanned

All files in `src/` directory:
- `.ts`, `.tsx` - TypeScript files
- `.js`, `.jsx` - JavaScript files

### Import Patterns Detected

```typescript
// Standard imports
import React from 'react';
import { useState } from 'react';
import * as Icons from 'lucide-react';

// Side-effect imports
import 'some-package';

// Dynamic imports
const module = await import('some-package');

// CommonJS (legacy)
const pkg = require('some-package');
```

---

## Console Output

```
🔍 Analyzing NPM Dependencies...

══════════════════════════════════════════════════════════════════════
📦 NPM DEPENDENCY ANALYSIS
══════════════════════════════════════════════════════════════════════

Summary:
  Dependencies: 9 | DevDependencies: 30 | Total: 39

USED DEPENDENCIES (6):
  1. @tanstack/react-query (protected)
     └─ Used in: index, page-not-found (2 pages)
  2. clsx (protected)
  3. lucide-react (protected)
     └─ Used in: index, page-not-found, footer, header (2 pages, 2 components)
  4. react (protected)
     └─ Used in: index, page-not-found, footer, header, layout, +2 more (2 pages, 5 components)
  5. react-dom (protected)
     └─ Used in: index, page-not-found (2 pages)
  6. tailwind-merge (protected)

UNUSED DEPENDENCIES (2):
  ⚠️  dayjs - Not imported anywhere
  ⚠️  uuid - Not imported anywhere

  💡 Tip: Run the following to remove unused dependencies:
     npm uninstall dayjs uuid

DEV DEPENDENCIES (excluded from unused check):
  Build tools, testing, linting, and type definitions are not checked.
  Examples: vite, typescript, eslint, vitest, @types/*, etc.

PROTECTED DEPENDENCIES (9):
  Core dependencies that should never be removed:
  • @tanstack/react-query
  • class-variance-authority
  • clsx
  • lucide-react
  • react
  • react-dom
  • react-icons
  • tailwind-merge
  • tailwind-variants

══════════════════════════════════════════════════════════════════════

✅ Analysis Complete!
```

---

## JSON Output

When using `--json` flag:

```json
{
  "generated": "2025-11-29T12:00:00.000Z",
  "summary": {
    "dependencies": 9,
    "devDependencies": 30,
    "total": 39,
    "used": 6,
    "unused": 2,
    "protected": 9
  },
  "used": [
    {
      "name": "@tanstack/react-query",
      "version": "^5.90.10",
      "protected": true,
      "usedIn": ["index", "page-not-found"]
    },
    {
      "name": "lucide-react",
      "version": "^0.554.0",
      "protected": true,
      "usedIn": ["index", "page-not-found", "footer", "header"]
    },
    {
      "name": "react",
      "version": "^19.2.0",
      "protected": true,
      "usedIn": ["index", "page-not-found", "footer", "header", "layout", "section", "viewport-lazy-load"]
    }
  ],
  "unused": ["dayjs", "uuid"],
  "protected": [
    "@tanstack/react-query",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "react",
    "react-dom",
    "react-icons",
    "tailwind-merge",
    "tailwind-variants"
  ]
}
```

---

## Key Information

### Dependency Categories

| Category | Description | Checked for Unused? |
|----------|-------------|---------------------|
| **Used** | Imported somewhere in `src/` | N/A |
| **Unused** | In `package.json` but not imported | ✅ Yes |
| **Protected** | Core dependencies, never remove | ❌ No |
| **Dev Dependencies** | Build/test tools | ❌ No |

### Protected Dependencies

These are core dependencies that should never be removed:

```javascript
const PROTECTED_DEPENDENCIES = [
  'react',
  'react-dom',
  'class-variance-authority',
  'clsx',
  'react-icons',
  'lucide-react',
  'tailwind-merge',
  'tailwind-variants',
  '@tanstack/react-query'
];
```

### Dev Dependency Patterns

These patterns are excluded from the unused check:

```javascript
const DEV_DEPENDENCY_PATTERNS = [
  /^@types\//,        // Type definitions
  /^eslint/,          // ESLint packages
  /^@eslint/,
  /^typescript/,      // TypeScript
  /^vite/,            // Vite packages
  /^@vitejs/,
  /^vitest/,          // Vitest packages
  /^@vitest/,
  /^@testing-library/,// Testing libraries
  /^@playwright/,     // E2E testing
  /^postcss/,         // CSS processing
  /^autoprefixer/,
  /^tailwindcss/,     // Tailwind CSS
  /^@tailwindcss/,
  /^terser/,          // Minification
  /^rollup/,          // Bundler plugins
  /^jsdom/,           // Test environment
  /^globals/,
];
```

---

## Configuration

### Adding Protected Dependencies

Edit `scripts/analyze-utils.js`:

```javascript
export const PROTECTED_DEPENDENCIES = new Set([
  'react',
  'react-dom',
  // Add your protected dependency here
  'your-core-package',
]);
```

### Adding Dev Dependency Patterns

Edit `scripts/analyze-deps.js`:

```javascript
const DEV_DEPENDENCY_PATTERNS = [
  // Add your pattern here
  /^your-dev-tool/,
];
```

---

## Examples

### Example 1: List Unused Dependencies

```bash
npm run analyze:deps -- --json | jq '.unused'
```

Output:
```json
["dayjs", "uuid"]
```

### Example 2: Remove Unused Dependencies

```bash
# First, check what's unused
npm run analyze:deps

# Then remove them
npm uninstall dayjs uuid
```

### Example 3: Find Where a Package is Used

```bash
npm run analyze:deps -- --json | jq '.used[] | select(.name == "lucide-react")'
```

### Example 4: Count Usage Per Dependency

```bash
npm run analyze:deps -- --json | jq '.used[] | {name, usageCount: (.usedIn | length)}'
```

### Example 5: Save Report to File

```bash
npm run analyze:deps -- --json > dependency-report.json
```

### Example 6: Check for Specific Unused Package

```bash
npm run analyze:deps -- --json | jq '.unused | contains(["dayjs"])'
```

---

## Troubleshooting

### Issue: Package Shows as Unused but Is Used

**Possible causes:**
- Package imported with non-standard syntax
- Package used only in config files (not `src/`)
- Package used via peer dependency

**Solution:**
- Check if package is used in `vite.config.ts` or other config files
- Add to protected dependencies if it's a core package
- Verify import syntax matches detected patterns

---

### Issue: Dev Dependency Marked as Unused

**Possible causes:**
- Package name doesn't match dev dependency patterns

**Solution:**
- Add the package pattern to `DEV_DEPENDENCY_PATTERNS`
- Or move to `devDependencies` in `package.json`

---

### Issue: Too Many Protected Dependencies

**Possible causes:**
- Protected list includes packages that could be removed

**Solution:**
- Review `PROTECTED_DEPENDENCIES` list
- Remove packages that aren't truly core dependencies

---

### Issue: Import Not Detected

**Supported patterns:**
```typescript
// ✅ Detected
import pkg from 'package';
import { func } from 'package';
import * as pkg from 'package';
import 'package';
const pkg = await import('package');
const pkg = require('package');

// ❌ Not detected
const name = 'package';
import(name);  // Dynamic string
```

---

## Related Documentation

- **[09-ANALYZE_COMPONENTS.md](./09-ANALYZE_COMPONENTS.md)** - Analyze components
- **[08-ANALYZE_PAGES.md](./08-ANALYZE_PAGES.md)** - Analyze pages
- **[10-ANALYZE_PAGE_COMPONENTS.md](./10-ANALYZE_PAGE_COMPONENTS.md)** - Analyze page sub-components
- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Delete components (includes dependency cleanup)
- **[03-DELETE_PAGE.md](./03-DELETE_PAGE.md)** - Delete pages
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**analyze-deps.js provides:**
- ✅ Complete dependency inventory
- ✅ Used/unused dependency detection
- ✅ Usage location tracking
- ✅ Protected dependency identification
- ✅ Dev dependency exclusion
- ✅ JSON export for automation
- ✅ Cleanup command suggestions

**Perfect for:**
- Dependency audits
- Bundle size optimization
- Cleanup tasks
- CI/CD dependency checks

---

**Last Updated:** November 2025  
**Script Version:** 1.0.0

