# Manage Shadcn Registry Script

Complete documentation for managing shadcn registry entries in `components.json`.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What It Does](#what-it-does)
- [Available Registries](#available-registries)
- [Examples](#examples)
- [Interactive Mode](#interactive-mode)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Integration with Existing Scripts](#integration-with-existing-scripts)

---

## Overview

**Script:** `scripts/manage-shadcn-registry.js`

**Command:** `npm run manage:registry`

**Purpose:** Add and manage shadcn-compatible registry entries in `components.json`, enabling components from multiple registries (Magic UI, Aceternity UI, Origin UI, etc.).

**Safety Level:** ✅ Safe (validation, duplicate detection, preserves existing config)

---

## Usage

### Add Registry (requires @namespace and URL)

```bash
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

### Remove Registry

```bash
npm run manage:registry -- --remove=@magicui
```

### List Available Registries (from shadcn website)

```bash
npm run manage:registry -- --list
```

### List Current Registries

```bash
npm run manage:registry -- --current
```

### JSON Output

```bash
# List available registries as JSON
npm run manage:registry -- --list --json

# List current registries as JSON
npm run manage:registry -- --current --json
```

### Interactive Mode

```bash
npm run manage:registry
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--add=<@namespace>` | Yes (for add) | Registry namespace (must start with @) |
| `--url=<url>` | Yes (for add) | Registry URL (must contain `{name}` placeholder) |
| `--remove=<@namespace>` | No | Remove registry by namespace |
| `--list` | No | List available registries from shadcn website |
| `--current` | No | List registries in components.json |
| `--json` | No | Output as JSON (use with --list or --current) |
| `--help` / `-h` | No | Show usage help |

---

## What It Does

### 1. Validation

**Checks:**
- ✅ Namespace starts with `@` (e.g., `@magicui`)
- ✅ URL contains `{name}` placeholder
- ✅ URL is valid format
- ✅ Registry doesn't already exist
- ✅ components.json exists

**Namespace Requirements:**
- Must start with `@`
- Example: `@magicui`, `@myteam`, `@aceternity`

**URL Format Requirements:**
- Must be a valid URL
- Must contain `{name}` placeholder
- Example: `https://registry.com/r/{name}.json`

---

### 2. Registry Management

The script manages the `registries` section in `components.json`:

**Before:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tsx": true,
  "tailwind": { ... },
  "aliases": { ... }
}
```

**After Adding Registry:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tsx": true,
  "tailwind": { ... },
  "aliases": { ... },
  "registries": {
    "@magicui": {
      "url": "https://magicui.design/r/{name}.json"
    }
  }
}
```

---

## Available Registries

The `--list` command fetches available registries from shadcn's website:

```bash
npm run manage:registry -- --list
```

**Output:**
```
📋 Available Registries from shadcn:

   Fetching from https://ui.shadcn.com/r/registries.json...

   @shadcn
     Website: https://ui.shadcn.com
     Registry URL: https://ui.shadcn.com/r/{name}.json

   @magicui
     Website: https://magicui.design
     Registry URL: https://magicui.design/r/{name}.json

   ... (more registries from shadcn)

💡 To add a registry:
   npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

**Note:** If network is unavailable, a fallback list of common registries is shown.

---

## Examples

### Example 1: Add Magic UI Registry

```bash
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

**Output:**
```
✅ Registry "@magicui" added successfully!
   URL: https://magicui.design/r/{name}.json
```

### Example 2: Use Magic UI Components

After adding the registry:

```bash
npm run add:shadcn @magicui/marquee
```

### Example 3: Add Custom Team Registry

```bash
npm run manage:registry -- --add=@myteam --url=https://internal-registry.company.com/r/{name}.json
```

**Output:**
```
✅ Registry "@myteam" added successfully!
   URL: https://internal-registry.company.com/r/{name}.json
```

### Example 4: List Current Registries

```bash
npm run manage:registry -- --current
```

**Output:**
```
📦 Current Registries in components.json:

   @magicui
     URL: https://magicui.design/r/{name}.json

   @myteam
     URL: https://internal-registry.company.com/r/{name}.json
```

### Example 5: Remove Registry

```bash
npm run manage:registry -- --remove=@myteam
```

**Output:**
```
✅ Registry "@myteam" removed successfully!
```

### Example 6: Registry Already Exists

```bash
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

**Output:**
```
⚠️  Registry "@magicui" already exists.
   Current URL: https://magicui.design/r/{name}.json
```

---

## Interactive Mode

When running without arguments, the script enters interactive mode:

```bash
npm run manage:registry
```

**Interactive Menu:**
```
🔧 Manage Shadcn Registry

Select an option:

  1. Add registry
  2. Remove registry
  3. List current registries
  4. List known registries
  5. Exit

? Select option (1-5):
```

### Adding Registry (Interactive)

```
? Enter namespace (must start with @, e.g., @magicui): @magicui
? Enter URL pattern (must include {name}): https://magicui.design/r/{name}.json

✅ Registry "@magicui" added successfully!
   URL: https://magicui.design/r/{name}.json
```

---

## Best Practices

### 1. Always Use @ Prefix

✅ **Do:**
```bash
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

❌ **Don't:**
```bash
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

### 2. Reference Known Registries

Use `--list` to see URLs for known registries:

```bash
npm run manage:registry -- --list
```

Then copy the URL:
```bash
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
```

### 3. Verify Registry URLs

Before adding a custom registry, verify:
- ✅ URL is accessible
- ✅ URL pattern includes `{name}` placeholder
- ✅ Registry serves valid shadcn component JSON

### 4. Remove Unused Registries

Keep `components.json` clean:

```bash
npm run manage:registry -- --remove=@unused-registry
```

---

## Troubleshooting

### Missing @ Prefix

**Error:**
```
❌ Invalid namespace "magicui".
   Namespace must start with @ (e.g., @magicui, @myteam)
```

**Fix:**
- Add `@` prefix: `--add=@magicui`

### Missing URL

**Error:**
```
❌ URL is required when adding a registry.
   Usage: npm run manage:registry -- --add=@namespace --url=https://registry.com/r/{name}.json
```

**Fix:**
- Provide both `--add` and `--url` when adding

### Invalid URL Format

**Error:**
```
❌ Invalid URL. Must be a valid URL containing {name} placeholder.
   Example: https://my-registry.com/r/{name}.json
```

**Fix:**
- Ensure URL is valid format
- Include `{name}` placeholder: `https://example.com/r/{name}.json`

### components.json Not Found

**Error:**
```
❌ Error: components.json not found. Run "npx shadcn@latest init" first.
```

**Fix:**
- Initialize shadcn/ui: `npx shadcn@latest init`
- Verify you're in the correct project directory

### Registry Already Exists

**Warning:**
```
⚠️  Registry "@magicui" already exists.
   Current URL: https://magicui.design/r/{name}.json
```

**Fix:**
- Registry is already configured, no action needed
- To update URL, remove and re-add: `npm run manage:registry -- --remove=@magicui`

### Registry Removal Failed

**Error:**
```
❌ Registry "@unknown" not found.
```

**Fix:**
- Use `--current` to list existing registries
- Verify namespace spelling (must include `@` prefix)

---

## Integration with Existing Scripts

### Using Registries with add:shadcn

After adding a registry, use it with the shadcn component script:

```bash
# Add registry
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json

# Add component from registry
npm run add:shadcn @magicui/marquee
npm run add:shadcn @magicui/globe
npm run add:shadcn @magicui/shimmer-button
```

### Multiple Registries

You can add multiple registries and use them interchangeably:

```bash
# Add multiple registries
npm run manage:registry -- --add=@magicui --url=https://magicui.design/r/{name}.json
npm run manage:registry -- --add=@aceternity --url=https://ui.aceternity.com/r/{name}.json

# Use components from different registries
npm run add:shadcn @magicui/marquee
npm run add:shadcn @aceternity/spotlight
npm run add:shadcn button  # Official shadcn (no prefix needed)
```

### Component Structure

Components from any registry are adapted to the same folder structure:

```
src/components/ui/marquee/
├── Marquee.tsx
├── Marquee.types.ts
└── Marquee.module.css (if needed)

tests/unit/components/ui/
└── Marquee.test.tsx
```

---

## Related Documentation

- **[12-ADD_SHADCN_COMPONENT.md](./12-ADD_SHADCN_COMPONENT.md)** - Add shadcn components
- **[06-CREATE_UI_COMPONENT.md](./06-CREATE_UI_COMPONENT.md)** - Create UI components manually
- **[07-DELETE_UI_COMPONENT.md](./07-DELETE_UI_COMPONENT.md)** - Delete UI components
- **[13-ANALYZE_UI_COMPONENTS.md](./13-ANALYZE_UI_COMPONENTS.md)** - Analyze UI components
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**manage-shadcn-registry.js provides:**
- ✅ Add registries with @namespace and URL
- ✅ Remove registries
- ✅ List available registries from shadcn website (with fallback)
- ✅ List current registries in components.json
- ✅ Interactive and CLI modes
- ✅ Strict validation (@ prefix, URL required)

**Registry Source:** https://ui.shadcn.com/r/registries.json

**Last Updated:** 2025-01-27
