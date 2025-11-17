# Pull Request Process

Complete guide for submitting and reviewing pull requests.

**Time:** 7 minutes

---

## Table of Contents

- [Before Submitting](#before-submitting)
- [Creating a Pull Request](#creating-a-pull-request)
- [PR Template Example](#pr-template-example)
- [Draft Pull Requests](#draft-pull-requests)
- [Code Review Process](#code-review-process)
- [Addressing Review Feedback](#addressing-review-feedback)
- [Merge Requirements](#merge-requirements)
- [After Merge](#after-merge)
- [Common Issues](#common-issues)
- [PR Best Practices](#pr-best-practices)
- [PR Size Guidelines](#pr-size-guidelines)
- [Getting Help](#getting-help)
- [Next Steps](#next-steps)

---

## Before Submitting

### Pre-Submission Checklist

- [ ] **Code works** - Tested locally in dev and production
- [ ] **Tests pass** - `npm run type-check` and `npm run lint`
- [ ] **Builds successfully** - `npm run build`
- [ ] **Documentation updated** - If adding features
- [ ] **Commits follow conventions** - See [Commit Conventions](./02-commit-conventions.md)
- [ ] **Branch up-to-date** - Synced with upstream main
- [ ] **No merge conflicts**

### Testing Checklist

```bash
# Type check
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Preview build
npm run preview
```

**All must pass** before submitting PR. ✅

---

## Creating a Pull Request

### 1. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 2. Go to GitHub

Visit your fork on GitHub. You'll see:

```
"feature/your-feature-name had recent pushes"
[Compare & pull request]
```

Click **"Compare & pull request"**.

### 3. Fill Out PR Template

GitHub automatically populates the PR description using our [Pull Request Template](../../.github/PULL_REQUEST_TEMPLATE.md).

**Title format** (like commit message):

```
feat(components): add dark mode toggle
```

**The template includes:**
- Description and related issue links
- Type of change checklist
- Testing checklist (automated & manual)
- Screenshots/videos section
- Performance impact section
- Documentation checklist
- Breaking changes section

**Fill out all applicable sections** and delete any that don't apply to your PR.

### 4. Select Base Branch

**Base:** `main` (upstream repository)  
**Compare:** `feature/your-feature-name` (your fork)

### 5. Submit

Click **"Create pull request"**.

---

## PR Template Example

```markdown
## Description
Adds a dark mode toggle component with persistent theme preference.

## Related Issue
Closes #123

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Changes Made
- Added `ThemeToggle` component
- Implemented localStorage persistence
- Added system preference detection
- Updated global CSS with theme variables

## Testing Performed
- [x] `npm run type-check` passes
- [x] `npm run lint` passes
- [x] `npm run build` succeeds
- [x] Tested in Chrome, Firefox, Safari
- [x] Tested responsive design
- [x] Tested system preference detection
- [x] Tested localStorage persistence

## Screenshots
### Light Mode
![Light mode screenshot](url)

### Dark Mode
![Dark mode screenshot](url)

## Additional Notes
Works with all existing components. No breaking changes.
```

---

## Draft Pull Requests

**Use draft PRs when:**
- Work in progress
- Need early feedback
- Demonstrating approach
- Blocked by other issues

**To create draft PR:**
1. Click dropdown on "Create pull request"
2. Select "Create draft pull request"

**Mark ready for review when:**
- All checklist items complete
- Ready for full review

---

## Code Review Process

### What Happens Next?

1. **Automated Checks** (immediate)
   - CI/CD runs tests
   - Linting checks
   - Type checking
   - Build verification

2. **Maintainer Review** (2-3 business days)
   - Code quality
   - Follows project patterns
   - Documentation complete
   - Tests adequate

3. **Feedback Loop** (ongoing)
   - Address review comments
   - Make requested changes
   - Re-request review

4. **Approval & Merge** (when ready)
   - Maintainer approves
   - PR is merged
   - Branch is deleted

### Review Timeline

- **Initial response:** 2-3 business days
- **Full review:** ~1 week for standard PRs
- **Complex PRs:** May take longer

---

## Addressing Review Feedback

### 1. Read Comments Carefully

Understand what's being requested. Ask questions if unclear.

### 2. Make Changes

```bash
# Make changes in your branch
# Stage and commit
git add .
git commit -m "fix: address review feedback"

# Push
git push origin feature/your-feature-name
```

**The PR updates automatically** when you push.

### 3. Respond to Comments

- Reply to each comment when addressed
- Use "✅ Fixed in abc1234" or "✅ Updated"
- Mark conversations as resolved (if you have permission)

### 4. Re-request Review

Click **"Re-request review"** button when ready.

### 5. Don't Force Push

**Avoid** `git push --force` during review unless requested.

**Why?** Reviewers need to see new changes.

---

## Merge Requirements

**PR can be merged when:**
- ✅ All CI checks pass (tests, linting, build)
- ✅ At least 1 approving review from maintainer
- ✅ No unresolved conversations
- ✅ Branch up-to-date with main
- ✅ No merge conflicts

---

## After Merge

### What Happens

1. **PR is merged** to main branch
2. **Your branch is deleted** (optional, recommended)
3. **Issue is closed** (if linked with "Closes #123")
4. **You're credited** in commit history
5. **Change is in next release**

### Update Your Fork

```bash
# Switch to main
git checkout main

# Sync with upstream
git fetch upstream
git merge upstream/main

# Push to your fork
git push origin main

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## Common Issues

### CI Checks Failing

**If tests fail:**
1. Check GitHub Actions logs
2. Run tests locally: `npm run type-check && npm run lint && npm run build`
3. Fix issues
4. Push fixes

**Common failures:**
- TypeScript errors
- ESLint violations
- Build errors
- Merge conflicts

### Merge Conflicts

**If conflicts occur:**

```bash
# Sync your branch with main
git fetch upstream
git checkout feature/your-feature-name
git rebase upstream/main

# Fix conflicts in editor
# Stage resolved files
git add .

# Continue rebase
git rebase --continue

# Force push (with lease for safety)
git push origin feature/your-feature-name --force-with-lease
```

### Changes Requested

Don't be discouraged! This is normal.

**Address feedback:**
- Make requested changes
- Explain your reasoning if you disagree
- Ask questions if unclear

---

## PR Best Practices

### Do's ✅

- ✅ Keep PRs focused (one feature/fix)
- ✅ Write clear description
- ✅ Include screenshots for UI changes
- ✅ Test thoroughly before submitting
- ✅ Respond to feedback promptly
- ✅ Be open to suggestions

### Don'ts ❌

- ❌ Don't submit huge PRs (>500 lines)
- ❌ Don't mix multiple unrelated changes
- ❌ Don't force push during review
- ❌ Don't take feedback personally
- ❌ Don't ignore CI failures

---

## PR Size Guidelines

**Ideal PR sizes:**
- **Small:** 1-50 lines - Perfect! ✅
- **Medium:** 50-200 lines - Good ✅
- **Large:** 200-500 lines - Okay, but consider splitting
- **Huge:** 500+ lines - Please split into multiple PRs

**How to split large PRs:**
1. Infrastructure/setup PR
2. Core functionality PR
3. Tests PR
4. Documentation PR

---

## Getting Help

**Questions about PR process?**
- Comment on your PR
- Ask in [GitHub Discussions](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/discussions)
- Email: software-engineer-404@sasstify.com

**PR not getting attention?**
- Wait 3-5 business days
- Politely ping with comment
- Check if CI checks are passing

---

## Next Steps

✅ **PR process mastered!**

**Next:** [Code Review](./04-code-review.md) →

Learn what reviewers look for and expectations.

---

**References:**
- [GitHub Docs - Pull Requests](https://docs.github.com/en/pull-requests)
- [Pull Request Template](../../.github/PULL_REQUEST_TEMPLATE.md) - Auto-populated by GitHub

