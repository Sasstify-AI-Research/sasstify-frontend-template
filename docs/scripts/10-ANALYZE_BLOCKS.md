# Analyze Blocks Script

Complete documentation for the block analysis script.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What-1](#usage-1)
- [What It Analyzes](#what-it-analyzes)
- [Console Output](#console-output)
- [JSON Output](#json-output)
- [Key Information](#key-information)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

## Overview

**Script:** `scripts/analyze-blocks.js`

**Command:** `npm run analyze:blocks`

**Purpose:** Analyze all block components in `src/components/blocks/`, showing their dependencies, UI component usage, and usage across pages.

**Use Cases:**
- 🔍 Understanding block dependencies and composition
- 🧹 Finding orphan blocks (not used anywhere)
- 📊 Auditing block usage across pages
- 🧩 Visualizing which UI components each block uses
- 🔗 Understanding block-to-component relationships

---

## Usage

### Basic Usage

```bash
npm run analyze:blocks
```

### CLI Arguments

| Argument | Description |
|----------|-------------|
| `--json` | Output results as JSON to console |
| `--help` / `-h` | Show help message |

### Examples

```bash
# Show formatted console output
npm run analyze:blocks

# Output as JSON (useful for piping to other tools)
npm run analyze:blocks -- --json

# Show help
npm run analyze:blocks -- --help
```

---

## What It Analyzes

### Block Components

Scans all block components in `src/components/blocks/`:

```
src/components/blocks/
├── layout/
│   ├── Layout.tsx
│   └── Layout.types.ts
├── hero/
│   ├── Hero.tsx
│   └── Hero.types.ts
└── ...
```

### Information Collected

For each block:

1. **Files** - All files in the block folder (`.tsx`, `.types.ts`, `.module.css`)
2. **NPM Dependencies** - External packages imported by the block
3. **Uses UI Components** - UI components (`src/components/ui/`) that this block uses
4. **Uses Other Components** - Non-UI components that this block uses
5. **Used By Blocks** - Other blocks that import this block
6. **Used By UI Components** - UI components that import this block
7. **Used By Regular Components** - Regular components** - Regular components (non-UI, non-block) that import this block
8. **Used By Pages** - Pages that use this block (directly or indirectly)
9. **Orphan Status** - Whether the block is used anywhere

---

## Console Output

### Format

The script outputs a formatted table showing:

```
════════════════════════════════════════════════════════════════════════════════
🧩 BLOCK ANALYSIS
════════════════════════════════════════════════════════════════════════════════

1. layout
   Path: /path/to/src/components/blocks/layout/Layout.tsx
   Files: 2
      • Layout
      • Layout.types
   Dependencies:
      • react (protected)
   Uses UI Components:
      • footer
      • header
   Used By Pages:
      • index (protected)

────────────────────────────────────────────────────────────────────────────────
Total Blocks: 1
════════════════════════════════════════════════════════════════════════════════
```

### Color Coding

- **Cyan** - Block names and headers
- **Yellow** - Dependencies (with protected label)
- **Magenta** - Component relationships
- **Green** - Page usage
- **Red** - Orphan blocks (not used anywhere)
- **Gray** - File paths and metadata

### Summary Information

At the end, the script shows:
- **Total Blocks** - Number of block components found
- **Orphan Blocks** - Count of blocks not used anywhere (if any)

---

## JSON Output

### Structure

When using `--json`, the output follows this structure:

```json
{
  "generated": "2025-12-03T12:38:41.816Z",
  "summary": {
    "totalBlocks": 1,
    "totalBlockFiles": 2,
    "orphanCount": 0
  },
  "blocks": [
    {
      "name": "layout",
      "fullPath": "blocks/layout",
      "files": [
        "blocks/layout/Layout",
        "blocks/layout/Layout.types"
      ],
      "dependencies": ["react"],
      "usesUIComponents": ["footer", "header"],
      "usesOtherComponents": [],
      "usedByUIComponents": [],
      "usedByBlocks": [],
      "usedByRegularComponents": [],
      "usedByPages": ["index"],
      "isOrphan": false
    }
  ],
  "orphanBlocks": []
}
```

### Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `generated` | string | ISO timestamp of when analysis was run |
| `summary.totalBlocks` | number | Total number of block components |
| `summary.totalBlockFiles` | number | Total number of files in all blocks |
| `summary.orphanCount` | number | Number of blocks not used anywhere |
| `blocks[].name` | string | Block name (without `blocks/` prefix) |
| `blocks[].fullPath` | string | Full path including `blocks/` prefix |
| `blocks[].files` | string[] | Array of file paths relative to `src/components/` |
| `blocks[].dependencies` | string[] | NPM packages used by this block |
| `blocks[].usesUIComponents` | string[] | UI component names (without `ui/` prefix) |
| `blocks[].usesOtherComponents` | string[] | Other component paths used (non-UI, non-block) |
| `blocks[].usedByUIComponents` | string[] | UI component names (without `ui/` prefix) that import this block |
| `blocks[].usedByBlocks` | string[] | Block names (without `blocks/` prefix) that import this block |
| `blocks[].usedByRegularComponents` | string[] | Regular component paths (non-UI, non-block) that import this block |
| `blocks[].usedByPages` | string[] | Pages that use this block |
| `blocks[].isOrphan` | boolean | Whether block is unused |
| `orphanBlocks` | string[] | Array of orphan block names |

---

## Key Information

### Block Components

**Blocks** are composite components that compose multiple UI components. They live in `src/components/blocks/` and are designed to be reusable page sections.

**Characteristics:**
- Composed of UI components (`src/components/ui/`)
- May use other shared components
- Can be used by other blocks (block composition)
- Typically represent larger page sections (hero, layout, feature-grid, etc.)
- Have their own types and styles

### Protected Dependencies

Some dependencies are marked as `(protected)` and should never be removed:
- `react`, `react-dom` - Core React libraries
- `class-variance-authority`, `clsx`, `tailwind-merge` - Styling utilities
- `@tanstack/react-query` - Data fetching
- `react-icons`, `lucide-react` - Icon libraries

### Orphan Blocks

Blocks that are:
- Not imported by any page
- Not imported by any other block
- Not imported by any other component

These may be:
- 🗑️ **Unused code** - Safe to delete
- 🚧 **Work in progress** - Under development
- 📦 **Library components** - Intended for future use

---

## Examples

### Example 1: Basic Analysis

```bash
$ npm run analyze:blocks

🔍 Analyzing Blocks...

════════════════════════════════════════════════════════════════════════════════
🧩 BLOCK ANALYSIS
════════════════════════════════════════════════════════════════════════════════

1. layout
   Path: /path/to/src/components/blocks/layout/Layout.tsx
   Files: 2
      • Layout
      • Layout.types
   Dependencies:
      • react (protected)
   Uses UI Components:
      • footer
      • header
   Used By Pages:
      • index (protected)

────────────────────────────────────────────────────────────────────────────────
Total Blocks: 1
════════════════════════════════════════════════════════════════════════════════

✅ Analysis Complete!
```

### Example 2: JSON Output

```bash
$ npm run analyze:blocks -- --json | jq '.summary'

{
  "totalBlocks": 1,
  "totalBlockFiles": 2,
  "orphanCount": 0
}
```

### Example 3: Finding Orphan Blocks

```bash
$ npm run analyze:blocks -- --json | jq '.orphanBlocks'

[
  "unused-block"
]
```

---

## Troubleshooting

### No Blocks Found

**Problem:** Script shows "No blocks found"

**Solutions:**
- Verify blocks exist in `src/components/blocks/`
- Check that block folders contain `.tsx` or `.ts` files
- Ensure you're running from project root

### Missing UI Component References

**Problem:** Block shows it uses UI components, but they're not listed

**Solutions:**
- Verify UI components exist in `src/components/ui/`
- Check import paths in block files
- Ensure imports use `@/components/ui/` alias

### Incorrect Page Usage

**Problem:** Block shows as unused but you know it's used

**Solutions:**
- Check that pages import blocks correctly
- Verify import paths use `@/components/blocks/` alias
- Run `npm run analyze:pages` to see page dependencies

---

## Related Documentation

- [Analyze Components](./09-ANALYZE_COMPONENTS.md) - Analyze all components
- [Analyze Pages](./08-ANALYZE_PAGES.md) - Analyze page dependencies
- [Analyze Dependencies](./11-ANALYZE_DEPS.md) - Analyze NPM dependencies
- [Create Component](./04-CREATE_COMPONENT.md) - Create new blocks
- [Delete Component](./05-DELETE_COMPONENT.md) - Delete blocks

---

## Notes

- Blocks are a special type of component designed for composition
- The script filters only components in `src/components/blocks/`
- UI component names are shown without the `ui/` prefix for readability
- Block names are shown without the `blocks/` prefix for readability
- Protected dependencies are marked but not counted as "orphan" indicators

