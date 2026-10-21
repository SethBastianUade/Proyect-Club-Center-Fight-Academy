# Club Center Fight Academy — sitio web

Sitio de [Club Center Fight Academy](https://clubcenter.kreta.com.ar), academia de artes marciales en Solis 1213, CABA.

- **Sitio público:** inicio, disciplinas, horarios, precios, eventos, nosotros, contacto e inscripción.
- **Panel del club (`/admin`):** interesados que se inscriben por el formulario, métricas de clics a WhatsApp, y edición de precios, horarios, eventos y competidores.

## Stack

- React 19 + Vite (SPA)
- Cloudflare Worker (`worker/`): API, contenido insertado en cada página, sitemap
- Cloudflare D1 (SQLite): contenido editable, interesados, fotos, métricas — migraciones en `migrations/`
- Todo en el plan gratis de Cloudflare

## Desarrollo

```bash
npm install
npm run db:migrate:local   # crea la base local
npm run dev:api            # Worker + D1 local en :8787
npm run dev                # sitio en Vite (pide /api al Worker)
```

Para entrar a `/admin` en local, crear `.dev.vars` con `ADMIN_PASSWORD=local-dev`.

## Producción

- El deploy es automático: Cloudflare Builds publica cada push a `main` (Worker `clubcenter-web`).
- **Migraciones nuevas:** `npm run db:migrate` **antes** de pushear el código que las usa.
- **Contraseña del panel:** `npx wrangler secret put ADMIN_PASSWORD`.
- **Backup de la base:** `npm run db:backup` → `backups/ccfa-AAAA-MM-DD.sql` (no se sube a git).

## Más info

- [`TODO.md`](TODO.md): qué está hecho y qué falta.
- [`plan.md`](plan.md): plan de login y check-in de socios integrado con BiFrost.
- [`CLAUDE.md`](CLAUDE.md): arquitectura detallada.
