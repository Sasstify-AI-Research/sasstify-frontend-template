# Create Block Script

Complete documentation for the automated block component creation script.

---

## Overview

**Script:** `scripts/create-block.js`

**Command:** `npm run create:block`

**Purpose:** Automate React block component creation with TypeScript types, unit tests, and proper project structure.

**Component Type:** Block components only (composite components that compose multiple UI components)

**Safety Level:** ✅ Safe (validation, duplicate detection, automatic test generation)

---

## Usage

### Interactive Mode

```bash
npm run create:block
```

### CLI Mode

```bash
npm run create:block -- --name=<name> [--description=<desc>] [--css]
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--name=<name>` | Yes (CLI) | Block Component name in kebab-case |
| `--description=<desc>` | No | Component description (optional) |
| `--css` | No | Generate CSS module file (optional) |
| `--help` / `-h` | No | Show usage help |

---

## What It Does

### File Generation

**Block Component Creates:**
```
src/components/blocks/[name]/
├── [Name].tsx           ← Component file
├── [Name].types.ts      ← TypeScript types
└── [Name].module.css    ← CSS module (optional, with --css)

tests/unit/components/blocks/
└── [Name].test.tsx      ← Unit test file
```

---

## Examples

### Example 1: CLI Mode

```bash
$ npm run create:block -- --name=hero-section --description="Hero section block"

✨ Create New Block Component (CLI Mode)

📦 Creating block component...

  ✅ Created src/components/blocks/hero-section/
  ✅ Created src/components/blocks/hero-section/HeroSection.tsx
  ✅ Created src/components/blocks/hero-section/HeroSection.types.ts
  ✅ Created tests/unit/components/blocks/HeroSection.test.tsx

🎉 Success! Block created!
```

### Example 2: Interactive Mode

```bash
$ npm run create:block

✨ Create New Block Component

? Block Component name (kebab-case, e.g., hero-section): feature-grid
? Block Component description (optional): Feature grid layout block
? Generate CSS module? (y/n): n

📦 Creating block component...

  ✅ Created src/components/blocks/feature-grid/
  ✅ Created src/components/blocks/feature-grid/FeatureGrid.tsx
  ✅ Created src/components/blocks/feature-grid/FeatureGrid.types.ts
  ✅ Created tests/unit/components/blocks/FeatureGrid.test.tsx
```

---

## Best Practices

### When to Use Block Components

Block components are ideal for:
- Composite components that compose multiple UI components
- Layout sections (hero, feature grid, content sections)
- Reusable page sections
- Components that combine UI primitives

**Examples:**
- `hero-section` - Hero banner with title, subtitle, CTA
- `feature-grid` - Grid of feature cards
- `content-section` - Content area with title and body
- `layout` - Page layout with header and footer

**Note:** For simple reusable UI primitives, use `npm run create:ui-component`. For complex business logic components, use `npm run create:component`.

---

## Related Documentation

- **[15-DELETE_BLOCK.md](./15-DELETE_BLOCK.md)** - Delete block components
- **[04-CREATE_COMPONENT.md](./04-CREATE_COMPONENT.md)** - Create regular components
- **[06-CREATE_UI_COMPONENT.md](./06-CREATE_UI_COMPONENT.md)** - Create UI components
- **[10-ANALYZE_BLOCKS.md](./10-ANALYZE_BLOCKS.md)** - Analyze block components
- **[README.md](./README.md)** - Scripts overview

---

**Last Updated:** December 2025  
**Script Version:** 1.0.0

