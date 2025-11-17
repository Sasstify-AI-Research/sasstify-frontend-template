# Git Workflow for Contributors

Complete Git workflow from fork to pull request.

**Time:** 5 minutes

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Initial Setup](#initial-setup)
- [Regular Workflow](#regular-workflow)
- [Commit Your Changes](#commit-your-changes)
- [Push Changes](#push-changes)
- [Create Pull Request](#create-pull-request)
- [After PR is Merged](#after-pr-is-merged)
- [Keeping Your Fork Updated](#keeping-your-fork-updated)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)
- [Quick Reference](#quick-reference)
- [Next Steps](#next-steps)

---

## Before You Start

### Find or Create an Issue

**Before writing any code, ensure there's an issue for your work:**

1. **Search existing issues**
   - Check [open issues](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/issues)
   - See if someone already reported this bug or requested this feature

2. **Found an existing issue?**
   - Comment: "I'd like to work on this"
   - Wait for maintainer approval/assignment
   - Check if it's already assigned to someone else

3. **No existing issue?**
   - Create a new issue using:
     - [Bug Report Template](./templates/bug-report.md) for bugs
     - [Feature Request Template](./templates/feature-request.md) for features
   - Wait for maintainer approval before starting work

4. **Get the green light ✅**
   - Maintainer will:
     - Approve or reject the proposal
     - Assign the issue to you
     - Add it to the project roadmap (and internal tracking if needed)

**Why this matters:**
- ✅ Avoids wasted effort on rejected features
- ✅ Prevents duplicate work
- ✅ Ensures your contribution aligns with project goals
- ✅ Links your PR to the issue for tracking
- ✅ Helps maintainers plan and prioritize

**⚠️ Important:** PRs without linked issues may be rejected!

---

## Initial Setup

Now that you have an approved issue, let's set up your environment:

### 1. Fork the Repository

Go to [sasstify-frontend-template](https://github.com/Sasstify-AI-Research/sasstify-frontend-template) and click **Fork**.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/sasstify-frontend-template.git
cd sasstify-frontend-template
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/Sasstify-AI-Research/sasstify-frontend-template.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR_USERNAME/sasstify-frontend-template.git (fetch)
# upstream  https://github.com/Sasstify-AI-Research/sasstify-frontend-template.git (fetch)
```

### 4. Install Dependencies

```bash
npm install
```

**Detailed installation:** [Installation Guide](../quick-start/01-installation.md)

---

## Regular Workflow

### 1. Sync Your Fork

**Before starting new work, sync with upstream:**

```bash
# Fetch latest changes
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Push to your fork
git push origin main
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/add-dark-mode` - New features
- `fix/header-mobile-bug` - Bug fixes
- `docs/improve-readme` - Documentation
- `refactor/optimize-lazy-load` - Refactoring
- `test/add-component-tests` - Tests
- `chore/update-deps` - Maintenance

### 3. Make Your Changes

**Edit files following:**
- [Making Changes Guide](../quick-start/03-making-changes.md)
- [Common Tasks](../quick-start/04-common-tasks.md)

### 4. Stage Changes

```bash
# Stage specific files
git add src/components/YourComponent.tsx

# Stage all changes
git add .

# Check what's staged
git status
```

### 5. Commit Changes

```bash
git commit -m "feat(components): add dark mode toggle"
```

**Commit format:** [Commit Conventions](./02-commit-conventions.md)

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

Go to GitHub and click **"Compare & pull request"**.

**PR process:** [Pull Request Process](./03-pull-request-process.md)

---

## Common Git Tasks

### Updating Your Branch

**If main branch has new commits:**

```bash
# Switch to main
git checkout main

# Sync with upstream
git fetch upstream
git merge upstream/main
git push origin main

# Switch back to your branch
git checkout feature/your-feature-name

# Rebase onto latest main
git rebase main

# Force push (if already pushed)
git push origin feature/your-feature-name --force-with-lease
```

### Fixing Last Commit

```bash
# Edit files
# Stage changes
git add .

# Amend last commit
git commit --amend

# Push (if already pushed)
git push origin feature/your-feature-name --force-with-lease
```

### Squashing Commits

```bash
# Interactive rebase last 3 commits
git rebase -i HEAD~3

# Follow prompts to squash commits
# Force push
git push origin feature/your-feature-name --force-with-lease
```

### Resolving Merge Conflicts

```bash
# During rebase, if conflicts occur:
# 1. Fix conflicts in editor
# 2. Stage resolved files
git add .

# 3. Continue rebase
git rebase --continue

# 4. Force push
git push origin feature/your-feature-name --force-with-lease
```

---

## Best Practices

### Do's ✅

- ✅ Keep branches focused (one feature/fix per branch)
- ✅ Sync with upstream regularly
- ✅ Write descriptive commit messages
- ✅ Test before pushing
- ✅ Rebase on main before PR

### Don'ts ❌

- ❌ Don't work directly on `main` branch
- ❌ Don't force push to `main`
- ❌ Don't commit `node_modules/`
- ❌ Don't commit sensitive data
- ❌ Don't use `git push --force` (use `--force-with-lease`)

---

## Troubleshooting

### "fatal: refusing to merge unrelated histories"

```bash
git pull upstream main --allow-unrelated-histories
```

### Accidentally committed to main

```bash
# Create new branch from main
git branch feature/my-changes

# Reset main to upstream
git reset --hard upstream/main

# Switch to new branch
git checkout feature/my-changes

# Push to your fork
git push origin feature/my-changes
```

### Want to undo all local changes

```bash
# Discard all uncommitted changes
git reset --hard HEAD

# Clean untracked files
git clean -fd
```

---

## Next Steps

✅ **Git workflow ready!**

**Next:** [Commit Conventions](./02-commit-conventions.md) →

Learn how to write good commit messages.

---

**More help:**
- [GitHub Docs - Fork a Repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [Git Documentation](https://git-scm.com/doc)

