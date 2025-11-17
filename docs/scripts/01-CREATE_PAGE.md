# Create Page Script

Complete documentation for the automated page creation script.

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

**Script:** `scripts/create-page.js`

**Command:** `npm run create:page`

**Purpose:** Automate MPA page creation with rich test content, interactive CLI, and automatic configuration updates.

**Safety Level:** ✅ Safe (validation, duplicate detection, automatic config updates)

---

## Usage

### Basic Usage

```bash
npm run create:page
```

### Interactive Prompts

The script will guide you through:

1. **Enter Page Name**
   ```
   ✨ Create New Page for MPA
   
   ? Page name (kebab-case): user-profile
   ```

2. **Enter Page Title**
   ```
   ? Page title: User Profile
   ```

3. **Enter Description**
   ```
   ? Page description: Manage your user profile settings and preferences
   ```

4. **Choose CSS Option**
   ```
   ? Create page-specific CSS file? (Y/n): Y
   ```

5. **Choose Components Option**
   ```
   ? Create components folder? (Y/n): Y
   ```

6. **Optional Component**
   ```
   ? Initial component name (optional, press Enter to skip): ProfileCard
   ```

7. **Creation Process**
   ```
   📦 Creating page structure...
   
     ✅ Created src/pages/user-profile/
     ✅ Created src/pages/user-profile/index.html
     ✅ Created src/pages/user-profile/main.tsx
     ✅ Created src/pages/user-profile/UserProfile.tsx
     ✅ Created src/pages/user-profile/UserProfile.module.css
     ✅ Created src/pages/user-profile/components/
     ✅ Created component: ProfileCard.tsx
     ✅ Updated vite.config.ts (2/2 sections)
   
   🎉 Success! New page created!
   
   📍 URLs:
     Dev:  http://localhost:8080/user-profile/
     Prod: /user-profile/
   
   🚀 Next steps:
     1. npm run dev
     2. Open http://localhost:8080/user-profile/
     3. Start coding in src/pages/user-profile/UserProfile.tsx
   ```

---

## What It Does

### 1. Validation

**Checks:**
- ✅ Page name follows kebab-case format
- ✅ Page doesn't already exist
- ✅ Component name (if provided) is PascalCase

**Validation Rules:**
- Page name: lowercase letters, numbers, hyphens only
- Must start with a letter
- No special characters or spaces

---

### 2. File System Operations

**Creates:**
```
src/pages/[page]/              ← New directory
├── index.html                 ← HTML entry point with meta tags
├── main.tsx                   ← React root with providers
├── [Page].tsx                 ← Complete page component with rich content
├── [Page].module.css          ← CSS module (if requested)
└── components/                ← Components folder (if requested)
    └── [Component].tsx        ← Initial component (if provided)
```

---

### 3. Configuration Updates

**Updates `vite.config.ts`:**

**Adds to `rollupOptions.input`:**
```typescript
// Before
input: {
  main: resolve(__dirname, 'src/pages/index/index.html'),
  dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
}

// After
input: {
  main: resolve(__dirname, 'src/pages/index/index.html'),
  dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
  'user-profile': resolve(__dirname, 'src/pages/user-profile/index.html'),  // ← ADDED
}
```

**Adds to `devServerMiddleware`:**
```typescript
// User Profile page
else if (pathname === '/user-profile' || pathname === '/user-profile/') {
  req.url = url.replace(pathname, '/src/pages/user-profile/index.html');
} else if (pathname === '/user-profile/index.html') {
  req.url = url.replace(pathname, '/src/pages/user-profile/index.html');
}
// ← ENTIRE BLOCK ADDED (including comment)
```

---

## Generated Content

### Directory Structure

**Minimal (no CSS, no components):**
```
src/pages/contact/
├── index.html
├── main.tsx
└── Contact.tsx
```

**Full (with CSS and components):**
```
src/pages/user-profile/
├── index.html
├── main.tsx
├── UserProfile.tsx
├── UserProfile.module.css
└── components/
    └── ProfileCard.tsx
```

---

### File Templates

#### 1. `index.html`

**Features:**
- DOCTYPE and HTML5 structure
- Meta tags (charset, viewport, description)
- Dynamic title
- Favicon links
- Script tag for main.tsx

**Example:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Manage your user profile..." />
    <title>User Profile</title>
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

---

#### 2. `main.tsx`

**Features:**
- React 19 root API
- QueryClient provider
- Imports page component
- Global styles

