# TO DO — Club Center Fight Academy

Estado al 2026-10-20. Sitio en React + Vite, deploy en Cloudflare (`clubcenter.kreta.com.ar`).

## Sin login (conversión)

### 1. Grilla de horarios filtrable — ✅ hecho, con pendientes
- [x] Grilla en `/horarios`, transcripta de la grilla impresa
- [x] Filtro por disciplina y por día (queda en la URL: `/horarios?d=muaythai`)
- [x] Marca el día de hoy
- [x] "Reservar prueba" en cada clase abre WhatsApp con la clase precargada
- [x] Horarios en un archivo de datos (`src/data/horarios.js`)
- [x] Nivel: todas las clases son para todos los niveles (se aclara en `/horarios`, no hace falta filtro)
- [ ] Que **recepción edite los horarios sin tocar código**: depende del panel admin (punto 5)

### 2. Precios y planes con comparador — ✅ hecho
- [x] Tarjetas de planes en `/precios`, con el plan destacado marcado
- [x] Tabla comparativa (desde tablet)
- [x] "Inscribirme" lleva a `/inscripcion` con el plan ya elegido
- [x] "Consultar" abre WhatsApp con el nombre del plan
- [x] Precios y planes reales cargados (5 planes, de $62.900 a $84.900)

### 3. Calendario de eventos — ✅ hecho, con pendientes
- [x] `/eventos` con próximos y anteriores, separados según la fecha
- [x] Página propia por evento (`/eventos/:slug`) con "Compartir" y botón de WhatsApp
- [x] Próximos eventos en el inicio
- [x] Se sacaron los eventos de ejemplo: hoy no hay eventos y la página lo indica con link a Instagram
- [ ] Cargar eventos cuando haya (`src/data/eventos.js`)
- [ ] Foto o flyer por evento
- [ ] Preview propia al compartir en WhatsApp/Instagram: necesita prerender o un Worker que reescriba los meta tags

### 4. Competidores destacados — ✅ hecho, con pendientes
- [x] Competidores destacados en `/nosotros` (la sección de profesores se sacó)
- [x] Perfil individual (`/equipo/:slug`) con récord, logros y galería si se cargan
- [ ] Récord, logros y fotos de cada competidor (`src/data/equipo.js`)

## Con panel admin (Workers + D1 + login propio)

### 5. Mini CMS — ⏳ pendiente
- [ ] Tablas en D1 para horarios, eventos, precios y competidores
- [ ] Pantallas del panel para cargar y editar (el login ya existe)
- [ ] Pasar el sitio a leer de D1 en vez de `src/data/`

### 6. Leads — ✅ hecho
- [x] La inscripción guarda en D1 (`POST /api/leads`) además de abrir WhatsApp
- [x] Panel `/admin` con los interesados, filtro y conteo por estado (nuevo / contactado / vino a la prueba / se inscribió / descartado), notas y botón de WhatsApp
- [x] Anti-spam básico: campo trampa + solo acepta envíos desde el propio sitio
- [x] Login del panel con contraseña propia (sin Cloudflare Access, que pide tarjeta): sesión de 7 días y bloqueo tras 5 intentos fallidos
- [x] Migraciones aplicadas en producción
- [x] Contraseña cargada como secret del Worker `clubcenter-web` (cambiarla: `npx wrangler secret put ADMIN_PASSWORD`)
- [ ] Anti-spam fuerte con Turnstile si empieza a entrar basura

## Para alumnos

### 7. Área de alumno — ⏳ pendiente
- [ ] Login de alumnos
- [ ] Cuota al día o vencida
- [ ] Graduación o cinturón actual
- [ ] Historial de asistencia

### 8. Check-in con QR — ⏳ pendiente (necesita el 7)
- [ ] QR por alumno o en recepción
- [ ] Registro de asistencia

### 9. Pago online con Mercado Pago — ⏳ pendiente (necesita el 7)
- [ ] Link de pago o checkout
- [ ] Webhook a un Worker que marca la cuota como pagada

## Otras cosas hechas
- [x] Todos los WhatsApp van a recepción (+54 9 11 3159-8373), con mensaje precargado
- [x] Migración a React + Vite (el sitio viejo quedó en `legacy/`, fuera de git)
- [x] Deploy en Cloudflare con dominio propio
- [x] Rediseño mobile first: estética oscura con vidrio y header tipo píldora
- [x] Reseñas de Google nativas en lugar del widget pago de Elfsight
- [x] Mejoras de UX: bloque "Próximas clases" en el inicio, horarios arrancan en "hoy" en el celu, tarjeta de clase entera clickeable, sin barra de cookies (no se usan), email opcional en la inscripción
- [x] SEO local: JSON-LD `SportsActivityLocation`, Open Graph, `sitemap.xml` (se genera en el build) y `robots.txt`
- [x] Performance: íconos como SVG inline y fuentes servidas desde el sitio (sin Font Awesome ni Google Fonts por CDN)

## Otros pendientes
- [x] Estadística del inicio: "Entrenando desde 2020" (en lugar de "10+ años")
- [ ] Puntaje y cantidad de reseñas de Google (para mostrarlo en la sección de opiniones)
- [ ] Auditoría de performance (Core Web Vitals) y de accesibilidad antes de entregar al cliente
- [x] `CLAUDE.md` con la arquitectura actual (React + Vite + Worker + D1)
