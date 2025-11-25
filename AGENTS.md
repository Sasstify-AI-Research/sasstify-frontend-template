## Learned User Preferences

- Always verify `vite.config.ts` is clean before closing a session — `rollupOptions.input` and `devServerMiddleware` entries must only exist for pages that physically exist under `src/pages/`.
- After running `npm run test:scripts`, audit `src/components/`, `src/components/blocks/`, and `src/components/ui/` for leftover `script-test-*` artifact directories and delete them; also delete `.vite-cache/obfuscation-cache.json` if it has grown stale.
- Always kill orphaned `vitest` processes left behind by a hung `npm run test:scripts` run before doing anything else.
- Before declaring any task complete, run `npm run type-check && npm run lint` and ensure they both pass cleanly.
- Run `npm run build` to confirm the production bundle compiles without errors after significant config or source changes.
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
