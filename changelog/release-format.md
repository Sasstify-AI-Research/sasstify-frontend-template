# Release Notes Format Guide

Guidelines for documenting releases in this changelog.

---

## Table of Contents

- [Overview](#overview)
- [Standard Sections](#standard-sections)
- [Section Guidelines](#section-guidelines)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## Overview

Each release document follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format with these standard sections.

---

## Standard Sections

### Added
**For new features**

Use this section to document:
- New components, hooks, or utilities
- New commands or scripts
- New documentation pages
- New configuration options

**Example:**
```markdown
### Added
- New `Button` component with variants
- `useLocalStorage` hook for persistent state
- Bundle analyzer script (`npm run analyze`)
```

---

### Changed
**For changes in existing functionality**

Use this section to document:
- Updated component APIs
- Modified default behavior
- Refactored code (user-facing changes only)
- Updated dependencies (major versions)

**Example:**
```markdown
### Changed
- Updated `Header` component API - now accepts `variant` prop
- Changed default port from 3000 to 8080
- React upgraded to 19.1.0
```

---

### Deprecated
**For soon-to-be removed features**

Use this section to document:
- Features marked for removal in future releases
- Alternative solutions to use instead

**Example:**
```markdown
### Deprecated
- `oldFunction()` is deprecated, use `newFunction()` instead
- Will be removed in v2.0.0
```

---

### Removed
**For removed features**

Use this section to document:
- Removed components, hooks, or utilities
- Removed configuration options
- Removed scripts or commands

**Example:**
```markdown
### Removed
- Removed deprecated `OldComponent`
- Removed `legacy-mode` configuration option
```

---

### Fixed
**For bug fixes**

Use this section to document:
- Bug fixes
- Performance issues resolved
- Browser compatibility fixes

**Example:**
```markdown
### Fixed
- Fixed Safari scroll issue in navigation
- Resolved TypeScript compilation errors
- Fixed mobile menu overflow bug
```

---

### Security
**For security updates**

Use this section to document:
- Security vulnerabilities fixed
- Security-related dependency updates

**Example:**
```markdown
### Security
- Patched XSS vulnerability in form inputs
- Updated dependencies with security fixes
```

---

## Section Guidelines

### Order of Sections

Always present sections in this order:
1. Added
2. Changed
3. Deprecated
4. Removed
5. Fixed
6. Security

### When to Use Each Section

| Section | Use When | Don't Use When |
|---------|----------|----------------|
| **Added** | Introducing new features | Making internal improvements |
| **Changed** | Modifying existing behavior | Fixing bugs |
| **Deprecated** | Marking for future removal | Actually removing |
| **Removed** | Deleting features | Marking for deprecation |
| **Fixed** | Resolving bugs | Adding features |
| **Security** | Addressing vulnerabilities | General updates |

---

## Examples

### Example 1: Feature Release (v1.1.0)

```markdown
# Release v1.1.0

**Release Date:** December 1, 2025  
**Type:** Minor Release

## Added
- Dark mode support with theme toggle
- New `useTheme` hook
- Theme persistence in localStorage

## Changed
- Updated component styles to support dark mode
- Improved accessibility with WCAG 2.1 AA compliance

## Fixed
- Fixed focus outline visibility in dark mode
- Resolved keyboard navigation issue in modal
```

### Example 2: Bug Fix Release (v1.0.1)

```markdown
# Release v1.0.1

**Release Date:** November 20, 2025  
**Type:** Patch Release

## Fixed
- Fixed production build failing on Windows
- Resolved mobile menu not closing on route change
- Fixed TypeScript error in Header component

## Security
- Updated dependency with security patch
```

### Example 3: Breaking Change Release (v2.0.0)

```markdown
# Release v2.0.0

**Release Date:** January 1, 2026  
**Type:** Major Release

## Added
- New component API with better TypeScript support
- Automatic code generation for routes

## Changed
- **BREAKING:** Updated `Button` component props structure
- **BREAKING:** Changed default behavior of `Layout` component

## Removed
- Removed deprecated `OldComponent`
- Removed legacy configuration options

## Migration Guide
See [Migration Guide](./migration-v2.md) for upgrade instructions.
```

---

## Best Practices

### ✅ Do's

1. **Be specific** - Clearly describe what changed
2. **Include examples** - Show code examples for API changes
3. **Link to documentation** - Reference relevant docs
4. **Explain breaking changes** - Provide migration guides
5. **Credit contributors** - Acknowledge community contributions
6. **Include issue numbers** - Reference GitHub issues (#123)

### ❌ Don'ts

1. **Don't be vague** - Avoid "various improvements"
2. **Don't skip sections** - Include all relevant sections
3. **Don't duplicate** - Each change should appear once
4. **Don't mix sections** - Keep bug fixes in Fixed, not Added
5. **Don't omit breaking changes** - Always document API changes

### Writing Style

**Good Examples:**
- ✅ "Added `Button` component with primary, secondary, and danger variants"
- ✅ "Fixed Safari not rendering navigation correctly on iOS 15"
- ✅ "Updated React to 19.1.0 for improved performance"

**Bad Examples:**
- ❌ "Improved stuff"
- ❌ "Fixed bug"
- ❌ "Updated things"

---

## Template

Use this template for new releases:

```markdown
# Release vX.Y.Z

**Release Date:** [Date]  
**Type:** [Major/Minor/Patch] Release

---

## Table of Contents

- [Overview](#overview)
- [Added](#added)
- [Changed](#changed)
- [Fixed](#fixed)
- [Links](#links)

---

## Overview

Brief description of the release.

---

## Added

- New feature 1
- New feature 2

## Changed

- Change 1
- Change 2

## Fixed

- Bug fix 1
- Bug fix 2

---

## Links

- **[← Back to Changelog](./README.md)**
- **[View Roadmap](../ROADMAP.md)**
- **[Main README](../README.md)**

---

**Released:** [Date]  
**License:** MIT
```

---

## References

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**[← Back to Changelog](./README.md)**

