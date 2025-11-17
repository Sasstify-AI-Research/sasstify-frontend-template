# Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, standardized commit messages.

**Time:** 5 minutes

---

## Table of Contents

- [Format](#format)
- [Types](#types)
- [Scopes](#scopes)
- [Subject Line Rules](#subject-line-rules)
- [Body (Optional)](#body-optional)
- [Footer (Optional)](#footer-optional)
- [Complete Examples](#complete-examples)
- [Atomic Commits](#atomic-commits)
- [Before Committing](#before-committing)
- [Tools](#tools)
- [Why These Conventions?](#why-these-conventions)
- [Next Steps](#next-steps)

---

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Required

- **type** - Commit type (feat, fix, docs, etc.)
- **subject** - Short description (max 72 chars)

### Optional

- **scope** - Area of change (components, hooks, build, etc.)
- **body** - Detailed explanation (wrap at 72 chars)
- **footer** - Breaking changes, issue references

---

## Types

| Type | Use For | Example |
|------|---------|---------|
| `feat` | New features | `feat(components): add dark mode toggle` |
| `fix` | Bug fixes | `fix(header): resolve mobile menu overlap` |
| `docs` | Documentation only | `docs(contributing): add git workflow guide` |
| `style` | Code formatting (no logic change) | `style: fix indentation in Footer component` |
| `refactor` | Code refactoring | `refactor(utils): simplify smoothScroll logic` |
| `perf` | Performance improvements | `perf(lazy-load): reduce intersection observer overhead` |
| `test` | Adding/updating tests | `test(hooks): add tests for useMobile hook` |
| `chore` | Maintenance tasks | `chore(deps): update React to 19.1.0` |
| `build` | Build system changes | `build(vite): optimize chunk splitting` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |

---

## Scopes

**Common scopes:**
- `components` - UI components
- `hooks` - React hooks
- `pages` - Page components
- `utils` - Utility functions
- `scripts` - Build scripts
- `docs` - Documentation
- `build` - Build configuration
- `deps` - Dependencies
- `tests` - Testing

**Examples:**
- `feat(components): add Button component`
- `fix(hooks): resolve useMobile SSR issue`
- `docs(pages): update dashboard documentation`

---

## Subject Line Rules

1. **Max 72 characters**
2. **Lowercase after type/scope**
3. **No period at end**
4. **Imperative mood** ("add" not "added")
5. **Describe what commit does** (not what you did)

### Good Examples ✅

```
feat(components): add dark mode toggle
fix(header): resolve mobile navigation bug
docs(readme): update installation instructions
perf(build): optimize vendor chunk splitting
```

### Bad Examples ❌

```
Update files                          # Too vague, no type
feat: Added new component.            # Wrong tense, has period
feat(components): adding the dark mode toggle for theme switching  # Too long (>72 chars)
Fixed stuff                           # No type, vague
```

---

## Body (Optional)

**Use body to explain:**
- **What** changed (if not obvious from subject)
- **Why** you made the change
- **How** it works (if complex)

**Format:**
- Wrap lines at 72 characters
- Leave blank line after subject
- Use bullet points for multiple points

**Example:**

```
feat(components): add dark mode toggle

Implemented dark mode support with:
- localStorage persistence for user preference
- System preference detection via matchMedia
- CSS variable updates for theme switching
- Smooth transition animations

The toggle respects system settings by default
and persists user choice across sessions.
```

---

## Footer (Optional)

**Use footer for:**
- Issue references
- Breaking changes
- Co-authors

**Examples:**

### Issue Reference

```
feat(components): add dark mode toggle

Closes #123
Fixes #456
Refs #789
```

### Breaking Change

```
refactor(api): update component API

BREAKING CHANGE: The Button component now requires
a `variant` prop. Update all usage:

Before: <Button>Click</Button>
After: <Button variant="primary">Click</Button>
```

### Co-authors

```
feat(components): add dark mode toggle

Co-authored-by: John Doe <john@example.com>
```

---

## Complete Examples

### Simple Feature

```
feat(components): add ThemeToggle component
```

### Bug Fix with Details

```
fix(lazy-load): resolve Safari intersection observer issue

Safari 17 requires explicit rootMargin for IntersectionObserver.
Updated ViewportLazyLoad component to handle Safari-specific
behavior with 50px rootMargin.

Fixes #234
```

### Documentation Update

```
docs(contributing): add commit conventions guide

Added comprehensive guide covering:
- Conventional commits format
- Type and scope usage
- Good vs bad examples
- Complete commit examples
```

### Performance Optimization

```
perf(build): optimize vendor chunk splitting

Reduced bundle size by 15% through:
- Separated React vendor bundle
- Extracted TanStack Query to separate chunk
- Enabled tree shaking for lucide-react

Before: 520 KB gzipped
After: 442 KB gzipped
```

### Refactoring

```
refactor(hooks): simplify useSectionNavigation

Removed unnecessary useEffect and simplified state management.
Behavior remains unchanged, but code is more maintainable.
```

---

## Atomic Commits

**One logical change per commit:**

### Good ✅

```
git commit -m "feat(components): add Button component"
git commit -m "feat(components): add Input component"
git commit -m "docs(components): add Button documentation"
```

### Bad ❌

```
git commit -m "feat: add Button and Input and docs and fix bug"
```

---

## Before Committing

**Checklist:**
- [ ] Commit message follows format
- [ ] Type is correct
- [ ] Scope is appropriate (if used)
- [ ] Subject is clear and under 72 chars
- [ ] Body explains "why" (if needed)
- [ ] Issue referenced (if applicable)
- [ ] Code tested and works

---

## Tools

### Verify Commit Message

```bash
# Check last commit message
git log -1 --pretty=%B
```

### Amend Last Commit

```bash
# Fix commit message of last commit
git commit --amend -m "feat(components): add Button component"
```

---

## Why These Conventions?

✅ **Clear history** - Easy to understand changes  
✅ **Automated changelogs** - Generate release notes automatically  
✅ **Better collaboration** - Team understands changes  
✅ **Easier debugging** - Find when bugs introduced  
✅ **Semantic versioning** - Auto-detect version bumps

---

## Next Steps

✅ **Commit conventions mastered!**

**Next:** [Pull Request Process](./03-pull-request-process.md) →

Learn how to submit your changes for review.

---

**References:**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

