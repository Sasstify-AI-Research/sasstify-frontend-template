# AI-Assisted UI Development

Guidance for building safely with AI copilots inside the Sasstify Frontend Template.

---

## Why This Exists

AI-assisted changes are only as safe as the context they inherit. This template enforces:

- **Predictable structure** so copilots always know where code belongs.
- **Automation-first workflows** that generate and remove files consistently.
- **Documentation** that makes intent and constraints explicit.

Use this document as the canonical reference before letting an AI agent scaffold or refactor UI.

---

## Architecture Guardrails

### 1. Shared Components (`src/components/`)
- Houses layout primitives (header, footer, section, layout, lazy loaders, hooks, utilities).
- All reusable logic lives here; AI edits are reviewed once and benefit every page.
- Strict TypeScript + CSS module patterns minimize accidental prop drift.

### 2. Page Silos (`src/pages/<page>/`)
- Every page owns its `index.html`, `main.tsx`, page component, optional CSS module, and assets.
- Keeps routing, metadata, and data-fetching context local to the page.
- Prevents AI copilots from mixing unrelated content when editing multiple surfaces.

### 3. Page-Scoped Components (`src/pages/<page>/components/`)
- For components that only make sense within a page experience (wizard steps, hero cards, etc.).
- Guards against leaking experimental code into the global components directory.
- Makes dependency analysis trivial for the delete-page script.

### 4. Configuration Alignment (`vite.config.ts`)
- `rollupOptions.input` and dev server middleware mirror the folder layout.
- The automation scripts update these sections so AI doesn’t need to touch config manually.

---

## Automation Workflows

### Create Page (`npm run create:page`)
- Validates kebab-case names, duplicate detection, optional CSS + component generation.
- Bootstraps React 19 root, QueryClient provider, and metadata.
- Emits next steps and URLs so humans/AI know exactly where to continue.

### Delete Page (`npm run delete:page`)
- Confirms intent twice, blocks protected `index`.
- Removes the entire page directory, dist artifacts, and prunes `vite.config.ts`.
- Performs dependency analysis and deletes unused shared components (including `.module.css`, `.types.tsx`, `.scss`, etc.).

**Rule:** Always run these scripts instead of manual `mkdir`/`rm` to keep the project map consistent for AI tooling.

---

## Safe AI Collaboration Guidelines

1. **Stay In-Bounds**  
   - Touch files only within the relevant page directory or shared components.  
   - When in doubt, search `src/components/` before creating a new primitive.

2. **Respect Type Hints**  
   - Use existing `.types.ts` definitions or extend them explicitly instead of inline `any`.

3. **Pair With Tests/Lint**  
   - Run `npm run lint` and `npm run type-check`. Add Vitest/Playwright coverage once roadmap items land.

4. **Document Intent**  
   - Update docs or inline comments whenever AI agents introduce new patterns or assumptions.

5. **Review Automation Output**  
   - After scripts run, skim the console summary (component/dependency deletion lists) before committing.

---

> For upcoming safety work (testing, accessibility, security, telemetry), follow the canonical `ROADMAP.md`. All future enhancements are tracked there rather than in this guide.

## Checklist Before Letting AI Modify UI

- [ ] Page created via `npm run create:page`
- [ ] Shared primitives exist in `src/components/` (add if missing)
- [ ] Page-local components inside `src/pages/<page>/components/`
- [ ] Lint + type-check clean
- [ ] Page delete should happen only via `npm run delete:page`
- [ ] Docs updated for any new patterns

If any box is unchecked, resolve it first; otherwise AI edits risk drifting from established context.

---

## Need Help?

- Review `docs/` index for component, hook, and script references.
- Ask in project discussions or open a doc issue if something is unclear.

Safe, context-aware AI work starts with structure—keep it consistent and the copilots will follow suit. 🚀

