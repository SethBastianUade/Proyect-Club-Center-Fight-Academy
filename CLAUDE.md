# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Club Center Fight Academy (martial arts gym in CABA, Argentina). React 19 + Vite SPA plus a Cloudflare Worker with D1, deployed as the Worker `clubcenter-web` (`clubcenter.kreta.com.ar`). Everything must stay on Cloudflare's free tier (no Access, no R2: both require a credit card). All UI copy, identifiers, comments and commit messages are in Spanish (rioplatense: "inscribite", "reservá") — keep it that way.

**Stale docs:** `README.md` and the files in `plans/` describe the previous vanilla HTML/CSS/JS site (`index.html`, `script.js`, `chatbot.js`, etc.), which now lives only in the gitignored `legacy/` folder. Don't follow them for the current code. `TODO.md` is the up-to-date feature status and roadmap.

## Commands

```bash
npm run dev       # Vite dev server (content comes from /api/contenido, so run dev:api too)
npm run build     # build to dist/
npm run preview   # serve dist/
npm run deploy    # vite build && wrangler deploy

npm run dev:api           # Worker + D1 local en :8787 (vite dev proxya /api ahí)
npm run db:migrate:local  # aplica migrations/ a la D1 local
npm run db:migrate        # aplica migrations/ a la D1 de producción
```

For local `/admin`, `.dev.vars` (gitignored) sets `ADMIN_PASSWORD=local-dev`. In production the password is a Worker secret: `npx wrangler secret put ADMIN_PASSWORD`.

There are no tests, linter or formatter configured.

## Architecture

- **Routing:** `src/main.jsx` wraps `App` in `BrowserRouter` (react-router v8, imports from `'react-router'`). `src/App.jsx` declares all routes nested under `components/Layout.jsx`, which renders the header/nav (`NAV` array; "Eventos" is hidden while there are no upcoming events), footer, mobile WhatsApp bar (hidden on `/inscripcion` and `/contacto`, and on `/` until the hero is scrolled past), floating WhatsApp button and back-to-top (the last two only from tablet up). The header "Inscribite" goes to the `/inscripcion` form so the lead is saved. Adding a page = new file in `src/pages/` + a `<Route>` in `App.jsx` + an entry in `NAV` if it belongs in the menu.
- **SPA on Cloudflare:** `wrangler.jsonc` serves `./dist` with `not_found_handling: "single-page-application"` so deep links fall back to `index.html`. Cloudflare Builds only runs `wrangler deploy`, so the `build.command` in `wrangler.jsonc` is what compiles the site there. **Apply new migrations to production (`npm run db:migrate`) before pushing** code that depends on them.
- **Worker + D1 (`worker/`):** runs for every request except `/assets/*`, `/Fotos/*` and `robots.txt` (`run_worker_first`). `index.js` is the router (route list at the top), `contenido.js` the content CRUD and photos, `paginas.js` the HTML pages and `sitemap.xml`. D1 binding is `DB`; schema changes go in `migrations/` as new numbered files. `POST /api/leads` is public (signup form, honeypot field `web`, same-origin check). `/api/admin/*` requires a session cookie (`__Host-sesion`, `<expiry>.<HMAC>` signed with `ADMIN_PASSWORD`, 7 days) obtained from `POST /api/admin/login`; changing the password invalidates all sessions, and without the secret nobody can log in. Failed logins are rate-limited per IP via the `login_fallidos` table (5 per 15 min). Cloudflare Access was dropped on purpose (requires a credit card). Lead states are duplicated in three places that must stay in sync: the `CHECK` in the migration, `ESTADOS` in the Worker and `ESTADOS` in `src/pages/admin/Leads.jsx`.
- **Editable content lives in D1** (tables `planes`, `clases`, `eventos`, `competidores`, `fotos`; see `migrations/0003_contenido.sql`), not in the code. On every HTML request `worker/paginas.js` injects it as `window.__CONTENIDO__` (plus per-event/per-competitor `<title>`/Open Graph tags and the JSON-LD); `src/contenido.jsx` (`ContenidoProvider` / `useContenido()`) reads it, falling back to `GET /api/contenido` when it's missing (vite dev). `useContenido()` also exposes `cargando` (detail pages render nothing until it's false) and `recargar()`. `normalizar()` there adapts DB rows to what pages expect (plan `items`, competitor `record` "12-3-1" → `{g,p,e}`, `logros` text → array).
- **Static data/helpers in `src/data/`:** `disciplinas.js` (keyed by id: `muaythai`, `boxeo`, `bjj`, `mma`, `grappling`, `sparring`; `clases.disc` references these keys, `color` drives the schedule grid and card accents, `sinReserva` disciplines show "Sin reserva" instead of a WhatsApp booking link; `PRINCIPALES` = home, `FICHAS` = `/disciplinas`, `INSCRIBIBLES` = signup form), `site.js`, `opiniones.js`, and only helpers in `horarios.js`, `planes.js`, `eventos.js`.
- **`/admin`** (`src/pages/admin/`) is a route outside `Layout` with its own password screen. Sections: Interesados (`Leads.jsx`) and one generic `Editor.jsx` per content table, described in `secciones.js` (fields, labels, list summary). The Worker side is `TABLAS` in `worker/contenido.js` (column types and validation, ordering, slug generation; slugs are created once from the title/name and never change so shared links don't break). **Adding a field = migration + `TABLAS` + `secciones.js`**; table/column names in SQL only ever come from `TABLAS`. Photos are resized to WebP in the browser, stored as BLOBs in D1 and served from `/api/fotos/:id` with immutable cache.
- **WhatsApp is the conversion channel.** Forms (`Inscripcion`, `Contacto`) and CTAs build a prefilled message and redirect via `wa(texto)` from `src/data/site.js`, which also holds the phone, address, email and Instagram. Always go through `wa()` instead of hardcoding `wa.me` links.
- **State in the URL:** filters/preselections use query params (`/horarios?d=muaythai`, `/inscripcion` with a preselected plan) via `useSearchParams`.
- **Per-page meta:** call `useMeta(titulo, descripcion)` from `components/ui.jsx` in each page. The static `<title>`/description in `index.html` are what link previews see, except on event and competitor pages, whose tags the Worker rewrites. `ui.jsx` also has the shared `Hero`, `SectionHeader` and `Cta` building blocks.
- **Styling:** a single global stylesheet, `src/index.css` (no CSS modules/Tailwind). Mobile-first with breakpoints 640/768/1024px, design tokens as CSS variables on `:root` (dark zinc + glass, orange `--accent`, Instrument Serif + Inter). Fonts are self-hosted via `@fontsource` (imported in `main.jsx`).
- **Icons:** `<Icono n="whatsapp" />` from `components/Icono.jsx` renders Font Awesome icons as inline SVG (class `.icono`). Only icons registered in its `ICONOS` map are bundled — add new ones there. There is no Font Awesome CSS, so `<i className="fa-...">` won't render.
- **SEO:** `index.html` holds the static Open Graph tags and a fallback `SportsActivityLocation` JSON-LD (`#ld-negocio`); in production `worker/paginas.js` replaces it with opening hours and price range computed from D1 (address/phone there must match `site.js`). The Worker also serves `sitemap.xml` from a `PAGINAS` list (mirror of the routes in `App.jsx`) plus event and competitor slugs.
- **Static assets:** images are in `public/Fotos/` (referenced as `/Fotos/...`), mostly `.webp`. Competitors carry `w`/`h` for `<img>` dimensions (the panel fills them on upload).
