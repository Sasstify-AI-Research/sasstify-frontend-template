# Analyze Components Script

Complete documentation for the component analysis script.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What It Analyzes](#what-it-analyzes)
- [Console Output](#console-output)
- [JSON Output](#json-output)
- [Key Information](#key-information)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

## Overview

**Script:** `scripts/analyze-components.js`

**Command:** `npm run analyze:components`

**Purpose:** Analyze all shared components in `src/components/`, showing their dependencies, relationships, and usage across pages.

**Use Cases:**
- 🔍 Understanding component dependencies
- 🧹 Finding orphan components (not used anywhere)
- 📊 Auditing component usage across pages
- 🔗 Visualizing component-to-component relationships

---

## Usage

### Basic Usage

```bash
npm run analyze:components
```

### CLI Arguments

| Argument | Description |
|----------|-------------|
| `--json` | Output results as JSON to console |
| `--help` / `-h` | Show help message |

### Examples

```bash
# Show formatted console output
npm run analyze:components

# Output as JSON (useful for piping to other tools)
npm run analyze:components -- --json

# Show help
npm run analyze:components -- --help
```

---

## What It Analyzes

### Shared Components

Scans all components in `src/components/`:

```
src/components/
├── header/
│   ├── Header.tsx
│   └── Header.types.ts
├── footer/
│   └── Footer.tsx
├── layout/
│   ├── Layout.tsx
│   └── Layout.types.ts
├── ui/
│   ├── button/
│   │   └── Button.tsx
│   └── card/
│       └── Card.tsx
└── ...
```

### Information Collected

For each component group:

1. **Files** - All files in the component folder
2. **NPM Dependencies** - External packages imported
3. **Uses Components** - Other shared components this component imports
4. **Used By UI Components** - UI components that import this component
5. **Used By Blocks** - Blocks that import this component
6. **Used By Regular Components** - Regular components (non-UI, non-block) that import this component
7. **Used In Pages** - Pages that use this component (directly or indirectly)
8. **Orphan Status** - Whether the component is used anywhere

---

## Console Output

```
🔍 Analyzing Components...

════════════════════════════════════════════════════════════════════════════════
📦 COMPONENT ANALYSIS
════════════════════════════════════════════════════════════════════════════════

1. footer
   Files: 1
      • Footer
   Dependencies:
      • lucide-react (protected)
      • react (protected)
   Used By Blocks:
      • layout
   Used In Pages:
      • index (protected)
      • page-not-found

2. header
   Files: 2
      • Header
      • Header.types
   Dependencies:
      • lucide-react (protected)
      • react (protected)
   Used By Blocks:
      • layout
   Used In Pages:
      • index (protected)
      • page-not-found

3. viewport-lazy-load
   Used By UI Components:
      • section
   Used In Pages:
      • index (protected)

3. layout
   Files: 2
      • Layout
      • Layout.types
   Dependencies:
      • react (protected)
   Uses Components:
      • footer
      • header
   Used In Pages:
      • index (protected)
      • page-not-found

4. section
   Files: 2
      • Section
      • Section.types
   Dependencies:
      • react (protected)
   Uses Components:
      • viewport-lazy-load
   Used In Pages:
      • index (protected)

5. orphan-widget
   Files: 1
      • OrphanWidget
   Dependencies:
      • react (protected)
   Usage: Not used in any Page or Component

────────────────────────────────────────────────────────────────────────────────
Total Component Groups: 5
Total Component Files: 8
════════════════════════════════════════════════════════════════════════════════

✅ Analysis Complete!
```

---

## JSON Output

When using `--json` flag:

```json
{
  "generated": "2025-11-29T12:00:00.000Z",
  "summary": {
    "totalComponentGroups": 5,
    "totalComponentFiles": 8,
    "orphanCount": 1
  },
  "components": [
    {
      "name": "footer",
      "files": ["footer/Footer"],
      "dependencies": ["lucide-react", "react"],
      "usesComponents": [],
      "usedByUIComponents": [],
      "usedByBlocks": ["layout"],
      "usedByRegularComponents": [],
      "usedInPages": ["index", "page-not-found"],
      "isOrphan": false
    },
    {
      "name": "header",
      "files": ["header/Header", "header/Header.types"],
      "dependencies": ["lucide-react", "react"],
      "usesComponents": [],
      "usedByUIComponents": [],
      "usedByBlocks": ["layout"],
      "usedByRegularComponents": [],
      "usedInPages": ["index", "page-not-found"],
      "isOrphan": false
    },
    {
      "name": "layout",
      "files": ["layout/Layout", "layout/Layout.types"],
      "dependencies": ["react"],
      "usesComponents": ["footer", "header"],
      "usedByComponents": [],
      "usedInPages": ["index", "page-not-found"],
      "isOrphan": false
    },
    {
      "name": "orphan-widget",
      "files": ["orphan-widget/OrphanWidget"],
      "dependencies": ["react"],
      "usesComponents": [],
      "usedByComponents": [],
      "usedInPages": [],
      "isOrphan": true
    }
  ],
  "orphanComponents": ["orphan-widget"]
}
```

---

## Key Information

### Component Groups

Components are grouped by their folder name:

| Path | Group Name |
|------|------------|
| `src/components/ui/header/Header.tsx` | `header` |
| `src/components/ui/button/Button.tsx` | `ui/button` |
| `src/components/blocks/layout/Layout.tsx` | `layout` |

### Protected Dependencies

Dependencies marked as `(protected)` are core dependencies that should never be removed:
- `react`, `react-dom`
- `lucide-react`, `react-icons`
- `@tanstack/react-query`
- `clsx`, `tailwind-merge`, `tailwind-variants`
- `class-variance-authority`

### Protected Pages

Pages marked as `(protected)` are core pages:
- `index` - The main entry page

### Orphan Components

Components with `isOrphan: true` are:
- Not imported by any page (directly or indirectly)
- Not imported by any other component

**Action:** Consider removing orphan components to keep the codebase clean.

---

## Examples

### Example 1: Find Orphan Components

```bash
npm run analyze:components -- --json | jq '.orphanComponents'
```

Output:
```json
["orphan-widget", "unused-card"]
```

### Example 2: List All Component Dependencies

```bash
npm run analyze:components -- --json | jq '.components[] | {name, dependencies}'
```

### Example 3: Find Components Used by a Specific Page

```bash
npm run analyze:components -- --json | jq '.components[] | select(.usedInPages | contains(["index"]))'
```

### Example 4: Save Report to File

```bash
npm run analyze:components -- --json > component-report.json
```

---

## Troubleshooting

### Issue: Component Not Showing

**Possible causes:**
- Component file doesn't have `.tsx`, `.ts`, `.jsx`, or `.js` extension
- Component is outside `src/components/` directory

**Solution:**
- Ensure component is in `src/components/`
- Check file extension

---

### Issue: Wrong Dependency Count

**Possible causes:**
- Dynamic imports not detected
- Non-standard import syntax

**Solution:**
- Use standard ES6 import syntax
- Avoid string concatenation in import paths

---

### Issue: Orphan Detection Incorrect

**Possible causes:**
- Component imported via barrel file not detected
- Lazy-loaded components

**Solution:**
- Check if component is actually used
- Verify import paths are correct

---

## Related Documentation

- **[08-ANALYZE_PAGES.md](./08-ANALYZE_PAGES.md)** - Analyze pages
- **[11-ANALYZE_DEPS.md](./11-ANALYZE_DEPS.md)** - Analyze NPM dependencies
- **[10-ANALYZE_PAGE_COMPONENTS.md](./10-ANALYZE_PAGE_COMPONENTS.md)** - Analyze page sub-components
- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Delete components
- **[04-CREATE_COMPONENT.md](./04-CREATE_COMPONENT.md)** - Create components
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**analyze-components.js provides:**
- ✅ Complete component inventory
- ✅ Dependency tracking (NPM and internal)
- ✅ Component relationship mapping
- ✅ Orphan component detection
- ✅ Page usage analysis
- ✅ JSON export for automation

**Perfect for:**
- Code audits
- Refactoring planning
- Dependency analysis
- Cleanup tasks

---

**Last Updated:** November 2025  
**Script Version:** 2.0.0

