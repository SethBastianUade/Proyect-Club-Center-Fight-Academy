# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Club Center Fight Academy (martial arts gym in CABA, Argentina). React 19 + Vite SPA, deployed as static assets on Cloudflare Workers (`clubcenter.kreta.com.ar`). All UI copy, identifiers, comments and commit messages are in Spanish (rioplatense: "inscribite", "reservá") — keep it that way.

**Stale docs:** `README.md` and the files in `plans/` describe the previous vanilla HTML/CSS/JS site (`index.html`, `script.js`, `chatbot.js`, etc.), which now lives only in the gitignored `legacy/` folder. Don't follow them for the current code. `TODO.md` is the up-to-date feature status and roadmap.

## Commands

```bash
npm run dev       # Vite dev server
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

- **Routing:** `src/main.jsx` wraps `App` in `BrowserRouter` (react-router v8, imports from `'react-router'`). `src/App.jsx` declares all routes nested under `components/Layout.jsx`, which renders the header/nav (`NAV` array), footer, mobile WhatsApp bar, floating WhatsApp button and back-to-top (the last two only from tablet up). Adding a page = new file in `src/pages/` + a `<Route>` in `App.jsx` + an entry in `NAV` if it belongs in the menu.
- **SPA on Cloudflare:** `wrangler.jsonc` serves `./dist` with `not_found_handling: "single-page-application"` so deep links fall back to `index.html`. Cloudflare Builds only runs `wrangler deploy`, so the `build.command` in `wrangler.jsonc` is what compiles the site there.
- **Worker + D1 (`worker/index.js`):** runs only for `/api/*` (`run_worker_first`); everything else is static assets. D1 binding is `DB`; schema changes go in `migrations/` as new numbered files. `POST /api/leads` is public (signup form, honeypot field `web`, same-origin check). `/api/admin/*` requires a session cookie (`__Host-sesion`, `<expiry>.<HMAC>` signed with `ADMIN_PASSWORD`, 7 days) obtained from `POST /api/admin/login`; changing the password invalidates all sessions, and without the secret nobody can log in. Failed logins are rate-limited per IP via the `login_fallidos` table (5 per 15 min). Cloudflare Access was dropped on purpose (requires a credit card). Lead states are duplicated in three places that must stay in sync: the `CHECK` in the migration, `ESTADOS` in the Worker and `ESTADOS` in `src/pages/Admin.jsx`.
- **`/admin`** (`src/pages/Admin.jsx`) is a route outside `Layout`, for the club's staff to manage leads; it shows its own password screen.
- **Content lives in `src/data/*.js`**, not in components. Pages import plain arrays/objects from there (`horarios`, `planes`, `eventos`, `equipo` → `COMPETIDORES`, `disciplinas`, `opiniones`). Disciplines are keyed by id (`muaythai`, `boxeo`, `bjj`, `mma`, …) and those keys are referenced from `horarios.js` and forms; `color` in `disciplinas.js` drives the schedule grid. Several files are flagged `TODO(cliente)` because they hold placeholder data (plans/prices, events, competitors' records). The roadmap (TODO.md) is to eventually move this content to Cloudflare D1 + an admin panel.
- **WhatsApp is the conversion channel.** There's no backend: forms (`Inscripcion`, `Contacto`) and CTAs build a prefilled message and redirect via `wa(texto)` from `src/data/site.js`, which also holds the phone, address, email and Instagram. Always go through `wa()` instead of hardcoding `wa.me` links.
- **State in the URL:** filters/preselections use query params (`/horarios?d=muaythai`, `/inscripcion` with a preselected plan) via `useSearchParams`.
- **Per-page meta:** call `useMeta(titulo, descripcion)` from `components/ui.jsx` in each page. The static `<title>`/description in `index.html` remain as the fallback for link previews (no prerender exists). `ui.jsx` also has the shared `Hero`, `SectionHeader` and `Cta` building blocks.
- **Styling:** a single global stylesheet, `src/index.css` (no CSS modules/Tailwind). Mobile-first with breakpoints 640/768/1024px, design tokens as CSS variables on `:root` (dark zinc + glass, orange `--accent`, Instrument Serif + Inter). Fonts are self-hosted via `@fontsource` (imported in `main.jsx`).
- **Icons:** `<Icono n="whatsapp" />` from `components/Icono.jsx` renders Font Awesome icons as inline SVG (class `.icono`). Only icons registered in its `ICONOS` map are bundled — add new ones there. There is no Font Awesome CSS, so `<i className="fa-...">` won't render.
- **SEO:** `index.html` holds the static Open Graph tags and a `SportsActivityLocation` JSON-LD (address, phone, opening hours — keep in sync with `site.js`/`horarios.js`). `vite.config.js` generates `sitemap.xml` at build time from a `PAGINAS` list (mirror of the routes in `App.jsx`) plus the slugs in `eventos.js`/`equipo.js`.
- **Static assets:** images are in `public/Fotos/` (referenced as `/Fotos/...`), mostly `.webp`; data entries carry explicit `w`/`h` for `<img>` dimensions.
