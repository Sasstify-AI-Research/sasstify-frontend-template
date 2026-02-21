# Add shadcn Component Script

Complete documentation for the automated shadcn component adapter script.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What It Does](#what-it-does)
- [Component Adaptation Process](#component-adaptation-process)
- [Repository Selection](#repository-selection)
- [Type Extraction](#type-extraction)
- [Style Extraction](#style-extraction)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Integration with Existing Scripts](#integration-with-existing-scripts)

---

## Overview

**Script:** `scripts/add-shadcn-component.js`

**Command:** `npm run add:shadcn`

**Purpose:** Automatically adapt shadcn/ui components to the project's folder-based structure with types extraction, CSS module generation, and test file creation.

**Safety Level:** ✅ Safe (validation, duplicate detection, automatic adaptation)

---

## Usage

### Basic Usage

```bash
npm run add:shadcn button
```

### Multiple Components

```bash
npm run add:shadcn button card dialog
```

### With Custom Registry

```bash
npm run add:shadcn button --registry=https://github.com/custom/shadcn-registry
```

### With Repository Name

```bash
npm run add:shadcn button --repo=official
```

### Interactive Mode

```bash
npm run add:shadcn button
# Will prompt for repository selection if not specified
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| Component name(s) | Yes | Component name(s) in kebab-case (e.g., `button`, `card`) |
| `--registry=<url>` | No | Custom shadcn registry URL |
| `--repo=<name>` | No | Repository name: `default`, `official`, or `shadcn` |
| `--help` / `-h` | No | Show usage help |

---

## What It Does

### 1. Validation

**Checks:**
- ✅ Component name follows kebab-case format
- ✅ Component doesn't already exist in adapted structure
- ✅ Component name is provided

**Validation Rules:**
- Name: lowercase letters, numbers, hyphens only
- Must start with a letter
- No special characters or spaces
- Automatically converts non-kebab-case to kebab-case

---

### 2. Repository Selection

The script supports multiple ways to specify the shadcn registry:

**CLI Arguments:**
- `--registry=<url>` - Direct registry URL
- `--repo=<name>` - Known repository name (default, official, shadcn)

**Interactive Mode:**
- Prompts for repository selection if not specified
- Options: Default (shadcn/ui official) or Custom URL

---

### 3. Component Adaptation Process

The script performs the following steps:

1. **Runs shadcn CLI** - Adds component via `npx shadcn@latest add`
2. **Reads Generated Component** - Reads the flat file created by shadcn
3. **Extracts Types** - Parses and extracts TypeScript interfaces/types
4. **Extracts Styles** - Detects Tailwind classes and creates CSS module if needed
5. **Reorganizes Structure** - Moves component to folder-based structure
6. **Updates Imports** - Updates import statements to use new structure
7. **Generates Test File** - Creates unit test file
8. **Displays Summary** - Shows what was created and next steps

---

## Component Adaptation Process

### Before Adaptation

shadcn adds components as flat files:

```
src/components/ui/
└── button.tsx          ← Flat file with everything
```

### After Adaptation

Components are reorganized to folder structure:

```
src/components/ui/button/
├── Button.tsx          ← Component file
├── Button.types.ts     ← Extracted types
└── Button.module.css   ← CSS module (if styles detected)

tests/unit/components/ui/
└── Button.test.tsx     ← Unit test file
```

---

## Repository Selection

### Default Registry

If no registry is specified, uses the official shadcn/ui registry:

```bash
npm run add:shadcn button
```

### Custom Registry URL

Use a custom registry:

```bash
npm run add:shadcn button --registry=https://github.com/custom/shadcn-registry
```

### Known Repository Names

Use predefined repository names:

```bash
npm run add:shadcn button --repo=official
npm run add:shadcn button --repo=default
npm run add:shadcn button --repo=shadcn
```

### Interactive Selection

When running without registry flags, the script prompts:

```
📦 Repository Selection:
  1. Default (shadcn/ui official)
  2. Custom URL
? Select option (1-2):
```

---

## Type Extraction

The script automatically extracts TypeScript types from shadcn components:

**Extracted Types:**
- `export interface ComponentProps`
- `export type ComponentProps`
- JSDoc comments above interfaces
- Complex types (unions, generics, extended interfaces)

**Example:**

**Original (in flat file):**
```typescript
export interface ButtonProps {
  variant?: "default" | "destructive";
  size?: "sm" | "md" | "lg";
}
```

**Extracted (Button.types.ts):**
```typescript
export interface ButtonProps {
  variant?: "default" | "destructive";
  size?: "sm" | "md" | "lg";
}
```

**Updated Component:**
```typescript
import { ButtonProps } from './Button.types';
```

---

## Style Extraction

The script detects styles and creates CSS modules when needed:

**Detection:**
- Scans for `className` props with Tailwind classes
- Checks for inline `style` props
- Identifies common Tailwind patterns

**CSS Module Creation:**
- Creates `[Component].module.css` file
- Adds import statement to component
- Provides template for custom styles

**Example:**

**Detected Styles:**
```typescript
<button className="flex items-center gap-2 px-4 py-2">
```

**Generated CSS Module:**
```css
/* Button Component Styles */

.container {
  /* Add your styles here */
}
```

**Updated Component:**
```typescript
import styles from './Button.module.css';
```

---

## Examples

### Example 1: Add Single Component

```bash
npm run add:shadcn button
```

**Output:**
```
✨ Adapting shadcn component: button

📥 Running: npx shadcn@latest add button

🎉 Success! Component adapted!

📁 Created files:
   - src/components/ui/button/Button.tsx
   - src/components/ui/button/Button.types.ts
   - src/components/ui/button/Button.module.css
   - tests/unit/components/ui/Button.test.tsx

🚀 Next steps:
  1. Import: import { Button } from '@/components/ui/button/Button'
  2. Customize component in src/components/ui/button/Button.tsx
  3. Update types in src/components/ui/button/Button.types.ts
  4. Add styles in src/components/ui/button/Button.module.css
  5. Run tests: npm test
```

### Example 2: Add Multiple Components

```bash
npm run add:shadcn button card dialog
```

Adds all three components sequentially.

### Example 3: Custom Registry

```bash
npm run add:shadcn button --registry=https://github.com/myorg/shadcn-registry
```

### Example 4: Component Already Exists

```bash
npm run add:shadcn button
# ❌ Component "button" already exists in adapted structure at src/components/ui/button/
```

---

## Best Practices

### 1. Use Official Registry by Default

✅ **Do:**
```bash
npm run add:shadcn button
```

❌ **Don't:**
```bash
# Don't use custom registry unless necessary
npm run add:shadcn button --registry=https://...
```

### 2. Add Components One at a Time

✅ **Do:**
```bash
npm run add:shadcn button
npm run add:shadcn card
```

❌ **Don't:**
```bash
# Don't add all components at once
npm run add:shadcn button card dialog accordion alert badge ...
```

### 3. Review Adapted Components

After adaptation:
- ✅ Review extracted types
- ✅ Check CSS module if created
- ✅ Update test file if needed
- ✅ Customize component as needed

### 4. Use Existing Delete Script

To remove adapted components:
```bash
npm run delete:component -- --name=ui/button
```

---

## Troubleshooting

### Component Not Found

**Error:**
```
❌ Failed to add component via shadcn CLI: Component not found
```

**Fix:**
- Check component name spelling
- Verify component exists in registry
- Try with official registry: `npm run add:shadcn button --repo=official`

### Component Already Exists

**Error:**
```
❌ Component "button" already exists in adapted structure
```

**Fix:**
- Delete existing component: `npm run delete:component -- --name=ui/button`
- Or use a different component name

### Import Errors

**Error:**
```
Cannot find module '@/components/ui/button/Button'
```

**Fix:**
- Verify component was adapted correctly
- Check file structure matches expected format
- Restart TypeScript server

### Registry Issues

**Error:**
```
Failed to fetch from registry
```

**Fix:**
- Check internet connection
- Verify registry URL is correct
- Try default registry: `npm run add:shadcn button --repo=official`

### Type Extraction Issues

**Symptoms:** Types not extracted correctly

**Fix:**
- Manually review `[Component].types.ts`
- Check original component file structure
- Extract types manually if needed

---

## Integration with Existing Scripts

### Component Structure Compatibility

Adapted shadcn components follow the exact same folder structure as `create-component.js`:
- `src/components/ui/[component]/[Component].tsx`
- `src/components/ui/[component]/[Component].types.ts`
- `src/components/ui/[component]/[Component].module.css`

This ensures 100% compatibility with all existing scripts.

### Component Deletion

Use the existing delete script:

```bash
npm run delete:component -- --name=ui/button
```

The script automatically handles:
- Component file deletion
- Types file deletion
- CSS module deletion
- Test file deletion

### Component Analysis

Adapted components work seamlessly with analysis scripts:

```bash
npm run analyze:components
```

**Features:**
- ✅ Detects adapted shadcn components
- ✅ Tracks dependencies
- ✅ Usage analysis
- ✅ Orphan detection

No special handling needed - components follow the same structure pattern.

---

## Related Documentation

- **[04-CREATE_COMPONENT.md](./04-CREATE_COMPONENT.md)** - Create components manually
- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Delete components
- **[09-ANALYZE_COMPONENTS.md](./09-ANALYZE_COMPONENTS.md)** - Analyze components
- **[README.md](./README.md)** - Scripts overview
- **[../quick-start/07-using-shadcn-ui.md](../quick-start/07-using-shadcn-ui.md)** - Using shadcn/ui components

---

## Summary

**add-shadcn-component.js provides:**
- ✅ Automatic adaptation of shadcn components
- ✅ Type extraction to separate files
- ✅ CSS module generation
- ✅ Test file generation
- ✅ Repository selection support
- ✅ Full compatibility with existing scripts

**Time saved:** 10-15 minutes per component

**Last Updated:** 2025-01-27

