# Delete UI Component Script

Complete documentation for the automated UI component deletion script.

---

## Overview

**Script:** `scripts/delete-ui-component.js`

**Command:** `npm run delete:ui-component`

**Purpose:** Safely delete UI components with usage analysis, cascade deletion, and npm dependency cleanup.

**Component Type:** UI components only

**Safety Level:** ⚠️ Destructive (with safety checks)

---

## Usage

### Interactive Mode

```bash
npm run delete:ui-component
```

### CLI Mode

```bash
npm run delete:ui-component -- --name=<name> [--cascade] [--deps] [--yes]
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--name=<name>` | Yes (CLI) | UI Component name (e.g., `accordion`) |
| `--yes` / `-y` | No | Skip confirmation prompts |
| `--cascade` | No | Enable cascade deletion of orphaned child components |
| `--deps` | No | Enable npm dependency cleanup |
| `--help` / `-h` | No | Show usage help |

---

## What It Does

### 1. Usage Analysis

**Before deletion, checks:**
- ✅ Which pages use this UI component
- ✅ Which blocks use this UI component
- ✅ Which other components import this UI component
- ✅ Total usage count

**Prevents deletion if component is in use!**

### 2. File Cleanup

**Deletes:**
- ✅ UI Component folder (`src/components/ui/[name]/`)
- ✅ All component files (`.tsx`, `.types.ts`, `.module.css`)
- ✅ Unit test files (`tests/unit/components/ui/[Name].test.tsx`)

---

## Examples

### Example 1: CLI Mode

```bash
$ npm run delete:ui-component -- --name=accordion --yes

🧹 Delete UI Component Script

Building component and usage maps...

Selected: accordion

- Usage Analysis:

  ✓ No usages found - safe to delete!

🗑️  Deleting UI component...

  ✅ Deleted UI component accordion
  ✅ Deleted test tests/unit/components/ui/Accordion.test.tsx

✅ UI Component deletion complete!
```

---

## Related Documentation

- **[06-CREATE_UI_COMPONENT.md](./06-CREATE_UI_COMPONENT.md)** - Create UI components
- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Delete regular components
- **[15-DELETE_BLOCK.md](./15-DELETE_BLOCK.md)** - Delete block components
- **[README.md](./README.md)** - Scripts overview

---

**Last Updated:** December 2025  
**Script Version:** 1.0.0

