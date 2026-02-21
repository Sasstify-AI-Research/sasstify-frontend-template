# Analyze Pages Script

Complete documentation for the page analysis script.

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

**Script:** `scripts/analyze-pages.js`

**Command:** `npm run analyze:pages`

**Purpose:** Analyze all pages in `src/pages/`, showing their dependencies, components used, and UI components.

**Use Cases:**
- 📊 Understanding page dependencies
- 🔍 Auditing which components each page uses
- 📦 Tracking NPM packages per page
- 🎨 Identifying UI component usage

---

## Usage

### Basic Usage

```bash
npm run analyze:pages
```

### CLI Arguments

| Argument | Description |
|----------|-------------|
| `--json` | Output results as JSON to console |
| `--help` / `-h` | Show help message |

### Examples

```bash
# Show formatted console output
npm run analyze:pages

# Output as JSON (useful for piping to other tools)
npm run analyze:pages -- --json

# Show help
npm run analyze:pages -- --help
```

---

## What It Analyzes

### Pages Directory

Scans all pages in `src/pages/`:

```
src/pages/
├── index/
│   ├── index.html
│   ├── main.tsx
│   ├── Index.tsx
│   └── components/
│       └── HeroSection.tsx
├── about/
│   ├── index.html
│   ├── main.tsx
│   └── About.tsx
├── page-not-found/
│   ├── index.html
│   ├── main.tsx
│   └── PageNotFound.tsx
└── ...
```

### Information Collected

For each page:

1. **Name** - Page folder name (kebab-case)
2. **Protected Status** - Whether it's a core page (index)
3. **Dependencies** - NPM packages imported (directly and via components)
4. **Components** - Shared components used from `src/components/`
5. **UI Components** - UI components used from `src/components/ui/`

---

## Console Output

```
🔍 Analyzing Pages...

════════════════════════════════════════════════════════════════════════════════
📄 PAGE ANALYSIS
════════════════════════════════════════════════════════════════════════════════

1. Page: index (protected)
   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─
   Dependencies: (4)
      • react (protected)
      • lucide-react (protected)
      • react-dom (protected)
      • @tanstack/react-query (protected)

   Components: (5)
      • footer
      • header
      • layout
      • section
      • viewport-lazy-load

   UI Components: (2)
      • ui/button
      • ui/card

2. Page: about
   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─
   Dependencies: (3)
      • react (protected)
      • react-dom (protected)
      • lucide-react (protected)

   Components: (3)
      • footer
      • header
      • layout

   UI Components: (0)
      None

3. Page: page-not-found
   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─   ─
   Dependencies: (4)
      • react-dom (protected)
      • @tanstack/react-query (protected)
      • react (protected)
      • lucide-react (protected)

   Components: (3)
      • footer
      • header
      • layout

   UI Components: (0)
      None

────────────────────────────────────────────────────────────────────────────────
Total Pages: 3
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
    "totalPages": 3,
    "protectedPages": 1
  },
  "pages": [
    {
      "name": "index",
      "isProtected": true,
      "dependencies": [
        "@tanstack/react-query",
        "lucide-react",
        "react",
        "react-dom"
      ],
      "components": [
        "footer",
        "header",
        "layout",
        "section",
        "viewport-lazy-load"
      ],
      "uiComponents": [
        "ui/button",
        "ui/card"
      ]
    },
    {
      "name": "about",
      "isProtected": false,
      "dependencies": [
        "lucide-react",
        "react",
        "react-dom"
      ],
      "components": [
        "footer",
        "header",
        "layout"
      ],
      "uiComponents": []
    },
    {
      "name": "page-not-found",
      "isProtected": false,
      "dependencies": [
        "@tanstack/react-query",
        "lucide-react",
        "react",
        "react-dom"
      ],
      "components": [
        "footer",
        "header",
        "layout"
      ],
      "uiComponents": []
    }
  ]
}
```

---

## Key Information

### Protected Pages

Pages marked as `(protected)`:
- `index` - The main entry page, should never be deleted

### Protected Dependencies

Dependencies marked as `(protected)` are core dependencies:
- `react`, `react-dom`
- `lucide-react`, `react-icons`
- `@tanstack/react-query`
- `clsx`, `tailwind-merge`, `tailwind-variants`
- `class-variance-authority`

### Component Tracking

The analysis includes:
- **Direct imports** - Components imported directly in page files
- **Indirect imports** - Components imported by other components (transitive)

Example: If `Index.tsx` imports `Layout`, and `Layout` imports `Header` and `Footer`, all three are counted.

### UI Components

UI components are tracked separately:
- Located in `src/components/ui/`
- Grouped by folder (e.g., `ui/button`, `ui/card`)

---

## Examples

### Example 1: List All Pages

```bash
npm run analyze:pages -- --json | jq '.pages[].name'
```

Output:
```
"index"
"about"
"page-not-found"
```

### Example 2: Find Pages Using a Specific Component

```bash
npm run analyze:pages -- --json | jq '.pages[] | select(.components | contains(["layout"])) | .name'
```

### Example 3: Count Dependencies Per Page

```bash
npm run analyze:pages -- --json | jq '.pages[] | {name, depCount: (.dependencies | length)}'
```

### Example 4: Find Pages Without UI Components

```bash
npm run analyze:pages -- --json | jq '.pages[] | select(.uiComponents | length == 0) | .name'
```

### Example 5: Save Report to File

```bash
npm run analyze:pages -- --json > page-report.json
```

---

## Troubleshooting

### Issue: Page Not Showing

**Possible causes:**
- Page directory doesn't exist in `src/pages/`
- Missing required files (`index.html`, `main.tsx`)

**Solution:**
- Ensure page was created with `npm run create:page`
- Check directory structure matches expected format

---

### Issue: Wrong Component Count

**Possible causes:**
- Components imported via barrel files
- Dynamic imports not detected

**Solution:**
- Use direct imports from component files
- Avoid complex import patterns

---

### Issue: Missing Dependencies

**Possible causes:**
- Dependencies imported only in component files
- Non-standard import syntax

**Solution:**
- The script tracks dependencies transitively through components
- Check if the dependency is actually imported

---

## Related Documentation

- **[09-ANALYZE_COMPONENTS.md](./09-ANALYZE_COMPONENTS.md)** - Analyze components
- **[11-ANALYZE_DEPS.md](./11-ANALYZE_DEPS.md)** - Analyze NPM dependencies
- **[10-ANALYZE_PAGE_COMPONENTS.md](./10-ANALYZE_PAGE_COMPONENTS.md)** - Analyze page sub-components
- **[02-CREATE_PAGE.md](./02-CREATE_PAGE.md)** - Create pages
- **[03-DELETE_PAGE.md](./03-DELETE_PAGE.md)** - Delete pages
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**analyze-pages.js provides:**
- ✅ Complete page inventory
- ✅ Dependency tracking per page
- ✅ Component usage analysis
- ✅ UI component tracking
- ✅ Protected page identification
- ✅ JSON export for automation

**Perfect for:**
- Page audits
- Dependency analysis
- Component usage tracking
- Build optimization planning

---

**Last Updated:** November 2025  
**Script Version:** 1.0.0

