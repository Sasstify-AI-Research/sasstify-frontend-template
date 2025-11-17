# Common Tasks

Practical examples for everyday development tasks.

---

## Table of Contents

- [Add a New Component](#add-a-new-component)
- [Add API Calls](#add-api-calls)
- [Add Navigation](#add-navigation)
- [Add Forms](#add-forms)
- [Add Icons](#add-icons)
- [Debug Issues](#debug-issues)

---

## Add a New Component

### Using shadcn/ui Components

For **pre-built, accessible UI components** (buttons, dialogs, forms, etc.), use shadcn/ui:

```bash
# Add a button component
npx shadcn@latest add button

# Use it
import { Button } from '@/components/ui/button';

<Button variant="default">Click me</Button>
```

**[→ Complete shadcn/ui guide](./07-using-shadcn-ui.md)**

---

### Reusable Component

1. **Create folder:**
```bash
mkdir -p src/components/my-component
```

2. **Create component file:**
```typescript
// src/components/my-component/MyComponent.tsx
export interface MyComponentProps {
  title: string;
  description?: string;
}

export function MyComponent({ title, description }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </div>
  );
}
```

3. **Create types file:**
```typescript
// src/components/my-component/MyComponent.types.ts
export interface MyComponentProps {
  title: string;
  description?: string;
}
```

4. **Use in page:**
```typescript
import { MyComponent } from '@/components/my-component/MyComponent';

export default function MyPage() {
  return (
    <Layout>
      <MyComponent 
        title="Hello" 
        description="This is my component" 
      />
    </Layout>
  );
}
```

---

### Page-Specific Component

1. **Create in page folder:**
```bash
mkdir -p src/pages/index/components
```

2. **Create component:**
```typescript
// src/pages/index/components/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <h1 className="text-5xl font-bold">Welcome</h1>
      <p className="mt-4 text-xl">Get started today</p>
    </section>
  );
}
```

3. **Use in page:**
```typescript
// src/pages/index/Index.tsx
import { HeroSection } from './components/HeroSection';

export default function Index() {
  return (
    <Layout>
      <HeroSection />
    </Layout>
  );
}
```

---

## Add API Calls

### Using TanStack Query

**Install (already included):**
```bash
# Already in package.json
@tanstack/react-query
```

**Create API hook:**
```typescript
// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useUser(userId: number) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });
}
```

**Use in component:**
```typescript
import { useUser } from '@/hooks/useUser';

export function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, error } = useUser(userId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  );
}
```

---

### Using fetch

**Simple fetch:**
```typescript
import { useState, useEffect } from 'react';

export function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## Add Navigation

### Between Pages

**Use standard links:**
```typescript
export function Navigation() {
  return (
    <nav className="flex gap-4">
      <a href="/" className="text-blue-600 hover:underline">
        Home
      </a>
      <a href="/dashboard/" className="text-blue-600 hover:underline">
        Dashboard
      </a>
      <a href="/about/" className="text-blue-600 hover:underline">
        About
      </a>
    </nav>
  );
}
```

**Note:** This is an MPA, so use regular `<a>` tags, not React Router.

---

### Within Page (Smooth Scroll)

**Using useSectionNavigation:**
```typescript
import { useSectionNavigation } from '@/hooks/useSectionNavigation';
import { Section } from '@/components/section/Section';

export default function Index() {
  const { scrollToSection } = useSectionNavigation({
    sections: ['hero', 'features', 'about'],
  });
  
  return (
    <Layout>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow">
        <button onClick={() => scrollToSection('hero')}>Hero</button>
        <button onClick={() => scrollToSection('features')}>Features</button>
        <button onClick={() => scrollToSection('about')}>About</button>
      </nav>
      
      <Section id="hero">Hero Content</Section>
      <Section id="features">Features Content</Section>
      <Section id="about">About Content</Section>
    </Layout>
  );
}
```

**[→ useSectionNavigation documentation](../reusable-implementations/hooks/01-use-section-navigation.md)**

---

## Add Forms

### Using shadcn/ui Form Components (Recommended)

For accessible, styled form components:

```bash
# Add form components
npx shadcn@latest add input label button

# Use them
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="your@email.com" />
  <Button>Submit</Button>
</div>
```

**[→ Complete shadcn/ui form guide](./07-using-shadcn-ui.md#form-components)**

---

### Simple Form

```typescript
import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          rows={4}
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
```

---

## Add Icons

### Using Lucide React

**Import icons:**
```typescript
import { Home, User, Settings, Menu } from 'lucide-react';

export function IconExample() {
  return (
    <div className="flex gap-4">
      <Home className="w-6 h-6" />
      <User className="w-6 h-6 text-blue-600" />
      <Settings className="w-8 h-8 text-gray-500" />
      <Menu className="w-10 h-10" />
    </div>
  );
}
```

**In buttons:**
```typescript
import { ChevronRight } from 'lucide-react';

export function Button() {
  return (
    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
      <span>Next</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}
```

**[→ Browse all icons](https://lucide.dev/icons/)**

---

## Debug Issues

### TypeScript Errors

**Check types:**
```bash
npm run type-check
```

**Common fixes:**
```typescript
// ❌ Bad
const value = someFunction(); // Type unknown

// ✅ Good
const value: string = someFunction();

// ❌ Bad
<MyComponent title={123} />

// ✅ Good
<MyComponent title="Hello" />
```

---

### Linter Errors

**Check code quality:**
```bash
npm run lint
```

**Common fixes:**
```typescript
// ❌ Bad: Unused import
import { useState, useEffect } from 'react';

// ✅ Good: Remove unused
import { useState } from 'react';

// ❌ Bad: Any type
const data: any = fetchData();

// ✅ Good: Proper type
const data: User = fetchData();
```

---

### Build Errors

**Clean build:**
```bash
npm run build:clean
```

**This will:**
- Delete `.vite-cache/`
- Delete `dist/`
- Rebuild from scratch

---

### Dev Server Issues

**Port already in use:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Then restart
npm run dev
```

**[→ Complete troubleshooting guide](./06-troubleshooting.md)**

---

## Quick Reference

| Task | Example |
|------|---------|
| Add UI component | `npx shadcn@latest add button` |
| Add custom component | Create in `components/` or `pages/[page]/components/` |
| API call | Use `@tanstack/react-query` |
| Page navigation | Use `<a href="/page/">` |
| Section navigation | Use `useSectionNavigation` hook |
| Forms | Use shadcn/ui `input`, `label`, `button` components |
| Icons | Import from `lucide-react` |
| Debug types | `npm run type-check` |
| Debug lint | `npm run lint` |

---

## Next Steps

→ [Building & Deploying](./05-building-and-deploying.md) - Build for production

→ [Troubleshooting](./06-troubleshooting.md) - Fix common issues

---

**Keep building!** Continue to [Building & Deploying](./05-building-and-deploying.md).

