# Contributing to Sasstify Frontend Template

Welcome! This guide helps you contribute to this React + TypeScript + Vite template.

**Thank you for your interest in contributing!** 🎉

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Quick Start for Contributors](#quick-start-for-contributors)
- [Documentation Structure](#documentation-structure)
- [What Can I Contribute?](#what-can-i-contribute)
- [Developer Workflow](#developer-workflow)
- [Coding Standards](#coding-standards)
- [Code Review](#code-review)
- [Reporting Issues](#reporting-issues)
- [Getting Help](#getting-help)
- [Recognition](#recognition)
- [Quick Reference](#quick-reference)
- [Next Steps](#next-steps)

---

## Before You Start

**Required Reading:**
- ✅ [Code of Conduct](../../CODE_OF_CONDUCT.md)
- ✅ [Contributor License Agreement](../../CONTRIBUTOR_LICENSE_AGREEMENT.md)

**Prerequisites:**
- Node.js 18+ (see [Installation](../quick-start/01-installation.md))
- npm or pnpm
- Git & GitHub account

---

## Quick Start for Contributors

```bash
# 1. Find or create an issue on GitHub (get maintainer approval!)

# 2. Fork repository on GitHub

# 3. Clone and setup
git clone https://github.com/YOUR_USERNAME/sasstify-frontend-template.git
cd sasstify-frontend-template
npm install

# 4. Create a branch
git checkout -b feature/your-feature-name

# 5. Start coding
npm run dev

# 6. Test, commit, push, create PR (linking to the issue)!
```

**⚠️ Important:** Always create or find an issue before starting work!

**Detailed workflow:** [Git Workflow](./01-git-workflow.md)

---

## Documentation Structure

Complete guide organized into focused sections:

### 🚀 Getting Started (Read First)

| Step | Document | Description | Read Time |
|------|----------|-------------|-----------|
| **1** | **[Git Workflow](./01-git-workflow.md)** | Fork, clone, branch, sync & push | 5 min |
| **2** | **[Commit Conventions](./02-commit-conventions.md)** | How to write good commit messages | 5 min |

### 📝 Contribution Process

| Step | Document | Description | Read Time |
|------|----------|-------------|-----------|
| **3** | **[Pull Request Process](./03-pull-request-process.md)** | Submitting & reviewing PRs | 7 min |
| **4** | **[Code Review](./04-code-review.md)** | Review expectations & standards | 5 min |

**Total Reading Time:** ~22 minutes

---

## What Can I Contribute?

### 🐛 Bug Fixes

**Process:**
1. Report bug using [bug report template](./templates/bug-report.md)
2. Fix following [Quick Start - Making Changes](../quick-start/03-making-changes.md)
3. Submit PR following [PR Process](./03-pull-request-process.md)

### ✨ New Features

**Process:**
1. Propose feature using [feature request template](./templates/feature-request.md)
2. Discuss in issue
3. Implement following guides below
4. Submit PR

### 🎨 Components / Hooks / Utils

**Learn how:**
- [Component Documentation](../reusable-implementations/components/) - Study existing patterns
- [Hook Documentation](../reusable-implementations/hooks/) - Hook patterns
- [Utility Documentation](../reusable-implementations/utils/) - Utility patterns
- [Common Tasks](../quick-start/04-common-tasks.md) - Adding components

**Standards:**
- Match existing component structure
- Add documentation following existing format
- Include TypeScript types
- Test thoroughly

### 📚 Documentation

**Improve:**
- Fix typos, clarify explanations
- Add missing examples
- Update outdated information
- Follow existing doc structure in `docs/`

### ⚡ Performance

**Optimize:**
- Follow [Performance Guide](../performance-optimization-guide/)
- Use [Lazy Loading Patterns](../reusable-implementations/lazy-loading/)
- Measure impact with `npm run build:analyze`

---

## Developer Workflow

### 1. Setup Your Environment

**Follow:** [Installation Guide](../quick-start/01-installation.md)

Already have it running? ✅

### 2. Understand the Project

**Read:**
- [Project Structure](../quick-start/02-project-structure.md)
- [Component Library](../reusable-implementations/)
- [Build System](../production-build/)

### 3. Make Changes

**Follow:** [Making Changes Guide](../quick-start/03-making-changes.md)

**Available commands:**
```bash
npm run dev              # Development server
npm run build            # Production build
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
npm run create:page      # Create new page
```

**All commands:** [Scripts Documentation](../scripts/)

### 4. Test Your Changes

**Checklist:**
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Test in dev: `npm run dev`
- [ ] Test in prod: `npm run preview`
- [ ] Test in multiple browsers

**Troubleshooting:** [Quick Start - Troubleshooting](../quick-start/06-troubleshooting.md)

### 5. Submit Pull Request

**Follow:** [Pull Request Process](./03-pull-request-process.md)

---

## Coding Standards

### React & TypeScript

- Functional components with TypeScript
- Follow existing component patterns in `src/components/`
- Study: [Component Documentation](../reusable-implementations/components/)

### Styling

- Use Tailwind CSS utilities
- CSS modules for complex styles
- Follow existing patterns in `src/`

### Performance

- Code splitting for heavy components
- Lazy loading patterns: [Lazy Loading Guide](../reusable-implementations/lazy-loading/)
- Check bundle size: `npm run build:analyze`

### File Organization

- Match existing structure: [Project Structure](../quick-start/02-project-structure.md)
- Components in `src/components/`
- Pages in `src/pages/`
- Hooks in `src/hooks/`

---

## Code Review

**What reviewers check:**
1. Follows existing patterns
2. TypeScript strict mode (no `any`)
3. Works in Chrome, Firefox, Safari
4. Documentation updated
5. Tests pass

**Timeline:**
- Initial response: 2-3 business days
- Full review: ~1 week

**Details:** [Code Review Process](./04-code-review.md)

---

## Reporting Issues

### Bug Reports

Use [Bug Report Template](./templates/bug-report.md)

**Before reporting:**
- Search existing issues
- Check [Troubleshooting Guide](../quick-start/06-troubleshooting.md)

### Feature Requests

Use [Feature Request Template](./templates/feature-request.md)

**Before requesting:**
- Search existing requests
- Check project roadmap

---

## Getting Help

**Questions?**
- 💬 [GitHub Discussions](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/discussions)
- 📖 Read [Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/issues)
- 📧 Email: software-engineer-404@sasstify.com

**Common Issues:** [Troubleshooting Guide](../quick-start/06-troubleshooting.md)

---

## Recognition

Contributors are recognized in:
- Project README
- Release notes
- GitHub contributors page

Thank you for contributing! 🙏

---

## Quick Reference

### Essential Guides

- [Git Workflow](./01-git-workflow.md) - Fork, branch, commit
- [Commit Conventions](./02-commit-conventions.md) - Message format
- [Pull Request Process](./03-pull-request-process.md) - Submit & review
- [Code Review](./04-code-review.md) - Review standards

### Project Documentation

- [Quick Start](../quick-start/) - Installation to deployment
- [Components](../reusable-implementations/) - Component library
- [Performance](../performance-optimization-guide/) - Optimization
- [Build System](../production-build/) - Build process
- [Scripts](../scripts/) - npm commands

### Templates

- [Bug Report](./templates/bug-report.md)
- [Feature Request](./templates/feature-request.md)
- [Pull Request Template](../../.github/PULL_REQUEST_TEMPLATE.md) - Auto-populated by GitHub

---

## Next Steps

**New to contributing?**  
→ Start with [Git Workflow](./01-git-workflow.md)

**Ready to submit code?**  
→ Read [Commit Conventions](./02-commit-conventions.md)

**Need to report a bug?**  
→ See [Bug Report Template](./templates/bug-report.md)

**Adding a component?**  
→ Check [Component Documentation](../reusable-implementations/components/)

---

**Last Updated:** November 2025  
**License:** MIT  
**Made with ❤️ by Sasstify AI Research**

