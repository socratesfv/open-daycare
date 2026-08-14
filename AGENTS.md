<!-- BEGIN:nextjs-agent-rules -->

# Language
- responde siempre en español

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
- `specs/` — spec-driven workflow output (see skills). Any spec that touches the database (schema, tables, enums, RLS, migrations, triggers, functions, seed data) MUST be written under `specs/database/`, not at the `specs/` root. UI/feature specs stay at the root.

## Skills / workflow

- `.agents/skills/spec` and `spec-impl` implement a spec-driven workflow (source: `klerith/fernando-skills`, see `skills-lock.json`). `/spec` writes specs to `specs/NN-slug.md`; `/spec-impl` implements approved ones on a `spec-NN-slug` branch. Always follow the skill's phases; specs are written in the same language as the prompt.
- `.agents/skills/supabase` y `.agents/skills/supabase-postgres-best-practices` (source: `supabase/agent-skills`). Carga la skill **supabase** para CUALQUIER tarea que toque Supabase y la skill **supabase-postgres-best-practices** ANTES de escribir o modificar SQL/esquemas de Postgres (columnas, índices, RLS, migraciones, funciones, triggers).

## MCPs

- Playwright MCP (configured in `opencode.json`): screenshots and any Playwright-related artifacts go in `.playwright-mcp/` (gitignored), never in the repo.
- Supabase MCP (configurado a nivel de usuario en `~/.config/opencode/opencode.jsonc`): tools `list_tables`, `execute_sql`, `apply_migration`, `search_docs`, `get_advisors`, logs, etc. Apunta al proyecto remoto (ver `SUPABASE_PROJECT_REF` abajo).

## Supabase

- Project ref: `kwuomokdodheudsfigev` · API URL: `https://kwuomokdodheudsfigev.supabase.co` (datos en el MCP de usuario).
- No hay CLI de Supabase instalado → usa las tools MCP (`execute_sql`, `apply_migration`, `get_advisors`) en lugar de `supabase db ...`. No existe carpeta `supabase/` ni `.mcp.json` en el repo.
- **Siempre usar migraciones:** TODA manipulación de la base de datos (crear/alterar/drop de tablas, columnas, índices, RLS, políticas, funciones, triggers, comentarios, cambios de esquema o estructura) debe hacerse mediante `apply_migration` con un nombre descriptivo en snake_case. Nunca uses `execute_sql` para cambiar el esquema: esa herramienta queda reservada para consultas de solo lectura (SELECT) y verificación/diagnóstico. Cada `apply_migration` registra una entrada de migración versionada y deja historial auditable.
- Env: `.env.template` define `SUPABASE_DB_PASSWORD`. `.env` está gitignored (`.gitignore` permite `.env.template`). No commitees claves/secretos.
- Reglas de oro (ver skills para el detalle completo):
  - Activa RLS en TODA tabla de `public` y crea políticas con el patrón `TO authenticated USING (owner)`, nunca solo `TO authenticated`.
  - Nunca uses `user_metadata` en decisiones de autorización (es editable por el usuario); usa `app_metadata`.
  - Nunca expongas `service_role`/secret keys en el frontend; en Next.js todo `NEXT_PUBLIC_*` va al navegador.
  - Views no bypass RLS con `security_invoker = true`; UPDATE requiere política SELECT; las funciones `SECURITY DEFINER` en `public` son públicas.
  - Para iterar esquemas usa `apply_migration` con nombres descriptivos (cada llamada crea una entrada de migración); `execute_sql` es solo para consultas de solo lectura y diagnóstico.
- SDK cliente: antes de usarlo, consulta la doc actual vía Context7/MCP `search_docs` (Supabase cambia seguido).

## Spec Drive Development - Skills
- /spec Usaremos esta habilidad para crear las especificaciones
- /spec-impl Usaremos esta skill para hacer las implementaciones

## Supabase Skills
- Carga la skill **supabase** (`.agents/skills/supabase`) para cualquier tarea que toque Supabase: Auth, RLS, Storage, Edge Functions, Realtime, migraciones, logs.
- Carga la skill **supabase-postgres-best-practices** (`.agents/skills/supabase-postgres-best-practices`) antes de escribir o modificar SQL/esquemas de Postgres.

## Reglas de código
- Usar código limpio, nombres, funciones, variables, etc  en ingles.


