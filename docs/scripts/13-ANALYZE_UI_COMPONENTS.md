# Analyze UI Components Script

Complete documentation for the UI component analysis script.

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

**Script:** `scripts/analyze-ui-components.js`

**Command:** `npm run analyze:ui-components`

**Purpose:** Analyze all UI components in `src/components/ui/`, showing their dependencies, relationships, and usage across blocks and pages.

**Use Cases:**
- 🔍 Understanding UI component dependencies and composition
- 🧹 Finding orphan UI components (not used anywhere)
- 📊 Auditing UI component usage across blocks and pages
- 🎨 Visualizing which UI components each component uses
- 🔗 Understanding UI component-to-block relationships

---

## Usage

### Basic Usage

```bash
npm run analyze:ui-components
```

### CLI Arguments

| Argument | Description |
|----------|-------------|
| `--json` | Output results as JSON to console |
| `--help` / `-h` | Show help message |

### Examples

```bash
# Show formatted console output
npm run analyze:ui-components

# Output as JSON (useful for piping to other tools)
npm run analyze:ui-components -- --json

# Show help
npm run analyze:ui-components -- --help
```

---

## What It Analyzes

### UI Components

Scans all UI components in `src/components/ui/`:

```
src/components/ui/
├── button/
│   ├── Button.tsx
│   └── Button.types.ts
├── header/
│   ├── Header.tsx
│   └── Header.types.ts
├── footer/
│   └── Footer.tsx
└── ...
```

### Information Collected

For each UI component:

1. **Files** - All files in the component folder (`.tsx`, `.types.ts`, `.module.css`)
2. **NPM Dependencies** - External packages imported by the component
3. **Uses UI Components** - Other UI components (`src/components/ui/`) that this component uses
4. **Uses Other Components** - Non-UI components that this component uses
5. **Used By UI Components** - Other UI components that import this UI component
6. **Used By Blocks** - Blocks (`src/components/blocks/`) that import this UI component
7. **Used By Regular Components** - Regular components (non-UI, non-block) that import this UI component
8. **Used By Pages** - Pages that use this UI component (directly or indirectly)
9. **Orphan Status** - Whether the UI component is used anywhere

---

## Console Output

### Format

The script outputs a formatted table showing:

```
════════════════════════════════════════════════════════════════════════════════
🎨 UI COMPONENT ANALYSIS
════════════════════════════════════════════════════════════════════════════════

1. button
   Path: /path/to/src/components/ui/button/Button.tsx
   Files: 2
      • Button
      • Button.types
   Dependencies:
      • @radix-ui/react-slot
      • class-variance-authority (protected)
      • react (protected)
   Usage: Not used in any Page, Block, or Component

2. header
   Path: /path/to/src/components/ui/header/Header.tsx
   Dependencies:
      • lucide-react (protected)
      • react (protected)
   Used By Blocks:
      • layout
   Used By Pages:
      • index (protected)

────────────────────────────────────────────────────────────────────────────────
Total UI Components: 5
Orphan UI Components: 1
════════════════════════════════════════════════════════════════════════════════
```

### Color Coding

- **Magenta** - UI component names and headers
- **Yellow** - Dependencies (with protected label)
- **Cyan** - Block relationships
- **Green** - Page usage
- **Red** - Orphan UI components (not used anywhere)
- **Gray** - File paths and metadata

### Summary Information

At the end, the script shows:
- **Total UI Components** - Number of UI components found
- **Orphan UI Components** - Count of UI components not used anywhere (if any)

---

## JSON Output

### Structure

When using `--json`, the output follows this structure:

```json
{
  "generated": "2025-12-03T13:05:10.714Z",
  "summary": {
    "totalUIComponents": 5,
    "totalUIComponentFiles": 9,
    "orphanCount": 1
  },
  "uiComponents": [
    {
      "name": "button",
      "fullPath": "ui/button",
      "files": [
        "ui/button/Button",
        "ui/button/Button.types"
      ],
      "dependencies": [
        "@radix-ui/react-slot",
        "class-variance-authority",
        "react"
      ],
      "usesUIComponents": [],
      "usesOtherComponents": [],
      "usedByUIComponents": [],
      "usedByBlocks": [],
      "usedByRegularComponents": [],
      "usedByPages": [],
      "isOrphan": true
    }
  ],
  "orphanUIComponents": []
}
```

### Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `generated` | string | ISO timestamp of when analysis was run |
| `summary.totalUIComponents` | number | Total number of UI components |
| `summary.totalUIComponentFiles` | number | Total number of files in all UI components |
| `summary.orphanCount` | number | Number of UI components not used anywhere |
| `uiComponents[].name` | string | UI component name (without `ui/` prefix) |
| `uiComponents[].fullPath` | string | Full path including `ui/` prefix |
| `uiComponents[].files` | string[] | Array of file paths relative to `src/components/` |
| `uiComponents[].dependencies` | string[] | NPM packages used by this component |
| `uiComponents[].usesUIComponents` | string[] | UI component names (without `ui/` prefix) used by this component |
| `uiComponents[].usesOtherComponents` | string[] | Other component paths used (non-UI) |
| `uiComponents[].usedByUIComponents` | string[] | UI component names (without `ui/` prefix) that import this UI component |
| `uiComponents[].usedByBlocks` | string[] | Block names (without `blocks/` prefix) that import this UI component |
| `uiComponents[].usedByRegularComponents` | string[] | Regular component paths (non-UI, non-block) that import this UI component |
| `uiComponents[].usedByPages` | string[] | Pages that use this UI component |
| `uiComponents[].isOrphan` | boolean | Whether UI component is unused |
| `orphanUIComponents` | string[] | Array of orphan UI component names |

---

## Key Information

### UI Components

**UI Components** are reusable, atomic design system components. They live in `src/components/ui/` and are designed to be composed by blocks and used directly in pages.

**Characteristics:**
- Atomic, reusable components
- Typically used by blocks (`src/components/blocks/`)
- Can be used directly by pages
- May use other UI components (composition)
- Have their own types and styles
- Examples: Button, Input, Card, Header, Footer

### Protected Dependencies

Some dependencies are marked as `(protected)` and should never be removed:
- `react`, `react-dom` - Core React libraries
- `class-variance-authority`, `clsx`, `tailwind-merge` - Styling utilities
- `@tanstack/react-query` - Data fetching
- `react-icons`, `lucide-react` - Icon libraries

### Orphan UI Components

UI components that are:
- Not imported by any page
- Not imported by any block
- Not imported by any other component

These may be:
- 🗑️ **Unused code** - Safe to delete
- 🚧 **Work in progress** - Under development
- 📦 **Library components** - Intended for future use

---

## Examples

### Example 1: Basic Analysis

```bash
$ npm run analyze:ui-components

🔍 Analyzing UI Components...

════════════════════════════════════════════════════════════════════════════════
🎨 UI COMPONENT ANALYSIS
════════════════════════════════════════════════════════════════════════════════

1. button
   Path: /path/to/src/components/ui/button/Button.tsx
   Files: 2
      • Button
      • Button.types
   Dependencies:
      • @radix-ui/react-slot
      • class-variance-authority (protected)
      • react (protected)
   Usage: Not used in any Page, Block, or Component

2. header
   Path: /path/to/src/components/ui/header/Header.tsx
   Dependencies:
      • lucide-react (protected)
      • react (protected)
   Used By Blocks:
      • layout
   Used By Pages:
      • index (protected)

────────────────────────────────────────────────────────────────────────────────
Total UI Components: 5
Orphan UI Components: 1
════════════════════════════════════════════════════════════════════════════════

✅ Analysis Complete!
```

### Example 2: JSON Output

```bash
$ npm run analyze:ui-components -- --json | jq '.summary'

{
  "totalUIComponents": 5,
  "totalUIComponentFiles": 9,
  "orphanCount": 1
}
```

### Example 3: Finding Orphan UI Components

```bash
$ npm run analyze:ui-components -- --json | jq '.orphanUIComponents'

[
  "button"
]
```

---

## Troubleshooting

### No UI Components Found

**Problem:** Script shows "No UI components found"

**Solutions:**
- Verify UI components exist in `src/components/ui/`
- Check that component folders contain `.tsx` or `.ts` files
- Ensure you're running from project root

### Missing Block References

**Problem:** UI component shows it's used by blocks, but they're not listed

**Solutions:**
- Verify blocks exist in `src/components/blocks/`
- Check import paths in block files
- Ensure imports use `@/components/ui/` alias
- Run `npm run analyze:blocks` to verify block structure

### Incorrect Page Usage

**Problem:** UI component shows as unused but you know it's used

**Solutions:**
- Check that pages import UI components correctly
- Verify import paths use `@/components/ui/` alias
- Check if component is used indirectly via blocks
- Run `npm run analyze:pages` to see page dependencies

---

## Related Documentation

- [Analyze Components](./09-ANALYZE_COMPONENTS.md) - Analyze all components
- [Analyze Blocks](./10-ANALYZE_BLOCKS.md) - Analyze block components
- [Analyze Pages](./08-ANALYZE_PAGES.md) - Analyze page dependencies
- [Analyze Dependencies](./11-ANALYZE_DEPS.md) - Analyze NPM dependencies
- [Create Component](./04-CREATE_COMPONENT.md) - Create new UI components
- [Delete Component](./05-DELETE_COMPONENT.md) - Delete UI components

---

## Notes

- UI components are atomic design system components
- The script filters only components in `src/components/ui/`
- UI component names are shown without the `ui/` prefix for readability
- Block names are shown without the `blocks/` prefix for readability
- Protected dependencies are marked but not counted as "orphan" indicators
- UI components can be composed of other UI components

