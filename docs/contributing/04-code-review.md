# Code Review Standards

What reviewers look for and how to get PRs approved faster.

**Time:** 5 minutes

---

## Table of Contents

- [Review Criteria](#review-criteria)
- [What Gets PRs Approved Faster](#what-gets-prs-approved-faster)
- [Review Process](#review-process)
- [Common Feedback Examples](#common-feedback-examples)
- [Responding to Feedback](#responding-to-feedback)
- [Disagreeing with Feedback](#disagreeing-with-feedback)
- [Review Timeline](#review-timeline)
- [Self-Review Checklist](#self-review-checklist)
- [Getting Better at Reviews](#getting-better-at-reviews)
- [Next Steps](#next-steps)

---

## Review Criteria

### 1. Code Quality

**Reviewers check:**
- ✅ TypeScript strict mode (no `any`)
- ✅ Follows React best practices
- ✅ No anti-patterns or code smells
- ✅ Error handling implemented
- ✅ Edge cases considered

**Study existing code:**
- [Component Library](../reusable-implementations/)
- [Project Structure](../quick-start/02-project-structure.md)

### 2. Consistency

**Reviewers check:**
- ✅ Matches existing code style
- ✅ Uses established patterns
- ✅ File structure follows conventions
- ✅ Naming conventions followed
- ✅ Import organization consistent

**Reference:**
- [Making Changes](../quick-start/03-making-changes.md)

### 3. Performance

**Reviewers check:**
- ✅ No unnecessary re-renders
- ✅ Proper use of React hooks
- ✅ Lazy loading for heavy components
- ✅ Bundle size impact acceptable

**Measure impact:**

```bash
npm run build:analyze
```

**Learn more:**
- [Performance Guide](../performance-optimization-guide/)
- [Lazy Loading Patterns](../reusable-implementations/lazy-loading/)

### 4. Testing

**Reviewers check:**
- ✅ Code tested in development
- ✅ Code tested in production build
- ✅ Works in multiple browsers
- ✅ Responsive design tested
- ✅ Edge cases tested

**Testing checklist:**

```bash
npm run dev              # Test in development
npm run build            # Test build
npm run preview          # Test production
npm run type-check       # TypeScript
npm run lint             # Code quality
```

### 5. Documentation

**Reviewers check:**
- ✅ Code is self-documenting
- ✅ Complex logic has comments
- ✅ Component docs updated (if new component)
- ✅ README updated (if major feature)
- ✅ Examples provided

**Documentation standards:**
- Follow existing doc patterns in `docs/`
- Add to [Component Library](../reusable-implementations/) if reusable

### 6. Browser Compatibility

**Reviewers check:**
- ✅ Works in Chrome (latest)
- ✅ Works in Firefox (latest)
- ✅ Works in Safari (latest) - **Important!**
- ✅ Works on mobile browsers

**Safari is critical** - test Safari-specific issues.

### 7. Accessibility

**Reviewers check:**
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ ARIA labels where needed
- ✅ Color contrast sufficient
- ✅ Screen reader friendly

---

## What Gets PRs Approved Faster

### ✅ Do These

1. **Small, focused PRs** - Easier to review
2. **Clear description** - Explain what and why
3. **Screenshots** - For UI changes
4. **Tests pass** - All CI checks green
5. **Follow patterns** - Match existing code
6. **Good commit messages** - Clear history
7. **Documentation** - Updated as needed
8. **Responsive feedback** - Quick replies to comments

### ❌ Avoid These

1. **Huge PRs** - Hard to review (>500 lines)
2. **Mixed changes** - Multiple unrelated fixes
3. **Failing tests** - CI must pass
4. **No description** - Unclear purpose
5. **Breaking changes** - Without discussion
6. **Ignoring feedback** - Address all comments
7. **Force pushing** - During review

---

## Review Process

### Step 1: Automated Checks (Immediate)

**CI runs:**
- TypeScript type checking
- ESLint linting
- Production build
- Bundle size check

**All must pass.** ✅

### Step 2: Maintainer Review (2-3 days)

**Reviewer examines:**
- Code quality and patterns
- Performance impact
- Documentation completeness
- Test coverage

**Possible outcomes:**
- ✅ **Approved** - Ready to merge!
- 💬 **Changes requested** - Feedback provided
- ❓ **Questions** - Need clarification

### Step 3: Feedback Loop (Ongoing)

**If changes requested:**
1. Read feedback carefully
2. Ask questions if unclear
3. Make changes
4. Respond to comments
5. Re-request review

**Be patient and responsive.**

### Step 4: Approval & Merge (When ready)

**When approved:**
- Maintainer merges PR
- Your changes go live
- You're credited

**Congratulations!** 🎉

---

## Common Feedback Examples

### Code Quality

**Feedback:**
> "Avoid using `any`. Please add proper TypeScript types."

**Response:**

```typescript
// Before
const data: any = fetchData();

// After
interface UserData {
  id: string;
  name: string;
}
const data: UserData = fetchData();
```

---

**Feedback:**
> "This component re-renders unnecessarily. Use `useCallback` for the handler."

**Response:**

```typescript
// Before
<Button onClick={() => handleClick(id)} />

// After
const handleButtonClick = useCallback(() => {
  handleClick(id);
}, [id]);

<Button onClick={handleButtonClick} />
```

---

### Consistency

**Feedback:**
> "Please follow the existing component structure. Separate types into `.types.ts` file."

**Response:**
Create `Component.types.ts` and move interfaces there.

---

### Documentation

**Feedback:**
> "Please add documentation following the existing pattern in `docs/reusable-implementations/components/`."

**Response:**
Create markdown doc following existing component doc structure.

---

### Performance

**Feedback:**
> "This component is heavy. Please use lazy loading."

**Response:**

```typescript
import { lazy } from 'react';
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

See: [Lazy Loading Patterns](../reusable-implementations/lazy-loading/)

---

## Responding to Feedback

### Good Responses ✅

```
✅ "Fixed in commit abc1234. I've updated the types as requested."

✅ "Good catch! I've refactored to use useCallback. Much cleaner now."

✅ "I'm not sure I understand. Could you clarify what you mean by...?"

✅ "I considered that approach, but chose this because... What do you think?"
```

### Poor Responses ❌

```
❌ "Fixed." (No details)

❌ "This is fine." (Dismissive)

❌ "I don't want to change it." (Uncooperative)

❌ (No response) (Ignoring feedback)
```

---

## Disagreeing with Feedback

**It's okay to disagree!**

**How to disagree respectfully:**

1. **Understand first** - Ask clarifying questions
2. **Explain reasoning** - Share your perspective
3. **Provide alternatives** - Suggest other solutions
4. **Be open** - Maybe reviewer is right
5. **Escalate if needed** - Ask for third opinion

**Example:**
> "I see your point about X. I chose Y approach because Z reason. However, I'm open to changing it if you think X is better for [specific reason]. What do you think?"

---

## Review Timeline

**Expected timelines:**

| PR Type | Initial Response | Full Review | Approval |
|---------|-----------------|-------------|----------|
| **Simple** (docs, small fix) | 1-2 days | 2-3 days | 3-5 days |
| **Standard** (feature, component) | 2-3 days | 5-7 days | 1-2 weeks |
| **Complex** (large feature, refactor) | 3-5 days | 1-2 weeks | 2-3 weeks |

**No response?**
- Wait 3-5 business days
- Politely ping with comment
- Ensure CI checks are passing

---

## Self-Review Checklist

**Before requesting review:**

- [ ] I've reviewed my own code
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] TypeScript strict mode (no `any`)
- [ ] Follows existing patterns
- [ ] Documentation updated
- [ ] Screenshots added (UI changes)
- [ ] Commit messages follow conventions
- [ ] PR description is clear
- [ ] No merge conflicts

---

## Getting Better at Reviews

### Learn from Feedback

**Track common feedback:**
- What do reviewers often comment on?
- Which patterns do you miss?
- What can you improve?

**Study merged PRs:**
- Look at approved PRs
- See what patterns they follow
- Learn from examples

### Improve Over Time

**Each PR should be better:**
- Fewer review cycles needed
- Faster approvals
- Higher quality code

**You'll get better with practice!** 🚀

---

## Next Steps

✅ **Code review standards understood!**

**Now you know:**
- What reviewers look for
- How to get PRs approved faster
- How to respond to feedback
- How to handle disagreements

**Start Contributing:**
1. Pick an issue
2. Follow [Git Workflow](./01-git-workflow.md)
3. Submit a great PR!

---

**Need help?**
- [GitHub Discussions](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/discussions)
- [Contributing Overview](./README.md)

