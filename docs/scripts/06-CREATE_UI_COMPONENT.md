# Create UI Component Script

Complete documentation for the automated UI component creation script.

---

## Overview

**Script:** `scripts/create-ui-component.js`

**Command:** `npm run create:ui-component`

**Purpose:** Automate React UI component creation with TypeScript types, unit tests, and proper project structure.

**Component Type:** UI components only (reusable UI primitives, design system components)

**Safety Level:** ✅ Safe (validation, duplicate detection, automatic test generation)

---

## Usage

### Interactive Mode

```bash
npm run create:ui-component
```

### CLI Mode

```bash
npm run create:ui-component -- --name=<name> [--description=<desc>] [--css]
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--name=<name>` | Yes (CLI) | UI Component name in kebab-case |
| `--description=<desc>` | No | Component description (optional) |
| `--css` | No | Generate CSS module file (optional) |
| `--help` / `-h` | No | Show usage help |

---

## What It Does

### File Generation

**UI Component Creates:**
```
src/components/ui/[name]/
├── [Name].tsx           ← Component file
├── [Name].types.ts      ← TypeScript types
└── [Name].module.css    ← CSS module (optional, with --css)

tests/unit/components/ui/
└── [Name].test.tsx      ← Unit test file
```

---

## Examples

### Example 1: CLI Mode

```bash
$ npm run create:ui-component -- --name=accordion --description="Collapsible accordion"

✨ Create New UI Component (CLI Mode)

📦 Creating ui component...

  ✅ Created src/components/ui/accordion/
  ✅ Created src/components/ui/accordion/Accordion.tsx
  ✅ Created src/components/ui/accordion/Accordion.types.ts
  ✅ Created tests/unit/components/ui/Accordion.test.tsx

🎉 Success! UI component created!
```

### Example 2: Interactive Mode

```bash
$ npm run create:ui-component

✨ Create New UI Component

? UI Component name (kebab-case, e.g., accordion): button
? UI Component description (optional): Reusable button component
? Generate CSS module? (y/n): y

📦 Creating ui component...

  ✅ Created src/components/ui/button/
  ✅ Created src/components/ui/button/Button.tsx
  ✅ Created src/components/ui/button/Button.types.ts
  ✅ Created src/components/ui/button/Button.module.css
  ✅ Created tests/unit/components/ui/Button.test.tsx
```

---

## Best Practices

### When to Use UI Components

UI components are ideal for:
- Simple, reusable primitives
- Design system components
- Minimal props/components
- Generic/abstract components

**Examples:**
- `button` - Button component
- `input` - Input field
- `card` - Card container
- `modal` - Modal dialog
- `tooltip` - Tooltip component

**Note:** For complex business logic components, use `npm run create:component`. For composite components that compose multiple UI components, use `npm run create:block`.

---

## Related Documentation

- **[07-DELETE_UI_COMPONENT.md](./07-DELETE_UI_COMPONENT.md)** - Delete UI components
- **[04-CREATE_COMPONENT.md](./04-CREATE_COMPONENT.md)** - Create regular components
- **[14-CREATE_BLOCK.md](./14-CREATE_BLOCK.md)** - Create block components
- **[README.md](./README.md)** - Scripts overview

---

**Last Updated:** December 2025  
**Script Version:** 1.0.0

