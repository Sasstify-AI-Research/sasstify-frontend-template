# Delete Component Script

Complete documentation for the automated component deletion script with usage analysis, cascade deletion, and npm dependency cleanup.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What It Does](#what-it-does)
- [Examples](#examples)
- [Safety Features](#safety-features)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Script:** `scripts/delete-component.js`

**Command:** `npm run delete:component`

**Purpose:** Safely delete React components with usage analysis, cascade deletion, npm dependency cleanup, and automatic cleanup of related files (tests, types).

**Safety Level:** ⚠️ Destructive (with safety checks)

---

## Usage

### Interactive Mode

```bash
npm run delete:component
```

### CLI Mode

```bash
npm run delete:component -- --name=<name> [--cascade] [--deps] [--yes]
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--name=<name>` | Yes (CLI) | Component name (e.g., `header` or `ui/accordion`) |
| `--yes` / `-y` | No | Skip confirmation prompts |
| `--cascade` | No | Enable cascade deletion of orphaned child components |
| `--deps` | No | Enable npm dependency cleanup |
| `--help` / `-h` | No | Show usage help |

**Note:** In CLI mode, cascade deletion and npm cleanup are **disabled by default**. Use `--cascade` and `--deps` flags to enable them. In interactive mode, these features are always available via prompts.

---

## What It Does

### 1. Component Discovery

**Scans and builds:**
- ✅ Complete component inventory
- ✅ Usage map (which components use which)
- ✅ Dependency graph

---

### 2. Usage Analysis

**Before deletion, checks:**
- ✅ Which pages use this component
- ✅ Which page sub-components use this component
- ✅ Which other components import this component
- ✅ Total usage count

**Prevents deletion if component is in use!**

---

### 3. Cascade Analysis

**Identifies orphaned components:**
- ✅ Components that become unused after deletion
- ✅ Offers cascade deletion for cleanup

**CLI Mode:** Requires `--cascade` flag to enable. In interactive mode, always prompts.

---

### 4. File Cleanup

**Deletes:**
- ✅ Component folder (`src/components/[name]/`)
- ✅ All component files (`.tsx`, `.types.ts`)
- ✅ Unit test files (`tests/unit/components/[Name].test.tsx`)
- ✅ UI component tests (`tests/unit/components/ui/[Name].test.tsx`)

---

### 5. NPM Dependency Cleanup

**Automatically detects and uninstalls:**
- ✅ npm packages used by the primary component being deleted
- ✅ npm packages used by cascaded (child) components
- ✅ Packages that become unused after deletion
- ✅ Runs `npm uninstall` for cleanup

**CLI Mode:** Requires `--deps` flag to enable. In interactive mode, always prompts.

**Note:** The script analyzes dependencies from ALL components being deleted (primary + cascade), ensuring complete cleanup.

---

## Examples

### Example 1: CLI Mode - Delete Unused Component (Basic)

Delete a component without cascade or dependency cleanup (default CLI behavior):

```bash
$ npm run delete:component -- --name=orphan-widget --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=orphan-widget --yes


🧹 Delete Component Script

Building component and usage maps...


Selected: orphan-widget

- Usage Analysis:

  ✓ No usages found - safe to delete!


🗑️  Deleting component...

  ✅ Deleted component orphan-widget
  ✅ Deleted test tests/unit/components/OrphanWidget.test.tsx

✅ Component deletion complete!
```

**Note:** Without `--cascade` and `--deps` flags, cascade analysis is skipped in CLI mode.

---

### Example 2: CLI Mode - Delete UI Component

```bash
$ npm run delete:component -- --name=ui/test-button --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=ui/test-button --yes


🧹 Delete Component Script

Building component and usage maps...


Selected: ui/test-button

- Usage Analysis:

  ✓ No usages found - safe to delete!

- Cascade Analysis:

  No cascade deletions needed.


🗑️  Deleting component...

  ✅ Deleted component ui/test-button
  ✅ Deleted test tests/unit/components/ui/TestButton.test.tsx

✅ Component deletion complete!
```

---

### Example 3: Component In Use by Another Component - Blocked

```bash
$ npm run delete:component -- --name=child-widget --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=child-widget --yes


🧹 Delete Component Script

Building component and usage maps...


Selected: child-widget

- Usage Analysis:

  Used by Components:
    • parent-widget

❌ Cannot delete: Component is still in use!
   Total usages: 1
```

---

### Example 4: Component In Use by Page - Blocked

When a component is imported and used in a page, deletion is blocked:

```bash
$ npm run delete:component -- --name=page-widget --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=page-widget --yes


🧹 Delete Component Script

Building component and usage maps...


Selected: page-widget

- Usage Analysis:

  Used in Pages:
    • index

  Used in Page Sub-Components:
    • index: index/Index.tsx

❌ Cannot delete: Component is still in use!
   Total usages: 2
```

**Note:** The script detects both:
- Direct page usage (in `src/pages/[name]/`)
- Page sub-component usage (components inside page folders)

---

### Example 5: Cascade Deletion (Interactive Mode)

When running in interactive mode, cascade deletion is offered via prompt:

```bash
$ npm run delete:component

> exit@1.0.0 delete:component
> node scripts/delete-component.js


🧹 Delete Component Script

Building component and usage maps...

Select a component to delete:
  1. parent-widget
  ...

Enter number: 1

Selected: parent-widget

- Usage Analysis:

  ✓ No usages found - safe to delete!

- Cascade Analysis:

  Unused components (safe to cascade delete):
    • child-widget

Delete component "parent-widget"? (y/n): y

🗑️  Deleting component...

  ✅ Deleted component parent-widget
  ✅ Deleted test tests/unit/components/ParentWidget.test.tsx

Delete 1 unused component(s)? (y/n): y

🧹 Deleting cascade components...

  ✅ Deleted component child-widget
  ✅ Deleted test tests/unit/components/ChildWidget.test.tsx

✅ Component deletion complete!
```

**Note:** In interactive mode, cascade and dependency cleanup are always available via prompts.

---

### Example 6: NPM Dependency Cleanup (Interactive Mode)

When running in interactive mode, npm dependency cleanup is offered via prompt:

```bash
$ npm run delete:component

> exit@1.0.0 delete:component
> node scripts/delete-component.js


🧹 Delete Component Script

Building component and usage maps...

Select a component to delete:
  1. animated-box
  ...

Enter number: 1

Selected: animated-box

- Usage Analysis:

  ✓ No usages found - safe to delete!

- Cascade Analysis:

  Unused npm dependencies (safe to uninstall):
    • framer-motion

Delete component "animated-box"? (y/n): y

🗑️  Deleting component...

  ✅ Deleted component animated-box
  ✅ Deleted test tests/unit/components/AnimatedBox.test.tsx

Uninstall 1 unused npm dependency(ies)? (y/n): y

📦 Uninstalling dependencies...

removed 3 packages, and audited 512 packages in 903ms

✅ Successfully uninstalled dependencies!

✅ Component deletion complete!
```

**Note:** The script analyzes all source files to determine if an npm package is still used elsewhere before uninstalling.

---

### Example 7: Cascade NPM Dependency Cleanup (Interactive Mode)

When deleting a parent component that uses child components, npm dependencies from **all** components (parent + cascaded children) are detected and uninstalled:

**Setup:**
```
data-card (parent) → uses lodash
├── imports → data-text (child) → uses dayjs
└── imports → ui/data-badge (UI child) → uses uuid
```

In interactive mode, all features are available via prompts:

```bash
$ npm run delete:component

> exit@1.0.0 delete:component
> node scripts/delete-component.js


🧹 Delete Component Script

Building component and usage maps...

Select a component to delete:
  1. data-card
  ...

Enter number: 1

Selected: data-card

- Usage Analysis:

  ✓ No usages found - safe to delete!

- Cascade Analysis:

  Unused npm dependencies (safe to uninstall):
    • dayjs
    • lodash
    • uuid

  Unused components (safe to cascade delete):
    • data-text
    • ui/data-badge

Delete component "data-card"? (y/n): y

🗑️  Deleting component...

  ✅ Deleted component data-card
  ✅ Deleted test tests/unit/components/DataCard.test.tsx

Delete 2 unused component(s)? (y/n): y

🧹 Deleting cascade components...

  ✅ Deleted component data-text
  ✅ Deleted test tests/unit/components/DataText.test.tsx
  ✅ Deleted component ui/data-badge
  ✅ Deleted test tests/unit/components/ui/DataBadge.test.tsx

Uninstall 3 unused npm dependency(ies)? (y/n): y

📦 Uninstalling dependencies...

removed 3 packages, and audited 516 packages in 1s

✅ Successfully uninstalled dependencies!

✅ Component deletion complete!
```

**Key Features:**
- `lodash` - detected from parent component (`data-card`)
- `dayjs` - detected from cascaded child component (`data-text`)
- `uuid` - detected from cascaded UI child component (`ui/data-badge`)
- All 3 packages uninstalled in a single operation

---

### Example 8: Component Not Found

```bash
$ npm run delete:component -- --name=non-existent --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=non-existent --yes


🧹 Delete Component Script

Building component and usage maps...

❌ Component "non-existent" not found!

Available components:
  • footer
  • header
  • layout
  • section
  • viewport-lazy-load
```

---

### Example 9: CLI Mode with Cascade Only

Delete a component with cascade deletion enabled but without npm dependency cleanup:

```bash
$ npm run delete:component -- --name=parent-widget --cascade --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=parent-widget --cascade --yes


🧹 Delete Component Script

Building component and usage maps...


Selected: parent-widget

- Usage Analysis:

  ✓ No usages found - safe to delete!

- Cascade Analysis:

  Unused components (safe to cascade delete):
    • child-widget


🗑️  Deleting component...

  ✅ Deleted component parent-widget
  ✅ Deleted test tests/unit/components/ParentWidget.test.tsx

🧹 Deleting cascade components...

  ✅ Deleted component child-widget
  ✅ Deleted test tests/unit/components/ChildWidget.test.tsx

✅ Component deletion complete!
```

---

### Example 10: CLI Mode with Deps Only

Delete a component with npm dependency cleanup enabled but without cascade deletion:

```bash
$ npm run delete:component -- --name=animated-box --deps --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=animated-box --deps --yes


🧹 Delete Component Script

Building component and usage maps...


Selected: animated-box

- Usage Analysis:

  ✓ No usages found - safe to delete!

- Cascade Analysis:

  Unused npm dependencies (safe to uninstall):
    • framer-motion


🗑️  Deleting component...

  ✅ Deleted component animated-box
  ✅ Deleted test tests/unit/components/AnimatedBox.test.tsx

📦 Uninstalling dependencies...

removed 3 packages, and audited 512 packages in 903ms

✅ Successfully uninstalled dependencies!

✅ Component deletion complete!
```

---

### Example 11: CLI Mode with Full Cleanup

Delete a component with both cascade deletion and npm dependency cleanup enabled:

```bash
$ npm run delete:component -- --name=data-card --cascade --deps --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=data-card --cascade --deps --yes


🧹 Delete Component Script

Building component and usage maps...


Selected: data-card

- Usage Analysis:

  ✓ No usages found - safe to delete!

- Cascade Analysis:

  Unused npm dependencies (safe to uninstall):
    • dayjs
    • lodash
    • uuid

  Unused components (safe to cascade delete):
    • data-text
    • ui/data-badge


🗑️  Deleting component...

  ✅ Deleted component data-card
  ✅ Deleted test tests/unit/components/DataCard.test.tsx

🧹 Deleting cascade components...

  ✅ Deleted component data-text
  ✅ Deleted test tests/unit/components/DataText.test.tsx
  ✅ Deleted component ui/data-badge
  ✅ Deleted test tests/unit/components/ui/DataBadge.test.tsx

📦 Uninstalling dependencies...

removed 3 packages, and audited 516 packages in 1s

✅ Successfully uninstalled dependencies!

✅ Component deletion complete!
```

---

### Example 12: Component Not Found

```bash
$ npm run delete:component -- --name=non-existent --yes

> exit@1.0.0 delete:component
> node scripts/delete-component.js --name=non-existent --yes


🧹 Delete Component Script

Building component and usage maps...

❌ Component "non-existent" not found!

Available components:
  • footer
  • header
  • layout
  • section
  • viewport-lazy-load
```

---

### Example 13: Help Command

```bash
$ npm run delete:component -- --help

> exit@1.0.0 delete:component
> node scripts/delete-component.js --help


Usage: npm run delete:component [options]

Options:
  --name=<name>     Component name (e.g., "header" or "ui/accordion")
  --yes / -y        Skip confirmation prompts
  --cascade         Enable cascade deletion of orphaned child components
  --deps            Enable npm dependency cleanup

Examples:
  npm run delete:component
  npm run delete:component -- --name=header --yes
  npm run delete:component -- --name=ui/accordion
  npm run delete:component -- --name=parent --cascade --deps --yes
```

---

### Example 10: Interactive Mode

```bash
$ npm run delete:component

🧹 Delete Component Script

Building component and usage maps...

? Select component to delete:
❯ footer
  header
  layout
  section
  ui/accordion
  viewport-lazy-load

Selected: footer

- Usage Analysis:

  ✓ No usages found - safe to delete!

? Are you sure you want to delete "footer"? (y/N) y

🗑️  Deleting component...

  ✅ Deleted component footer
  ✅ Deleted test tests/unit/components/Footer.test.tsx

✅ Component deletion complete!
```

---

## Safety Features

### 1. Usage Detection

**Prevents accidental deletion of components in use:**

| Check | Description |
|-------|-------------|
| Page imports | Scans all pages for component imports |
| Page sub-components | Scans components inside page folders |
| Component imports | Scans all components for cross-imports |
| Total count | Shows exact usage count |

**Example output when component is used by a page:**
```
- Usage Analysis:

  Used in Pages:
    • index
    • dashboard

  Used in Page Sub-Components:
    • index: index/Index.tsx
```

---

### 2. Confirmation Prompts

**Interactive mode asks for confirmation before deletion.**

Use `--yes` to skip in CI/CD or automation.

---

### 3. Cascade Analysis

**Identifies components that become orphaned:**
- Shows which components will become unused
- Offers to delete them automatically
- Prevents orphaned code in your codebase

---

### 4. Component Grouping

**Interactive mode groups components by type:**

```
Regular Components:
  • footer
  • header
  • layout

UI Components:
  • ui/accordion
  • ui/button
  • ui/modal
```

---

### 5. NPM Dependency Cleanup

**Automatically detects unused npm packages from ALL components being deleted:**

| Feature | Description |
|---------|-------------|
| Dependency scanning | Analyzes imports across all source files |
| Primary component | Detects packages used by the component being deleted |
| Cascade components | Detects packages used by child components being cascade deleted |
| Unused detection | Identifies packages that become unused after deletion |
| Auto uninstall | Runs `npm uninstall` for cleanup |

**Example output (with cascade dependencies):**
```
- Cascade Analysis:

  Unused npm dependencies (safe to uninstall):
    • lodash      (from parent: data-card)
    • dayjs       (from cascade: data-text)
    • uuid        (from cascade: ui/data-badge)

  Unused components (safe to cascade delete):
    • data-text
    • ui/data-badge

📦 Uninstalling dependencies...

removed 3 packages, and audited 516 packages in 1s

✅ Successfully uninstalled dependencies!
```

**Note:** Dependencies from cascaded child components are included in the cleanup analysis.

---

## Component Naming

### Regular Components

```bash
npm run delete:component -- --name=user-card --yes
```

### UI Components

```bash
npm run delete:component -- --name=ui/accordion --yes
```

**Note:** UI components use the `ui/` prefix to indicate their location in `src/components/ui/`.

---

## Files Deleted

### Regular Component

```
Deleted:
├── src/components/[name]/
│   ├── [Name].tsx
│   └── [Name].types.ts
└── tests/unit/components/[Name].test.tsx
```

### UI Component

```
Deleted:
├── src/components/ui/[name]/
│   └── index.tsx
└── tests/unit/components/ui/[Name].test.tsx
```

---

## Best Practices

### Before Deleting

✅ **DO:**
- Check if component is used elsewhere
- Review cascade deletion list
- Commit changes before bulk deletions
- Use `--yes` only in CI/CD pipelines

❌ **DON'T:**
- Delete shared UI components without checking
- Skip the usage analysis warnings
- Force delete components that are in use

---

### When to Delete

| Scenario | Action |
|----------|--------|
| Component is unused | Safe to delete |
| Component is deprecated | Update usages first |
| Refactoring | Delete after migration |
| Feature removal | Delete page first, then components |

---

### Cleanup Workflow

**Recommended order for feature removal:**

1. Delete the page (removes page usage)
2. Delete orphaned components (cascade deletion)
3. Run tests to verify no broken imports
4. Commit changes

```bash
# Step 1: Delete page
npm run delete:page -- --name=profile --yes

# Step 2: Delete orphaned components (automatic cascade)
npm run delete:component -- --name=profile-card --yes

# Step 3: Verify
npm run type-check
npm run test
```

---

## Troubleshooting

### Issue: Component Not Found

**Error:** `Component "xyz" not found!`

**Solutions:**
```bash
# 1. Check exact name
npm run delete:component
# Use interactive mode to see available components

# 2. For UI components, use ui/ prefix
npm run delete:component -- --name=ui/button --yes
# NOT: --name=button

# 3. Check component exists
ls src/components/
ls src/components/ui/
```

---

### Issue: Cannot Delete - In Use

**Error:** `Cannot delete: Component is still in use!`

**Solutions:**
1. Check which files use the component (shown in output)
2. Update those files to remove the import
3. Re-run the delete command

```bash
# Find usages manually
grep -r "import.*ComponentName" src/
```

---

### Issue: Test Files Not Deleted

**Symptoms:** Component deleted but test file remains

**Solutions:**
```bash
# Manually check test location
ls tests/unit/components/

# For UI components
ls tests/unit/components/ui/

# Delete manually if needed
rm tests/unit/components/ComponentName.test.tsx
```

---

### Issue: Cascade Deletion Not Working

**Symptoms:** Orphaned components not deleted

**Possible causes:**
- Components used by other components not in cascade
- Components used by pages

**Solutions:**
1. Delete parent components first
2. Check for hidden usages in pages
3. Run delete:component again for remaining orphans

---

### Issue: NPM Dependencies Not Uninstalled

**Symptoms:** Deleted component but npm package still in package.json

**Possible causes:**
- Package is used by other files in the project (pages, other components)
- Package is a protected dependency (react, react-dom, vite, etc.)

**Solutions:**
```bash
# Check if package is used elsewhere
grep -r "from 'package-name'" src/

# Check pages
grep -r "from 'package-name'" src/pages/

# Manually uninstall if truly unused
npm uninstall package-name
```

**Note:** The script now detects dependencies from both the primary component AND all cascaded child components.

---

## Script Details

### File Location
```
scripts/delete-component.js
```

### Key Functions

| Function | Description |
|----------|-------------|
| `findUnusedComponents()` | Identifies orphaned components |
| `findUnusedDependencies()` | Identifies unused npm packages |
| `deleteComponentFolder()` | Removes component directory |
| `deleteComponentUnitTests()` | Removes test files |
| `buildGroupedComponentList()` | Groups components by type |
| `getGroupName()` | Determines component group |

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Error (component not found, in use, etc.) |

---

## Related Documentation

- **[04-CREATE_COMPONENT.md](./04-CREATE_COMPONENT.md)** - Create components
- **[02-CREATE_PAGE.md](./02-CREATE_PAGE.md)** - Create pages
- **[03-DELETE_PAGE.md](./03-DELETE_PAGE.md)** - Delete pages
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**delete-component.js provides:**
- ✅ Safe component deletion with usage checks
- ✅ Interactive or CLI mode
- ✅ Cascade deletion of orphaned components
- ✅ Automatic test file cleanup
- ✅ Component grouping (Regular vs UI)
- ✅ Detailed usage analysis (pages & components)
- ✅ Page sub-component usage detection
- ✅ Automatic npm dependency cleanup (primary + cascade components)

**Perfect for:**
- Safe cleanup of unused components
- Feature removal workflows
- Codebase maintenance
- Preventing orphaned code
- Keeping dependencies clean (including from child components)

---

**Last Updated:** November 2025  
**Script Version:** 1.0.0

