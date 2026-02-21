## Learned User Preferences

- Always verify `vite.config.ts` is clean before closing a session — `rollupOptions.input` and `devServerMiddleware` entries must only exist for pages that physically exist under `src/pages/`.
- After running `npm run test:scripts`, audit `src/components/`, `src/components/blocks/`, and `src/components/ui/` for leftover `script-test-*` artifact directories and delete them; also delete `.vite-cache/obfuscation-cache.json` if it has grown stale.
- Always kill orphaned `vitest` processes left behind by a hung `npm run test:scripts` run before doing anything else.
- Before declaring any task complete, run `npm run type-check && npm run lint` and ensure they both pass cleanly.
- Run `npm run build` to confirm the production bundle compiles without errors after significant config or source changes.
- Before committing any changes, audit and update all affected documentation under `docs/` and `README.md` — any change to directory structure, component paths, script behaviour, or page inventory must be reflected in the relevant docs before the commit. Key docs to check: `docs/quick-start/02-project-structure.md`, `docs/scripts/README.md`, `docs/reusable-implementations/`, and `README.md`.
- Before committing any changes, always generate or update the changelog first — create `changelog/vX.Y.Z.md` following the Keep a Changelog format used in this project, bump the version appropriately (patch for fixes, minor for new features, major for breaking changes), and update `changelog/README.md` to list the new version as the latest release.
- When asked to create a PR (or "PR message"), always produce the full body using the project PR template below. Fill every section from the actual commits being merged — mark the correct Type of Change checkboxes with `[x]`, list every changed file/area under "Changes Made", pre-fill the Automated Testing checklist based on what was verified, and leave screenshot / performance / breaking-change sections blank only when genuinely not applicable. Never output a partial template.

  ```markdown
  ## Description
  <!-- Provide a clear and concise description of what this PR does -->

  ## Related Issue
  Closes #
  Fixes #
  Related to #

  ## Type of Change
  - [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
  - [ ] ✨ New feature (non-breaking change that adds functionality)
  - [ ] 💥 Breaking change (fix or feature that causes existing functionality to not work as expected)
  - [ ] 📚 Documentation update
  - [ ] ♻️ Code refactoring (no functional changes)
  - [ ] ⚡ Performance improvement
  - [ ] 🧪 Test addition or update
  - [ ] 🔧 Configuration change
  - [ ] 🎨 Style/UI change

  ## Changes Made
  -
  -
  -

  ## Testing Performed
  ### Automated Testing
  - [ ] `npm run type-check` passes
  - [ ] `npm run lint` passes
  - [ ] `npm run build` succeeds
  - [ ] No new TypeScript errors
  - [ ] No new ESLint warnings

  ### Manual Testing
  - [ ] Tested in development (`npm run dev`)
  - [ ] Tested in production build (`npm run preview`)
  - [ ] Tested in **Chrome**
  - [ ] Tested in **Firefox**
  - [ ] Tested in **Safari**
  - [ ] Tested on **mobile/tablet** (responsive design)
  - [ ] Tested keyboard navigation
  - [ ] Tested with screen reader (if applicable)

  ### Test Scenarios
  1.
  2.
  3.

  ## Screenshots / Videos
  ### Before
  ### After

  ## Performance Impact
  **Bundle size:** Before: / After: / Impact:
  **Build time:** Before: / After: / Impact:
  **Runtime performance:** Metrics: / Impact:

  ## Documentation
  - [ ] Updated component documentation (if new component added)
  - [ ] Updated README.md (if major feature)
  - [ ] Updated CHANGELOG.md
  - [ ] Added code comments for complex logic
  - [ ] Updated related documentation in `docs/`
  - [ ] Added JSDoc comments for exported functions/components

  ## Breaking Changes
  **Breaking changes:** -
  **Migration guide:** -
  **Deprecation notices:** -

  ## Checklist
  - [ ] My code follows the project's [coding standards](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/blob/main/docs/contributing/README.md#coding-standards)
  - [ ] I have performed a self-review of my code
  - [ ] I have commented my code, particularly in hard-to-understand areas
  - [ ] My changes generate no new warnings or errors
  - [ ] I have added tests that prove my fix is effective or that my feature works
  - [ ] New and existing unit tests pass locally with my changes
  - [ ] Any dependent changes have been merged and published
  - [ ] My commit messages follow the [commit conventions](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/blob/main/docs/contributing/02-commit-conventions.md)
  - [ ] I have updated the documentation accordingly
  - [ ] My branch is up-to-date with the base branch
  - [ ] There are no merge conflicts

  ## Additional Notes

  ## For Reviewers
  **Please pay special attention to:**
  -
  -
  **Questions for reviewers:**
  -
  -

  ---
  **Thank you for contributing!** 🙏
  Please ensure you've read our [Contributing Guide](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/blob/main/docs/contributing/README.md) and [Code Review Standards](https://github.com/Sasstify-AI-Research/sasstify-frontend-template/blob/main/docs/contributing/04-code-review.md).
  ```

