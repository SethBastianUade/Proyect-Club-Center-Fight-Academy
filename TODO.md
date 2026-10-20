# TO DO — Club Center Fight Academy

Estado al 2026-10-20. Sitio en React + Vite, deploy en Cloudflare (`clubcenter.kreta.com.ar`).

## Sin login (conversión)

### 1. Grilla de horarios filtrable — ✅ hecho, con pendientes
- [x] Grilla en `/horarios`, transcripta de la grilla impresa
- [x] Filtro por disciplina y por día (queda en la URL: `/horarios?d=muaythai`)
- [x] Marca el día de hoy
- [x] "Reservar prueba" en cada clase abre WhatsApp con la clase precargada
- [x] Horarios en un archivo de datos (`src/data/horarios.js`)
- [ ] Filtro por **nivel** (principiante / avanzado): falta que el club pase qué nivel tiene cada clase
- [ ] Que **recepción edite los horarios sin tocar código**: depende del panel admin (punto 5)

### 2. Precios y planes con comparador — ✅ hecho, con pendientes
- [x] Tarjetas de planes en `/precios`, con el plan destacado marcado
- [x] Tabla comparativa (desde tablet)
- [x] "Inscribirme" lleva a `/inscripcion` con el plan ya elegido
- [x] "Consultar" abre WhatsApp con el nombre del plan
- [ ] **Cargar los precios y planes reales** (hoy son de ejemplo en `src/data/planes.js`)

### 3. Calendario de eventos — ✅ hecho, con pendientes
- [x] `/eventos` con próximos y anteriores, separados según la fecha
- [x] Página propia por evento (`/eventos/:slug`) con "Compartir" y botón de WhatsApp
- [x] Próximos eventos en el inicio
- [ ] **Cargar los eventos reales** (hoy son de ejemplo en `src/data/eventos.js`)
- [ ] Foto o flyer por evento
- [ ] Preview propia al compartir en WhatsApp/Instagram: necesita prerender o un Worker que reescriba los meta tags

### 4. Perfiles de profesores y competidores — ✅ hecho, con pendientes
- [x] Profesores y competidores en `/nosotros`
- [x] Perfil individual (`/equipo/:slug`) con récord, logros y galería si se cargan
- [ ] **Cargar los profesores reales** con foto (hoy son de ejemplo en `src/data/equipo.js`)
- [ ] Récord, logros y fotos de cada competidor

## Con panel admin (Workers + D1 + Cloudflare Access)

### 5. Mini CMS — ⏳ pendiente
- [ ] Base D1 con horarios, eventos, precios y equipo
- [ ] Panel con login (Cloudflare Access) para cargar y editar
- [ ] Pasar el sitio a leer de D1 en vez de `src/data/`

### 6. Leads — ⏳ pendiente
- [ ] La inscripción guarda en D1 además de abrir WhatsApp
- [ ] Tabla de interesados con estado: contactado / vino a la prueba / se inscribió
- [ ] Anti-spam en el formulario (Turnstile)

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

## Otros pendientes
- [ ] Puntaje y cantidad de reseñas de Google (para mostrarlo en la sección de opiniones)
- [ ] Auditoría de performance (Core Web Vitals) y de accesibilidad antes de entregar al cliente
- [ ] Anotar en `AGENTS.md` que este proyecto ya no es vanilla
