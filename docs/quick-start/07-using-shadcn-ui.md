# Using shadcn/ui Components

Learn how to add and customize beautiful, accessible UI components with shadcn/ui.

---

## Table of Contents

- [What is shadcn/ui?](#what-is-shadcnui)
- [How It Works](#how-it-works)
- [Adding Components](#adding-components)
- [Using Components](#using-components)
- [Customizing Components](#customizing-components)
- [Common Components](#common-components)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## What is shadcn/ui?

**shadcn/ui** is a collection of beautifully designed, accessible, and customizable UI components built with:
- ✅ **Radix UI** - For accessibility and functionality
- ✅ **Tailwind CSS** - For styling
- ✅ **Copy-paste approach** - Components are added to your codebase (not an npm package)

**Key Benefits:**
- 🎨 **Full control** - Components live in your code, you own them
- ♿ **Accessible** - Built on Radix UI primitives (WCAG compliant)
- 🎯 **Customizable** - Modify any component to fit your needs
- 📦 **No bloat** - Only install components you actually use

**Official Website:** https://ui.shadcn.com

---

## How It Works

shadcn/ui is **not** an npm package. Instead:

1. **You run a CLI command** to add a component
2. **The component files are copied** into your `src/components/ui/` folder
3. **You own the code** and can modify it freely

This template is **pre-configured** with shadcn/ui. You can start adding components immediately!

### Configuration

Your project has `components.json` which configures shadcn/ui:

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils"
  }
}
```

---

## Adding Components

### Step 1: Browse Available Components

Visit [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) to see all available components.

**Popular components:**
- Button, Card, Dialog, Dropdown Menu
- Form, Input, Label, Select
- Tabs, Sheet, Popover, Tooltip
- Alert, Badge, Avatar, Skeleton

---

### Step 2: Add a Component

**Add a single component:**
```bash
npx shadcn@latest add button
```

**Add multiple components:**
```bash
npx shadcn@latest add button card dialog
```

**What happens:**
- Files are created in `src/components/ui/`
- Dependencies are added to `package.json` (if needed)
- You can immediately use the component

**Example output:**
```
✔ Checking registry...
✔ Installing dependencies...
✔ Created 1 file:
  - src/components/ui/button.tsx
```

---

### Step 3: Verify Installation

**Check the file was created:**
```bash
ls src/components/ui/
# Should show: button.tsx
```

---

## Using Components

### Basic Usage

**1. Import the component:**
```typescript
import { Button } from '@/components/ui/button';
```

**2. Use it in your JSX:**
```typescript
export function MyPage() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline" size="lg">Large Button</Button>
    </div>
  );
}
```

---

### Complete Example - Button Component

**Add the component:**
```bash
npx shadcn@latest add button
```

**Use in your page:**
```typescript
// src/pages/index/Index.tsx
import { Button } from '@/components/ui/button';
import { Trash2, Save, Download } from 'lucide-react';

export default function Index() {
  return (
    <div className="p-8 space-y-4">
      {/* Different variants */}
      <div className="flex gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      {/* Different sizes */}
      <div className="flex gap-4 items-center">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>

      {/* With icons */}
      <div className="flex gap-4">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Loading state */}
      <Button disabled>
        <span className="animate-spin mr-2">⏳</span>
        Loading...
      </Button>
    </div>
  );
}
```

---

### Complete Example - Dialog Component

**Add the component:**
```bash
npx shadcn@latest add dialog button
```

**Use in your page:**
```typescript
// src/pages/index/Index.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Index() {
  return (
    <div className="p-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

### Complete Example - Form Components

**Add components:**
```bash
npx shadcn@latest add form input label button
```

**Create a form:**
```typescript
// src/components/contact-form/ContactForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## Customizing Components

### Method 1: Modify the Component File

Components live in your codebase, so you can edit them directly:

```typescript
// src/components/ui/button.tsx
// Modify this file to change all buttons globally

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700", // ✏️ Change this
        destructive: "bg-red-600 text-white hover:bg-red-700",
        // Add your own variants
        custom: "bg-purple-600 text-white hover:bg-purple-700",
      },
    },
  }
)
```

---

### Method 2: Use className Override

Pass custom classes to override styles:

```typescript
<Button className="bg-gradient-to-r from-blue-500 to-purple-500">
  Gradient Button