- Commit messages must follow Conventional Commits (`docs/contributing/02-commit-conventions.md`). Format: `<type>(<scope>): <subject>` on the first line (max 72 chars), followed by an optional body (wrap at 72 chars) and optional footer for breaking changes or issue refs. Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`. Valid scopes: `components`, `blocks`, `ui`, `pages`, `hooks`, `scripts`, `build`, `config`, `docs`, `tests`, `deps`. For multi-area commits use a multiline body broken into `##` sections (one per area of change) as seen in the project's existing commit history.
- Use the CLI scripts (`npm run create:page`, `npm run create:block`, `npm run create:component`, `npm run create:ui-component`) for scaffolding — never create or delete page/block/component files manually.
- Centralise all page copy strings in a `content.ts` file co-located with the page — never hardcode strings directly inside JSX components.
- Hero / above-fold sections must always be eagerly loaded (never inside `Suspense` or `viewportLazyLoad`); every below-fold section should use `viewportLazyLoad`.
- Performance targets that must not regress: LCP < 2 s, SEO-friendly HTML (OG tags, canonical link, structured data), mobile responsive with Tailwind breakpoints.
- Prefer shadcn/ui components over building custom ones from scratch.
- Do not write unit tests unless explicitly requested; write functional/integration tests instead.
- Use `ultra think` (extended reasoning) when asked to deep-analyse a complex bug or design problem.
- AGENTS.md must be at the project root and will be visible only if the file explorer shows hidden files — instruct the user to do so if they can't find it.

## Learned Workspace Facts

- Project root for the frontend template: `sasstify-frontend-template/` inside the workspace.
- Currently only two real pages exist: `src/pages/index/` (protected — must not be deleted) and `src/pages/page-not-found/`.
- Directory layout: `src/components/blocks/` (full-page layout blocks), `src/components/ui/` (primitive components: `footer`, `header`, `section`, `viewport-lazy-load`).
- The dev-server middleware sentinel comment in `vite.config.ts` must be exactly `// Add more page rewrites here as needed for new pages` (not "Add new") for `scripts/create-page.js` to inject new routes correctly.
- `scripts/delete-page.js` had a template-literal bug on its warning line (single-quoted string prevented `${updateCount}` interpolation) — this was fixed; the current version is correct.
- `npm run test:scripts` runs real end-to-end integration tests that invoke the CLI scripts and create actual files in `src/`; if the process is killed mid-run it leaves test artifacts behind.
- Obfuscation cache lives at `.vite-cache/obfuscation-cache.json`; it must be cleared whenever pages are removed to avoid stale entries causing ESLint `ENOENT` crashes.
- `@tailwindcss/typography` is already in `devDependencies` but is **not yet** wired into `tailwind.config.ts` plugins — pending task.
- Pending SEO work for `src/pages/index/index.html`: OG meta tags (`og:title`, `og:description`, `og:image`, `og:type`), `<link rel="canonical">`, `ld+json` structured data, and `public/sitemap.xml`.
- `vite-plugin-compression` (Brotli/gzip) is installed but not yet configured in `vite.config.ts` — pending performance task.
- Internal links to `/dashboard/` in `IndexHeroSection.tsx` and `Index.tsx` are broken (the dashboard page was removed) — pending cleanup.
- `public/robots.txt` exists and correctly allows all bots.
- This template is a generic, project-agnostic frontend scaffold — it is not tied to any specific product or backend service; treat it as a reusable starting point for any web project.