**Example:**
```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from './UserProfile';
import '../../../index.css';

const queryClient = new QueryClient();
const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProfile />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

#### 3. `[Page].tsx`

**Features:**
- Layout wrapper (Header + Footer)
- Hero section with gradient
- Features grid (3 cards)
- Content section with bullet points
- Call-to-action section
- Navigation links
- Fully responsive
- Tailwind CSS classes
- Rich test content
- Icon imports (lucide-react)

**Sections Included:**
1. **Hero** - Page title, description, gradient background
2. **Features** - 3 feature cards with icons
3. **Content** - Text content with bullet points
4. **CTA** - Two action buttons
5. **Navigation** - Links to other pages

---

#### 4. `[Page].module.css` (optional)

**Features:**
- Custom animations
- Responsive utilities
- Hover effects
- Grid layouts
- Gradient definitions

**Example:**
```css
.customSection {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.fadeIn {
  animation: fadeInAnimation 0.6s ease-in;
}

@keyframes fadeInAnimation {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

#### 5. `components/[Component].tsx` (optional)

**Features:**
- TypeScript interface for props
- Default props
- Variant support
- Clean component structure

**Example:**
```typescript
import React from 'react';

interface ProfileCardProps {
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  description = 'Default description',
  variant = 'default',
}) => {
  return (
    <div className={`profile-card ${variant}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ProfileCard;
```

---

## Examples

### Example 1: Full Page with All Options

```bash
$ npm run create:page

✨ Create New Page for MPA

? Page name (kebab-case): about-us
? Page title: About Us
? Page description: Learn more about our company and team
? Create page-specific CSS file? (Y/n): Y
? Create components folder? (Y/n): Y
? Initial component name (optional, press Enter to skip): TeamMemberCard

📦 Creating page structure...

  ✅ Created src/pages/about-us/
  ✅ Created src/pages/about-us/index.html
  ✅ Created src/pages/about-us/main.tsx
  ✅ Created src/pages/about-us/AboutUs.tsx
  ✅ Created src/pages/about-us/AboutUs.module.css
  ✅ Created src/pages/about-us/components/
  ✅ Created component: TeamMemberCard.tsx
  ✅ Updated vite.config.ts (2/2 sections)

🎉 Success! New page created!

📍 URLs:
  Dev:  http://localhost:8080/about-us/
  Prod: /about-us/

🚀 Next steps:
  1. npm run dev
  2. Open http://localhost:8080/about-us/
  3. Start coding in src/pages/about-us/AboutUs.tsx
```

**Created Files:**
- ✅ `src/pages/about-us/index.html`
- ✅ `src/pages/about-us/main.tsx`
- ✅ `src/pages/about-us/AboutUs.tsx`
- ✅ `src/pages/about-us/AboutUs.module.css`
- ✅ `src/pages/about-us/components/TeamMemberCard.tsx`
- ✅ Updated `vite.config.ts`

---

### Example 2: Minimal Page (No CSS, No Components)

```bash
$ npm run create:page

✨ Create New Page for MPA

? Page name (kebab-case): contact
? Page title: Contact Us
? Page description: Get in touch with us for any inquiries
? Create page-specific CSS file? (Y/n): n
? Create components folder? (Y/n): n

📦 Creating page structure...

  ✅ Created src/pages/contact/
  ✅ Created src/pages/contact/index.html
  ✅ Created src/pages/contact/main.tsx
  ✅ Created src/pages/contact/Contact.tsx
  ✅ Updated vite.config.ts (2/2 sections)

🎉 Success! New page created!

📍 URLs:
  Dev:  http://localhost:8080/contact/
  Prod: /contact/

🚀 Next steps:
  1. npm run dev
  2. Open http://localhost:8080/contact/
  3. Start coding in src/pages/contact/Contact.tsx
```

**Created Files:**
- ✅ `src/pages/contact/index.html`
- ✅ `src/pages/contact/main.tsx`
- ✅ `src/pages/contact/Contact.tsx`
- ❌ No CSS file
- ❌ No components folder
- ✅ Updated `vite.config.ts`

---

### Example 3: Page with Components, No CSS

```bash
$ npm run create:page

✨ Create New Page for MPA

? Page name (kebab-case): services
? Page title: Our Services
? Page description: Explore our comprehensive service offerings
? Create page-specific CSS file? (Y/n): n
? Create components folder? (Y/n): Y
? Initial component name (optional, press Enter to skip): ServiceCard

📦 Creating page structure...

  ✅ Created src/pages/services/
  ✅ Created src/pages/services/index.html
  ✅ Created src/pages/services/main.tsx
  ✅ Created src/pages/services/Services.tsx
  ✅ Created src/pages/services/components/
  ✅ Created component: ServiceCard.tsx
  ✅ Updated vite.config.ts (2/2 sections)

🎉 Success! New page created!

📍 URLs:
  Dev:  http://localhost:8080/services/
  Prod: /services/

🚀 Next steps:
  1. npm run dev
  2. Open http://localhost:8080/services/
  3. Start coding in src/pages/services/Services.tsx
```

**Created Files:**
- ✅ `src/pages/services/index.html`
- ✅ `src/pages/services/main.tsx`
- ✅ `src/pages/services/Services.tsx`
- ❌ No CSS file
- ✅ `src/pages/services/components/ServiceCard.tsx`
- ✅ Updated `vite.config.ts`

---

### Example 4: Skip Initial Component

```bash
$ npm run create:page

✨ Create New Page for MPA

? Page name (kebab-case): pricing
? Page title: Pricing Plans
? Page description: Choose the perfect plan for your needs
? Create page-specific CSS file? (Y/n): Y
? Create components folder? (Y/n): Y
? Initial component name (optional, press Enter to skip): 

📦 Creating page structure...

  ✅ Created src/pages/pricing/
  ✅ Created src/pages/pricing/index.html
  ✅ Created src/pages/pricing/main.tsx
  ✅ Created src/pages/pricing/Pricing.tsx
  ✅ Created src/pages/pricing/Pricing.module.css
  ✅ Created src/pages/pricing/components/
  ✅ Updated vite.config.ts (2/2 sections)

🎉 Success! New page created!
```

---

## Validation

### Page Name Validation

**Rules:**
- ✅ Starts with lowercase letter
- ✅ Contains only: lowercase letters, numbers, hyphens
- ✅ No spaces or special characters
- ✅ kebab-case format

**Valid Examples:**
```
✅ user-profile
✅ about-us
✅ pricing-2024
✅ contact
```

**Invalid Examples:**
```bash
? Page name (kebab-case): UserProfile
❌ Page name must be kebab-case (lowercase, hyphens only, e.g., "user-profile")

? Page name (kebab-case): about us
❌ Page name must be kebab-case (lowercase, hyphens only, e.g., "user-profile")

? Page name (kebab-case): about_us
❌ Page name must be kebab-case (lowercase, hyphens only, e.g., "user-profile")

? Page name (kebab-case): About-Us
❌ Page name must be kebab-case (lowercase, hyphens only, e.g., "user-profile")
```

---

### Duplicate Detection

**Prevents overwriting existing pages:**

```bash
$ npm run create:page

✨ Create New Page for MPA

? Page name (kebab-case): profile

❌ Page "profile" already exists!
```

The script checks if `src/pages/[page]/` directory already exists and prevents creation.

---

### Component Name Validation

**If providing a component name:**

```bash
? Initial component name (optional): profileCard

⚠️  Warning: Component name should be PascalCase (e.g., ProfileCard)
   Using "ProfileCard" instead...
```

The script automatically converts to PascalCase if needed.

---

## Best Practices

### Before Creating

✅ **DO:**
- Plan your page structure
- Choose descriptive kebab-case names
- Write meaningful descriptions for SEO
- Decide if you need CSS/components upfront
- Check if page name already exists

❌ **DON'T:**
- Use uppercase or spaces in page names
- Create pages without clear purpose
- Skip the description (important for SEO)
- Use generic names like "page1", "test"

---

### Naming Conventions

#### Page Names

✅ **Good Examples:**
```
user-profile       → Clear, descriptive
about-us           → Standard naming
pricing-plans      → Specific purpose
contact            → Simple, clear
blog-post          → Descriptive
```

❌ **Bad Examples:**
```
UserProfile        → Not kebab-case
about us           → Has spaces
page1              → Not descriptive
test-page          → Temporary naming
myPage             → camelCase not allowed
```

---

#### Page Titles

✅ **Good Examples:**
```
"User Profile"
"About Us"
"Pricing Plans"
"Contact Us"
"Blog Post"
```

❌ **Bad Examples:**
```
"user profile"     → Should be title case
"ABOUT US"         → All caps
"page"             → Too generic
""                 → Empty
```

---

#### Descriptions

✅ **Good Examples:**
```
"Manage your user profile settings and preferences"
"Learn more about our company, mission, and team"
"Choose the perfect pricing plan for your needs"
"Get in touch with us for any inquiries or support"
```

❌ **Bad Examples:**
```
"Page"                           → Too generic
""                               → Empty
"This is a page about stuff"     → Vague
[Very long paragraph...]         → Too long for meta tag
```

---

### After Creating

✅ **DO:**
- Start dev server (`npm run dev`)
- Open the page in browser to verify
- Check vite.config.ts was updated correctly
- Customize the generated content
- Test navigation from other pages
- Commit to git with descriptive message

❌ **DON'T:**
- Continue without restarting dev server
- Keep the default test content in production
- Ignore partial update warnings
- Create many test pages without cleanup

---

## Troubleshooting

### Issue: Script Won't Run

**Error:** `Permission denied` or `command not found`

**Solutions:**
```bash
# Option 1: Make script executable
chmod +x scripts/create-page.js

# Option 2: Run with node directly
node scripts/create-page.js

# Option 3: Check npm script exists
cat package.json | grep "create:page"
```

---

### Issue: Page Created But Not Visible

**Symptoms:**
- Page created successfully
- But browser shows 404

**Solutions:**

```bash
# 1. Restart dev server (MOST COMMON FIX)
# Ctrl+C to stop, then:
npm run dev

# 2. Check vite.config.ts was updated
# Open vite.config.ts and look for:
# - rollupOptions.input entry
# - devServerMiddleware routing

# 3. Hard refresh browser
# Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)
# Or clear cache and reload

# 4. Check URL format
# Use: http://localhost:8080/page-name/
# Not: http://localhost:8080/page-name
```

---

### Issue: Partial Update Warning

**Message:**
```
⚠️  Partially updated vite.config.ts (1/2 sections)
```

**Meaning:**
- Only one of two config sections was updated
- Manual intervention required

**Solution:**

1. **Open `vite.config.ts`**

2. **Check `rollupOptions.input`:**
   ```typescript
   input: {
     main: resolve(__dirname, 'src/pages/index/index.html'),
     dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
     // Add this line if missing:
     'your-page': resolve(__dirname, 'src/pages/your-page/index.html'),
   }
   ```

3. **Check `devServerMiddleware`:**
   ```typescript
   // Your Page page
   else if (pathname === '/your-page' || pathname === '/your-page/') {
     req.url = url.replace(pathname, '/src/pages/your-page/index.html');
   } else if (pathname === '/your-page/index.html') {
     req.url = url.replace(pathname, '/src/pages/your-page/index.html');
   }
   ```

4. **Save and restart dev server**

---

### Issue: Component Not Created

**Symptoms:**
- Component folder created
- But component file is missing

**Cause:**
- Component name was invalid or empty

**Solution:**
```bash
# Create component manually:
cd src/pages/[your-page]/components/
touch YourComponent.tsx

# Add template:
cat > YourComponent.tsx << 'EOF'
import React from 'react';

interface YourComponentProps {
  title: string;
}

const YourComponent: React.FC<YourComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};

export default YourComponent;
EOF
```

---

### Issue: CSS Not Applied

**Symptoms:**
- CSS file created
- But styles don't appear

**Solutions:**

```typescript
// 1. Check import in [Page].tsx
import styles from './YourPage.module.css';

// 2. Use className correctly
<div className={styles.yourClass}>

// 3. Not this:
<div className="yourClass">  // ❌ Won't work
```

---

### Issue: TypeScript Errors

**Common Errors:**

```typescript
// Error: Cannot find module './YourPage'
// Solution: Restart TypeScript server in VSCode
// Cmd+Shift+P → "TypeScript: Restart TS Server"

// Error: JSX element implicitly has type 'any'
// Solution: Add proper type annotations
interface Props {
  title: string;
}
```

---

## Script Details

### File Location
```
scripts/create-page.js
```

### Dependencies
- `fs` - File system operations
- `path` - Path manipulation  
- `readline` - Interactive CLI prompts

### Exit Codes
- `0` - Success
- `1` - Error occurred (validation failed, file creation failed, etc.)

---

## Related Documentation

- **[02-DELETE_PAGE.md](./02-DELETE_PAGE.md)** - Delete pages
- **[03-POST_BUILD.md](./03-POST_BUILD.md)** - Post-build process
- **[README.md](./README.md)** - Scripts overview

---

## Summary

**create-page.js provides:**
- ✅ Interactive CLI for easy page creation
- ✅ Automatic file generation with rich test content
- ✅ Config updates (vite.config.ts)
- ✅ Validation and error handling
- ✅ Flexible options (CSS, components, initial component)
- ✅ Production-ready page structure
- ✅ SEO-friendly HTML templates
- ✅ Responsive design with Tailwind CSS

**Perfect for:**
- Rapid prototyping
- Creating consistent page structure
- Reducing boilerplate code
- Speeding up MPA development
- Ensuring best practices
- New team members onboarding

---

**Last Updated:** November 2025  
**Script Version:** 1.0.0
