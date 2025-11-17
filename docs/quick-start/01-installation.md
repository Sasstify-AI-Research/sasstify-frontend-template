# Installation

Install dependencies and start your development environment.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Verify Installation](#verify-installation)
- [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

**Node.js 18+ and npm 8+**

Check your versions:
```bash
node --version  # Should show v18+ (you have v22.20.0 ✅)
npm --version   # Should show v8+ (you have v11.6.2 ✅)
```

**If you need to install:**
- Download from [nodejs.org](https://nodejs.org/)
- Use nvm: `nvm install 22`

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Sasstify-AI-Research/sasstify-frontend-template.git

# Navigate to project directory
cd sasstify-frontend-template
```

**What happens:**
- Creates a `sasstify-frontend-template` directory
- Downloads all project files
- You're now in the project directory

---

### Step 2: Install Dependencies

```bash
npm install
```

**What happens:**
- Downloads ~500 packages
- Creates `node_modules/` folder
- Takes 1-3 minutes (depending on internet speed)

**Expected output:**
```
added 500 packages in 45s

100 packages are looking for funding
  run `npm fund` for details
```

---

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v7.0.4  ready in 299 ms

➜  Local:   http://localhost:8080/
➜  Network: http://192.168.1.x:8080/
➜  press h + enter to show help
```

---

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:8080
```

**You should see:**
- The index page of the template
- Instant updates when you edit files
- No manual refresh needed (HMR)

---

## Verify Installation

### Check Dev Server

**✅ Success indicators:**
- Browser shows the index page
- Console shows no errors
- HMR works (edit a file, see instant update)

**⚠️ Common issues:**
- Port 8080 already in use → See [Troubleshooting](./06-troubleshooting.md#port-already-in-use)
- npm install failed → See [Troubleshooting](./06-troubleshooting.md#npm-install-fails)

---

### Test Hot Module Replacement

1. Open `src/pages/index/Index.tsx`
2. Change some text
3. Save the file
4. See instant update in browser (no refresh!)

**This confirms:**
- Installation is correct
- Dev server is working
- HMR is functional

---

### Run Type Check

```bash
npm run type-check
```

**Expected output:**
```
No type errors found
```

---

### Run Linter

```bash
npm run lint
```

**Expected output:**
```
✔ No linting errors found
```

---

## What Got Installed?

### Dependencies (~500 packages)

**React Ecosystem:**
- `react` & `react-dom` (v19) - UI framework
- `@tanstack/react-query` - Data fetching

**Build Tools:**
- `vite` - Dev server & build tool
- `typescript` - Type system

**Styling:**
- `tailwindcss` - Utility CSS
- `clsx` - Class name utility

**Icons & UI:**
- `lucide-react` - Icon library

**And more...** (see `package.json`)

---

### Folder Structure Created

```
sasstify-frontend-template/
├── node_modules/          ← 500+ packages installed here
├── src/                   ← Your source code
├── public/                ← Static assets
├── docs/                  ← Documentation
├── scripts/               ← Automation scripts
├── .vite-cache/           ← Build cache (created on first build)
└── dist/                  ← Production build output (created on build)
```

---

## Available Commands

Now that installation is complete, you have access to these commands:

### Development
```bash
npm run dev              # Start dev server (you just did this!)
npm run type-check       # Check TypeScript types
npm run lint             # Check code quality
```

### Building
```bash
npm run build            # Production build
npm run build:clean      # Clean build from scratch
npm run build:analyze    # Build + bundle analysis
npm run preview          # Preview production build
```

### Page Management
```bash
npm run create:page      # Create new page (interactive)
npm run delete:page      # Delete existing page (interactive)
```

**[→ Complete npm scripts reference](../scripts/)**

---

## Next Steps

### Understand the Project
→ [Project Structure](./02-project-structure.md) - Learn what's where

### Start Coding
→ [Making Changes](./03-making-changes.md) - Edit pages and components

### Build Something
→ [Common Tasks](./04-common-tasks.md) - Practical examples

---

## Quick Reference

| Command | Purpose | Time |
|---------|---------|------|
| `npm install` | Install dependencies | 1-3 min |
| `npm run dev` | Start dev server | ~300ms |
| `npm run build` | Production build | ~3-5s |

---

**✅ Installation Complete!** Continue to [Project Structure](./02-project-structure.md) to understand the codebase.

