# Sasstify Frontend Template ⚡

**A production-ready Multi-Page Application (MPA) template powered by Vite 7**

**Optimized for lightning-fast development, smart code splitting, and lazy loading**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](.)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](.)
[![React](https://img.shields.io/badge/React-19-blue.svg)](.)
[![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](.)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Key Features](#key-features)
- [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [What Makes This Special?](#what-makes-this-special)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Support & Links](#support--links)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Sasstify-AI-Research/sasstify-frontend-template.git

# Navigate to project directory
cd sasstify-frontend-template

# Install dependencies
npm install

# Start development server (instant!)
npm run dev

# Open http://localhost:8080
```

---

## Key Features

### ⚡ Ultra-Fast Development
- **Dev Server:** Starts in **299ms** (near-instant!)
- **Hot Module Replacement:** <100ms updates
- **Production Build:** **1-4 seconds** (90% faster than Webpack)

### 🎯 Production-Ready
- **Multi-Page Architecture:** No special server config needed (works on any static host)
- **Smart Code Splitting:** Automatic vendor chunking with lazy loading
- **Viewport-Based Lazy Loading:** Content loads when scrolled into view
- **Modern Tooling:** React 19 + TypeScript 5.8 + Vite 7
- **Optimized Build:** Content-hashed assets with intelligent caching

**[→ See performance metrics & bundle analysis](./docs/performance-optimization-guide/)**

### 📦 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.1.0 |
| **Language** | TypeScript | 5.8.3 |
| **Build Tool** | Vite | 7.0.4 |
| **Architecture** | Multi-Page App (MPA) | - |
| **State** | TanStack Query | 5.83.0 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Icons** | Lucide React | 0.525.0 |

---

## Available Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:8080
npm run create:page      # 🤖 Create new page (automated CLI)
npm run delete:page      # 🗑️ Delete existing page (automated CLI)

# Production
npm run build            # Build for production (1-4 seconds!)
npm run preview          # Preview production build locally

# Analysis
npm run build:analyze    # Build + open bundle analyzer

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

---

## Project Structure

```
sasstify-frontend-template/
├── src/
│   ├── components/       # Reusable components (Layout, Header, Footer, Section)
│   ├── pages/            # Multi-page application
│   │   ├── index/        # Index page with index.html + main.tsx + Index.tsx
│   │   └── dashboard/    # Dashboard page with index.html + main.tsx + Dashboard.tsx
│   ├── hooks/            # Custom React hooks (useSectionNavigation, use-mobile)
│   └── utils/            # Utility functions (smoothScroll)
├── public/               # Static assets & global CSS
├── scripts/              # Build scripts (create-page, delete-page, post-build)
├── docs/                 # Complete documentation
├── changelog/            # Release notes and version history
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

**[→ See detailed structure guide](./docs/quick-start/02-project-structure.md)**

---

## What Makes This Special?

### Smart Code Splitting & Caching
- Automatic vendor chunking separates React and libraries for optimal caching
- Page-specific code loads only when needed
- Content-hashed filenames ensure perfect cache efficiency

### Three Lazy Loading Patterns
1. **Component-Level:** Load components on user interaction (buttons, modals)
2. **Viewport-Based:** Load content when scrolled into view (sections)
3. **Route-Based:** Each MPA page loads independently

**[→ See lazy loading patterns with examples](./docs/reusable-implementations/lazy-loading/)**

### Developer Experience
- Instant dev server start (~300ms) with Hot Module Replacement
- Full TypeScript support with strict mode
- Automated page creation CLI (`npm run create:page`)
- Built-in component library with hooks and utilities

**[→ See complete feature list & performance metrics](./docs/performance-optimization-guide/)**

---

## Documentation

### Complete Documentation

All documentation is in the [`docs/`](./docs/) folder:

| Category | Guide | Description |
|----------|-------|-------------|
| **Getting Started** | [Quick Start](./docs/quick-start/) | Install, build & deploy in 5 minutes |
| **Build System** | [Production Build](./docs/production-build/) | Complete build pipeline guide |
| **Page Management** | [Create Page](./docs/scripts/01-CREATE_PAGE.md) | Automated page creation (CLI) |
| **Components** | [Component Library](./docs/reusable-implementations/) | Reusable components, hooks & utils |
| **Performance** | [Optimization Guide](./docs/performance-optimization-guide/) | Performance best practices |
| **Scripts** | [NPM Scripts](./docs/scripts/) | All automation & workflows |

**[📖 Complete documentation index →](./docs/README.md)**

---

## Contributing

We welcome contributions! See our **[Contributing Guide](./docs/contributing/)** for details on:

- **[Git Workflow](./docs/contributing/01-git-workflow.md)** - Fork, clone, branch & commit
- **[Commit Conventions](./docs/contributing/02-commit-conventions.md)** - Write clear commit messages
- **[Pull Request Process](./docs/contributing/03-pull-request-process.md)** - Submit & review PRs
- **[Code Review](./docs/contributing/04-code-review.md)** - Review standards & expectations

**Report Issues:**
- 🐛 [Bug Report Template](./docs/contributing/templates/bug-report.md)
- ✨ [Feature Request Template](./docs/contributing/templates/feature-request.md)

**Legal:**
- [Contributor License Agreement](./CONTRIBUTOR_LICENSE_AGREEMENT.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

Built with:
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching

---

## Support & Links

### Documentation
- 📖 **[Complete Documentation](./docs/README.md)** - Full guides & references
- 🚀 **[Quick Start Guide](./docs/quick-start/)** - Get started in 5 minutes
- 🔧 **[Build Guide](./docs/production-build/)** - Production build pipeline
- ⚡ **[Performance Guide](./docs/performance-optimization-guide/)** - Optimization tips

### Project Management
- 🗺️ **[Roadmap](./ROADMAP.md)** - Future plans and feature timeline
- 📋 **[Changelog](./changelog/)** - Release history and changes

### Community
- 🐛 **[Report Issues](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/issues)** - Bug reports & feature requests
- 💬 **[Discussions](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/discussions)** - Ask questions & share ideas
- 🤝 **[Contributing Guide](./docs/contributing/)** - How to contribute

### Contact
- 📧 **For support, help, complaints, or legal queries:** [software-engineer-404@sasstify.com](mailto:software-engineer-404@sasstify.com)

---

## Star This Repository

If you find this template helpful, please consider giving it a star! It helps others discover the project.

---

**Made with ❤️ by Sasstify AI Research**

**Last Updated:** November 14, 2025  
**Status:** Production Ready ✅
