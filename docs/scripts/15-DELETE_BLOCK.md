# Delete Block Script

Complete documentation for the automated block component deletion script.

---

## Overview

**Script:** `scripts/delete-block.js`

**Command:** `npm run delete:block`

**Purpose:** Safely delete block components with usage analysis, cascade deletion, and npm dependency cleanup.

**Component Type:** Block components only

**Safety Level:** ⚠️ Destructive (with safety checks)

---

## Usage

### Interactive Mode

```bash
npm run delete:block
```

### CLI Mode

```bash
npm run delete:block -- --name=<name> [--cascade] [--deps] [--yes]
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--name=<name>` | Yes (CLI) | Block Component name (e.g., `hero-section`) |
| `--yes` / `-y` | No | Skip confirmation prompts |
| `--cascade` | No | Enable cascade deletion of orphaned child components |
| `--deps` | No | Enable npm dependency cleanup |
| `--help` / `-h` | No | Show usage help |

---

## What It Does

### 1. Usage Analysis

**Before deletion, checks:**
- ✅ Which pages use this block
- ✅ Which other blocks use this block
- ✅ Which components import this block
- ✅ Total usage count

**Prevents deletion if block is in use!**

### 2. File Cleanup

**Deletes:**
- ✅ Block Component folder (`src/components/blocks/[name]/`)
- ✅ All component files (`.tsx`, `.types.ts`, `.module.css`)
- ✅ Unit test files (`tests/unit/components/blocks/[Name].test.tsx`)

---

## Examples

### Example 1: CLI Mode

```bash
$ npm run delete:block -- --name=hero-section --yes

🧹 Delete Block Component Script

Building component and usage maps...

Selected: hero-section

- Usage Analysis:

  ✓ No usages found - safe to delete!

🗑️  Deleting Block component...

  ✅ Deleted Block component hero-section
  ✅ Deleted test tests/unit/components/blocks/HeroSection.test.tsx

✅ Block Component deletion complete!
```

---

## Related Documentation

- **[14-CREATE_BLOCK.md](./14-CREATE_BLOCK.md)** - Create block components
- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Delete regular components
- **[07-DELETE_UI_COMPONENT.md](./07-DELETE_UI_COMPONENT.md)** - Delete UI components
- **[10-ANALYZE_BLOCKS.md](./10-ANALYZE_BLOCKS.md)** - Analyze block components
- **[README.md](./README.md)** - Scripts overview

---

**Last Updated:** December 2025  
**Script Version:** 1.0.0

