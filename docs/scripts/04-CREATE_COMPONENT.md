# Create Component Script (Regular Components)

Complete documentation for the automated regular component creation script.

---

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [What It Does](#what-it-does)
- [Generated Content](#generated-content)
- [Examples](#examples)
- [Validation](#validation)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Script:** `scripts/create-component.js`

**Command:** `npm run create:component`

**Purpose:** Automate React regular component creation with TypeScript types, unit tests, and proper project structure.

**Component Type:** Regular components only (for UI components, use `create:ui-component`; for blocks, use `create:block`)

**Safety Level:** ✅ Safe (validation, duplicate detection, automatic test generation)

---

## Usage

### Interactive Mode

```bash
npm run create:component
```

### CLI Mode

```bash
npm run create:component -- --name=<name> [--description=<desc>] [--css]
```

### CLI Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--name=<name>` | Yes (CLI) | Component name in kebab-case |
| `--description=<desc>` | No | Component description (optional) |
| `--css` | No | Generate CSS module file (optional) |
| `--help` / `-h` | No | Show usage help |

---

## What It Does

### 1. Validation

**Checks:**
- ✅ Component name follows kebab-case format
- ✅ Component doesn't already exist
- ✅ Required arguments provided (CLI mode)

**Validation Rules:**
- Name: lowercase letters, numbers, hyphens only
- Must start with a letter
- No special characters or spaces
- Automatically converts non-kebab-case to kebab-case

---

### 2. File Generation

**Regular Component Creates:**
```
src/components/[name]/
├── [Name].tsx           ← Component file
├── [Name].types.ts      ← TypeScript types
└── [Name].module.css    ← CSS module (optional, with --css)

tests/unit/components/
└── [Name].test.tsx      ← Unit test file
```

**Note:** For UI components, use `npm run create:ui-component`. For block components, use `npm run create:block`.

---

## Generated Content

### Component Files

#### 1. `[Name].tsx`

```typescript
import React from 'react';
import { UserCardProps } from './UserCard.types';

/**
 * UserCard component
 */
const UserCard: React.FC<UserCardProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default UserCard;
```

---

#### 2. `[Name].types.ts`

```typescript
/**
 * UserCard Component Types
 */

import { ReactNode } from 'react';

export interface UserCardProps {
  /**
   * Child elements to render inside the component
   */
  children?: ReactNode;
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}
```

---

#### 3. `[Name].test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserCard from '@/components/user-card/UserCard';

describe('UserCard', () => {
  it('renders without crashing', () => {
    render(<UserCard />);
  });

  it('renders children correctly', () => {
    render(<UserCard>Test Content</UserCard>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<UserCard className="custom-class">Content</UserCard>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

---

## Examples

### Example 1: CLI Mode

```bash
$ npm run create:component -- --name=demo-card --description="A demo card component"

> exit@1.0.0 create:component
> node scripts/create-component.js --name=demo-card --description=A demo card component


✨ Create New Regular Component (CLI Mode)


📦 Creating regular component...

  ✅ Created src/components/demo-card/
  ✅ Created src/components/demo-card/DemoCard.tsx
  ✅ Created src/components/demo-card/DemoCard.types.ts
  ✅ Created tests/unit/components/DemoCard.test.tsx

🎉 Success! Component created!

📁 Created files:
   - src/components/demo-card/DemoCard.tsx
   - src/components/demo-card/DemoCard.types.ts
   - tests/unit/components/DemoCard.test.tsx

🚀 Next steps:
  1. Edit src/components/demo-card/DemoCard.tsx
  2. Update types in src/components/demo-card/DemoCard.types.ts
  3. Import: import DemoCard from '@/components/demo-card/DemoCard'
  4. Run tests: npm test
```

---

### Example 2: Interactive Mode

```bash
$ npm run create:component

✨ Create New Regular Component

? Component name (kebab-case, e.g., user-card): profile-card
? Component description (optional): User profile card component
? Generate CSS module? (y/n): n

📦 Creating regular component...

  ✅ Created src/components/profile-card/
  ✅ Created src/components/profile-card/ProfileCard.tsx
  ✅ Created src/components/profile-card/ProfileCard.types.ts
  ✅ Created tests/unit/components/ProfileCard.test.tsx

🎉 Success! Component created!

📁 Created files:
   - src/components/profile-card/ProfileCard.tsx
   - src/components/profile-card/ProfileCard.types.ts
   - tests/unit/components/ProfileCard.test.tsx

🚀 Next steps:
  1. Edit src/components/profile-card/ProfileCard.tsx
  2. Update types in src/components/profile-card/ProfileCard.types.ts
  3. Import: import ProfileCard from '@/components/profile-card/ProfileCard'
  4. Run tests: npm test
```

---

### Example 3: Duplicate Detection

```bash
$ npm run create:component -- --name=demo-card

> exit@1.0.0 create:component
> node scripts/create-component.js --name=demo-card


✨ Create New Regular Component (CLI Mode)

❌ The regular component "demo-card" already exists at /path/to/src/components/demo-card!
```

---

### Example 4: CLI Mode - Component with CSS Module

```bash
$ npm run create:component -- --name=styled-card --css

✨ Create New Regular Component (CLI Mode)


📦 Creating regular component...

  ✅ Created src/components/styled-card/
  ✅ Created src/components/styled-card/StyledCard.tsx
  ✅ Created src/components/styled-card/StyledCard.types.ts
  ✅ Created src/components/styled-card/StyledCard.module.css
  ✅ Created tests/unit/components/StyledCard.test.tsx

🎉 Success! Component created!

📁 Created files:
   - src/components/styled-card/StyledCard.tsx
   - src/components/styled-card/StyledCard.types.ts
   - src/components/styled-card/StyledCard.module.css
   - tests/unit/components/StyledCard.test.tsx

🚀 Next steps:
  1. Edit src/components/styled-card/StyledCard.tsx
  2. Update types in src/components/styled-card/StyledCard.types.ts
  3. Add styles in src/components/styled-card/StyledCard.module.css
  4. Import: import StyledCard from '@/components/styled-card/StyledCard'
  5. Run tests: npm test
```

---

### Example 5: Help Command

```bash
$ npm run create:component -- --help

> exit@1.0.0 create:component
> node scripts/create-component.js --help


Usage: npm run create:component [options]

Options:
  --name=<name>           Component name in kebab-case (required for non-interactive)
  --description=<desc>    Component description (optional)
  --css                   Generate CSS module file (optional)

Examples:
  npm run create:component
  npm run create:component -- --name=user-card --description="User profile card"
  npm run create:component -- --name=card --css
```

---

### Example 6: Running Generated Tests

```bash
$ npm run test

> exit@1.0.0 test
> vitest run


 RUN  v2.1.9 /path/to/project

 ✓ tests/unit/components/DemoCard.test.tsx (3 tests) 15ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:48:32
   Duration  4.06s
```

---

## Validation

### Component Name Validation

**Rules:**
- ✅ Starts with lowercase letter
- ✅ Contains only: lowercase letters, numbers, hyphens
- ✅ No spaces or special characters
- ✅ kebab-case format

**Valid Examples:**
```
✅ user-card
✅ profile-header
✅ data-table-2
✅ accordion
```

**Invalid Examples:**
```bash
? Component name: UserCard
# Automatically converted to: user-card

? Component name: user_card
❌ Component name must be kebab-case (lowercase, hyphens only)

? Component name: user card
❌ Component name must be kebab-case (lowercase, hyphens only)
```

**Note:** This script creates regular components only. For UI components, use `npm run create:ui-component`. For block components, use `npm run create:block`.

---

### Duplicate Detection

**Prevents overwriting existing components:**

```bash
$ npm run create:component -- --name=header

❌ The regular component "header" already exists at /path/to/src/components/header!
```

The script checks if the component directory already exists and prevents creation.

---

## Best Practices

### When to Use Regular Components

Regular components are ideal for:
- Complex business logic
- Feature-specific components
- Components with multiple props/state
- Domain-specific functionality

**Examples:**
- `user-profile` - User profile display
- `checkout-form` - Checkout process
- `dashboard-widget` - Dashboard features

**Note:** For reusable UI primitives, use `npm run create:ui-component`. For composite components that compose multiple UI components, use `npm run create:block`.

---

### Naming Conventions

#### Component Names

✅ **Good Examples:**
```
user-card        → Clear, descriptive
profile-header   → Specific purpose
data-table       → Standard naming
accordion        → Simple, clear
```

❌ **Bad Examples:**
```
UserCard         → Not kebab-case (will be converted)
user_card        → Underscores not allowed
component1       → Not descriptive
myComponent      → camelCase not allowed
```

---

### After Creating

✅ **DO:**
- Edit the generated component to add your logic
- Update TypeScript types as needed
- Run tests to verify everything works
- Import and use in your pages/components

❌ **DON'T:**
- Keep the default placeholder content in production
- Skip running tests after creation
- Forget to update types when adding props

---

## Troubleshooting

### Issue: Script Won't Run

**Error:** `Permission denied` or `command not found`

**Solutions:**
```bash
# Option 1: Make script executable
chmod +x scripts/create-component.js

# Option 2: Run with node directly
node scripts/create-component.js

# Option 3: Check npm script exists
cat package.json | grep "create:component"
```

---

### Issue: Tests Not Found

**Symptoms:**
- Component created but tests don't run
- `npm test` shows no tests

**Solutions:**
```bash
# 1. Check test file exists
ls tests/unit/components/

# 2. For UI components
ls tests/unit/components/ui/

# 3. Run specific test
npm test -- --run tests/unit/components/YourComponent.test.tsx
```

---

### Issue: Import Path Errors

**Error:** `Cannot find module '@/components/...'`

**Solutions:**
```typescript
// Regular component - correct import
import UserCard from '@/components/user-card/UserCard';

// Wrong - missing component name
import UserCard from '@/components/user-card';  // ❌
```

---

### Issue: TypeScript Errors

**Common Errors:**

```typescript
// Error: Cannot find module './YourComponent.types'
// Solution: Check file was created in correct location

// Error: Property 'x' does not exist on type 'Props'
// Solution: Update the .types.ts file with your props
```

---

## Script Details

### File Location
```
scripts/create-component.js
```

### Dependencies
- `fs` - File system operations
- `path` - Path manipulation
- `readline` - Interactive CLI prompts
- `./utils/cli.js` - CLI utilities (parseArgs, toPascalCase, etc.)

### Exit Codes
- `0` - Success
- `1` - Error occurred (validation failed, component exists, etc.)

---

## Related Documentation

- **[05-DELETE_COMPONENT.md](./05-DELETE_COMPONENT.md)** - Delete regular components
- **[CREATE_UI_COMPONENT.md](./06-CREATE_UI_COMPONENT.md)** - Create UI components
- **[DELETE_UI_COMPONENT.md](./07-DELETE_UI_COMPONENT.md)** - Delete UI components
- **[CREATE_BLOCK.md](./08-CREATE_BLOCK.md)** - Create block components
- **[DELETE_BLOCK.md](./09-DELETE_BLOCK.md)** - Delete block components
- **[02-CREATE_PAGE.md](./02-CREATE_PAGE.md)** - Create pages
- **[03-DELETE_PAGE.md](./03-DELETE_PAGE.md)** - Delete pages
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**create-component.js provides:**
- ✅ Interactive CLI for easy regular component creation
- ✅ CLI mode for automation/scripting
- ✅ Automatic TypeScript types generation (separate file)
- ✅ Optional CSS module generation (`--css` flag)
- ✅ Automatic unit test generation
- ✅ Validation and duplicate detection
- ✅ Proper project structure

**Perfect for:**
- Rapid regular component development
- Consistent component structure
- Reducing boilerplate code
- Ensuring test coverage from the start
- Team standardization

**Note:** This script creates regular components only. For UI components, use `npm run create:ui-component`. For block components, use `npm run create:block`.

---

**Last Updated:** December 2025  
**Script Version:** 2.0.0