</Button>
```

---

### Method 3: Create Wrapper Components

Create your own component that wraps shadcn/ui:

```typescript
// src/components/custom-button/CustomButton.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CustomButton({ 
  children, 
  className,
  ...props 
}: React.ComponentProps<typeof Button>) {
  return (
    <Button 
      className={cn("rounded-full shadow-lg", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
```

---

## Common Components

### Button

```bash
npx shadcn@latest add button
```

**Usage:**
```typescript
<Button variant="default | secondary | outline | ghost | destructive">
  Click me
</Button>
```

**[→ Button docs](https://ui.shadcn.com/docs/components/button)**

---

### Card

```bash
npx shadcn@latest add card
```

**Usage:**
```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

**[→ Card docs](https://ui.shadcn.com/docs/components/card)**

---

### Dialog (Modal)

```bash
npx shadcn@latest add dialog
```

**Usage:**
```typescript
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    Content here
  </DialogContent>
</Dialog>
```

**[→ Dialog docs](https://ui.shadcn.com/docs/components/dialog)**

---

### Form Components

```bash
npx shadcn@latest add input label textarea select
```

**Usage:**
```typescript
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Email" />
</div>
```

**[→ Input docs](https://ui.shadcn.com/docs/components/input)**

---

### Dropdown Menu

```bash
npx shadcn@latest add dropdown-menu
```

**Usage:**
```typescript
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**[→ Dropdown docs](https://ui.shadcn.com/docs/components/dropdown-menu)**

---

## Best Practices

### 1. Add Only What You Need

❌ **Don't:**
```bash
# Don't add all components at once
npx shadcn@latest add accordion alert badge button card ...
```

✅ **Do:**
```bash
# Add components as you need them
npx shadcn@latest add button
```

---

### 2. Use the `cn()` Utility

The `cn()` utility (in `src/lib/utils.ts`) helps merge class names:

```typescript
import { cn } from '@/lib/utils';

<Button className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "special" && "special-classes"
)}>
  Button
</Button>
```

---

### 3. Create Reusable Wrappers

For frequently used patterns, create wrapper components:

```typescript
// src/components/form-field/FormField.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function FormField({ label, ...inputProps }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...inputProps} />
    </div>
  );
}

// Usage
<FormField label="Email" type="email" placeholder="your@email.com" />
```

---

### 4. Lazy Load Heavy Components

For components with large dependencies (like Dialog, Popover), use lazy loading:

```typescript
import { lazy, Suspense } from 'react';

const Dialog = lazy(() => import('@/components/ui/dialog').then(m => ({ 
  default: m.Dialog 
})));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dialog>...</Dialog>
</Suspense>
```

---

### 5. Keep Component Files Clean

Don't modify shadcn/ui component files unless necessary. Instead:
- Create wrapper components
- Use className overrides
- Pass custom variants

---

## Troubleshooting

### Component Not Found

**Error:**
```
Cannot find module '@/components/ui/button'
```

**Fix:**
```bash
# Add the component first
npx shadcn@latest add button
```

---

### Import Alias Not Working

**Error:**
```
Cannot resolve '@/components/ui/button'
```

**Fix:** Check `tsconfig.json` has path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Styles Not Applied

**Symptoms:** Component appears unstyled or has no styles

**Possible causes:**
1. **Missing Tailwind CSS** - Ensure Tailwind is loaded
2. **Missing CSS variables** - Some components need CSS custom properties

**Fix:** Check that your global CSS includes:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Dependency Errors

**Error:**
```
Cannot find module '@radix-ui/react-dialog'
```

**Fix:**
```bash
# Install missing dependencies
npm install

# Or add the component again
npx shadcn@latest add dialog
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Add button | `npx shadcn@latest add button` |
| Add dialog | `npx shadcn@latest add dialog` |
| Add form components | `npx shadcn@latest add input label` |
| Add multiple | `npx shadcn@latest add button card dialog` |
| Browse components | https://ui.shadcn.com/docs/components |
| Component location | `src/components/ui/[component].tsx` |

---

## Next Steps

**Explore Components:**
→ [shadcn/ui Component Gallery](https://ui.shadcn.com/docs/components)

**Learn More:**
→ [Common Tasks](./04-common-tasks.md) - Build features with components

→ [Troubleshooting](./06-troubleshooting.md) - Fix issues

---

**Ready to build beautiful UIs?** Start adding components and customize them to fit your needs!

