<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OpenDayCare (open-daycare)

Daycare management app (guardería) on the Next.js 16 App Router. UI copy, mockups, and spec skills are in Spanish — keep code copy in Spanish.

## Commands (no test suite, no `typecheck` script)

- `npm run dev` — dev server (port 3000)
- `npm run lint` — eslint (config: `eslint.config.mjs`)
- `npm run build` — typechecks (TS) + builds
- `npm run start` — serve production build

## Stack gotchas (Next 16, verified against `node_modules/next/dist/docs/`)

- **Middleware was renamed to Proxy**: route protection uses `proxy.ts` at the repo root, **not** `middleware.ts`.
- `cookies()`, `headers()`, and `LayoutProps` are async/await-based in this version.
- Path alias `@/*` → repo root (`tsconfig.json`).
- Tailwind CSS v4 via `@tailwindcss/postcss` — **no `tailwind.config`**; theme lives in `app/globals.css` (`@theme inline`).

## Layout

- `app/` — App Router source. Still the create-next-app starter page; the app is not built yet.
- `references/pantallas/*.dc.html` — interactive UI mockups (design docs in dc-runtime format, rendered via `support.js`). They are **reference material, not app code** — do not edit or import them.
- `references/screenshots/*.png` — Playwright reference screenshots.
- `specs/` — spec-driven workflow output (folder does not exist yet; see skills).

## Skills / workflow

- `.agents/skills/spec` and `spec-impl` implement a spec-driven workflow (source: `klerith/fernando-skills`, see `skills-lock.json`). `/spec` writes specs to `specs/NN-slug.md`; `/spec-impl` implements approved ones on a `spec-NN-slug` branch. Always follow the skill's phases; specs are written in the same language as the prompt.

## MCPs

- Playwright MCP (configured in `opencode.json`): screenshots and any Playwright-related artifacts go in `.playwright-mcp/` (gitignored), never in the repo.

## Spec Drive Development - Skills
- /spec Usaremos esta habilidad para crear las especificaciones
- /spec-impl Usaremos esta skill para hacer las implementaciones

## Reglas de código
- Usar código limpio, nombres, funciones, variables, etc  en ingles.


