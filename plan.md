# Plan: check-in de socios desde la web, integrado con BiFrost

Estado al 2026-10-20. Cubre los puntos 7, 8 y 9 de `TODO.md` (área de alumno, check-in y pago online).

## Contexto

- El club hoy usa **Mis Actividades** para socios, cuotas y asistencias.
- Esas funciones se están replicando en **BiFrost** (POS/CRM SaaS propio: Spring Boot + PostgreSQL + React), que va a reemplazar a Mis Actividades.
- Uno de los objetivos es que **los socios hagan el check-in por su cuenta**. La web del club (`clubcenter.kreta.com.ar`, React + Cloudflare Worker + D1) es el lugar natural para hacerlo desde el celular.

> **Ojo:** el análisis de BiFrost de este documento se hizo sobre una copia local **desactualizada** (en ese momento no tenía módulo de gimnasio y el login era solo para el personal del negocio). Antes de implementar hay que revisar el contrato de la sección 4 contra el estado actual de BiFrost y ajustarlo.

## 1. Decisión principal: BiFrost es la fuente de verdad

La web **no guarda** socios, cuotas ni asistencias: se los pide a BiFrost y le manda los check-ins. Así hay una sola base de datos de socios y no hay que sincronizar nada.

| Dato | Dónde vive |
|---|---|
| Socios, planes, vencimientos, pagos, asistencias | BiFrost |
| Reglas de check-in (cuota vencida, clases del plan agotadas) | BiFrost |
| Contraseñas de los socios | BiFrost (recomendado: si mañana hay una app de socios, usa la misma cuenta) |
| Horarios de clases, precios públicos, eventos, competidores | Web (D1, editable desde `/admin`) |
| Sesión del socio en el celular | Web (cookie firmada) |
| Token de integración con BiFrost | Secret del Worker, nunca en el navegador |

Queda descartada la idea de cargar alumnos y cuotas en el panel de la web.

## 2. Arquitectura

```
Celular del socio                Web (Cloudflare Worker)                BiFrost (backend)
─────────────────                ───────────────────────                ─────────────────
escanea QR de recepción
  → /checkin?c=CODIGO ─────────→ valida código del QR y ubicación
                                 lee su cookie de sesión
                                 (si no hay: pide DNI + contraseña) ──→ POST socios/login
                                 detecta la clase según el horario
                                 ─────────────────────────────────────→ POST socios/{id}/asistencias
                                 ←──────────────── OK / rechazo con motivo
  ← "✅ Check-in: Muay Thai 19 hs"
     o "⚠️ Tu cuota venció, pasá por recepción"
```

- El Worker habla con BiFrost **servidor a servidor**, con un token compartido (mismo patrón que `X-Service-Token` entre BiFrost y el microservicio ARCA).
- El backend de BiFrost tiene que estar publicado en internet con HTTPS.

## 3. Flujo del socio

1. **Alta (una vez):** recepción da de alta al socio en BiFrost (o ya viene migrado de Mis Actividades) y le da un **código de activación**.
2. **Primer ingreso:** el socio escanea el QR, entra con DNI + código de activación y elige su contraseña.
3. **Días siguientes:** escanea el QR y listo: el celular ya tiene la sesión (dura ~90 días). Check-in en un toque.
4. **Si algo falla**, la pantalla dice por qué (cuota vencida, sin clases disponibles en el plan, ya hizo check-in en esa clase) y que pase por recepción.
5. **Olvido de contraseña:** recepción genera un nuevo código de activación desde BiFrost.

### Validar que la persona está en el club

- **Etapa 1:** QR impreso en recepción con un código secreto (`/checkin?c=...`) **+** ubicación del celular a menos de ~150 m de Solis 1213. Si el socio no da permiso de ubicación, se acepta igual pero queda marcado para revisión.
- **Etapa 2 (si hay abuso):** QR que cambia cada minuto, mostrado en una tablet de recepción (`/recepcion/qr`, código firmado con HMAC por ventana de tiempo).

### Qué clase es

La web usa los horarios del CMS (tabla `clases`): toma la clase que empieza en los próximos 30 minutos o empezó hace menos de 15. Si hay más de una posible, el socio elige. Si no hay ninguna (entrenamiento libre), se registra sin clase.

## 4. Contrato de la API que necesita la web

> **Implementado en BiFrost (2026-10-20, plan 035 de BiFrost).** Diferencias con la propuesta original de abajo:
> - **Base:** `https://bifrost-software.com.ar/api/integrations/club` (va en `BIFROST_URL`).
> - **Token por negocio:** se genera en BiFrost (Abonos y actividades → Check-in desde la web), se muestra una sola vez y va en el secret `BIFROST_TOKEN`. No hay `X-Business-Id`. Token inválido: `401 TOKEN_INVALIDO`; negocio sin CRM: `403 INTEGRACION_INACTIVA`.
> - **Cupo semanal, no mensual:** `estado` devuelve `plan.clasesPorSemana`, `clasesUsadasSemana` y `clasesRestantesSemana` (null = libre), semana de lunes a domingo.
> - **El QR lo genera y valida BiFrost:** `POST /socios/{id}/asistencias` lleva `codigoQr` (el `c` del link). Si no coincide: `403 QR_INVALIDO`. Con BiFrost real la web ya no usa `CHECKIN_CODIGO` (queda solo para el modo simulado). El QR se imprime desde BiFrost.
> - **Hora:** BiFrost registra con su propia hora; `fechaHora` se ignora (la del celular se puede adelantar).
> - **Cuota vencida:** bloquea desde el día siguiente al vencimiento.
> - **Contraseña:** mínimo 6 caracteres. Código de activación: 6 caracteres, un solo uso, vence a los 7 días. 5 intentos fallidos bloquean la cuenta 15 minutos.
> - `GET /socios/{id}/asistencias` y `POST /prospectos` no están implementados.


Base: `https://<backend-bifrost>/api/integrations/club` (nombre a definir con el estado actual de BiFrost).

**Autenticación de todas las llamadas:** header `X-Service-Token: <token>`. El token identifica al negocio Club Center (o se manda además `X-Business-Id`, según cómo maneje hoy BiFrost el multi-tenant).

**Errores:** JSON `{ "codigo": "CUOTA_VENCIDA", "mensaje": "Tu cuota venció el 10/11. Pasá por recepción." }`. La web muestra `mensaje` tal cual, así que tiene que estar en castellano y pensado para el socio.

### `POST /socios/login`

```json
// request
{ "dni": "35123456", "password": "..." }
// 200
{ "socioId": "123", "nombre": "Juan Pérez" }
```
Errores: `401 CREDENCIALES_INVALIDAS`, `403 CUENTA_NO_ACTIVADA`, `429 DEMASIADOS_INTENTOS`.

### `POST /socios/activar`

Primer ingreso o recuperación de contraseña.
```json
// request
{ "dni": "35123456", "codigo": "K7P2QX", "password": "nueva contraseña" }
// 200
{ "socioId": "123", "nombre": "Juan Pérez" }
```
Errores: `400 CODIGO_INVALIDO` (incluye vencido o ya usado), `422 PASSWORD_DEBIL`.

### `GET /socios/{socioId}/estado`

```json
{
  "nombre": "Juan Pérez",
  "plan": { "id": "mar-jue", "nombre": "Martes y jueves", "clasesPorMes": 8 },
  "cuota": { "estado": "AL_DIA", "vence": "2026-11-10" },   // AL_DIA | VENCIDA | POR_VENCER
  "clasesUsadasMes": 5,
  "clasesRestantesMes": 3,                                   // null si el plan es libre
  "actividades": ["muaythai"],                               // claves de la web, ver abajo
  "graduacion": { "actividad": "bjj", "nombre": "Azul", "grado": 2 }  // opcional, para "Mi cuenta"
}
```

### `POST /socios/{socioId}/asistencias`

```json
// request
{
  "fechaHora": "2026-10-20T19:02:00-03:00",
  "actividad": "muaythai",            // null si es entrenamiento libre
  "clase": { "dia": "mar", "desde": "19:00", "hasta": "20:00" },  // null si no se detectó clase
  "origen": "WEB",                    // WEB | RECEPCION
  "ubicacionVerificada": true
}
// 201
{ "asistenciaId": "9876", "mensaje": "¡Listo! Muay Thai 19 hs. Te quedan 2 clases este mes." }
```
Errores: `409 YA_REGISTRADO` (misma clase), `422 CUOTA_VENCIDA`, `422 SIN_CLASES_DISPONIBLES`, `422 ACTIVIDAD_NO_INCLUIDA`.

### `GET /socios/{socioId}/asistencias?desde=2026-10-01` (para "Mi cuenta", etapa posterior)

```json
[{ "fechaHora": "2026-10-20T19:02:00-03:00", "actividad": "muaythai", "origen": "WEB" }]
```

### `POST /prospectos` (opcional)

Para que los interesados del formulario de inscripción de la web lleguen también al CRM de BiFrost.
```json
{ "nombre": "Ana Gómez", "telefono": "+54 9 11 5555-1234", "email": null, "actividad": "bjj", "plan": "mar-jue", "origen": "WEB" }
```

### Claves de actividades

La web usa estas claves (`src/data/disciplinas.js`). BiFrost puede tener las suyas: hace falta un mapeo acordado.

| Web | Actividad |
|---|---|
| `muaythai` | Muay Thai |
| `boxeo` | Boxeo |
| `bjj` | Jiu-Jitsu |
| `mma` | MMA |
| `grappling` | Grappling |
| `sparring` | Sparring (sábados, sin reserva) |

## 5. Lo que hay que hacer en cada lado

### BiFrost

- [x] Módulo de gimnasio: socio (DNI, datos de contacto), membresía (abono, vencimiento, clases por semana), asistencia (fecha, actividad, origen).
- [x] Reglas de check-in: cuota vencida, clases del plan agotadas, actividad no incluida, check-in duplicado.
- [x] Credenciales de socios: contraseña con hash, código de activación de un solo uso generado por recepción, límite de intentos.
- [x] Endpoints de la sección 4 con autenticación por token de servicio. (Falta deployarlo.)
- [ ] Migración de socios y vencimientos desde Mis Actividades.
- [x] Backend publicado con HTTPS y URL fija (`bifrost-software.com.ar`).

### Web (este repo)

- [x] Worker: cliente de BiFrost (`worker/bifrost.js`) con `BIFROST_URL` en `wrangler.jsonc` y `BIFROST_TOKEN` como secret.
- [x] Modo simulado: con `BIFROST_MOCK=1` (solo en `.dev.vars`, nunca en producción) responde con socios de prueba (al día, cuota vencida, sin clases, sin activar). Sin `BIFROST_URL` ni mock, `/checkin` muestra "no disponible".
- [x] Sesión de socio: cookie firmada con HMAC (`SOCIO_SECRET`), separada de la del panel (`__Host-socio`), 90 días; límite de intentos de login con `login_fallidos`.
- [x] Página `/checkin`: login / activación, permiso de ubicación, clase detectada, resultado grande y claro (`src/pages/Checkin.jsx`, `worker/socios.js`).
- [x] Código del QR (`CHECKIN_CODIGO` como secret) y QR imprimible desde el panel (`/admin?s=checkin`).
- [x] Coordenadas del club en `wrangler.jsonc` (`CLUB_LAT`/`CLUB_LNG`, de OpenStreetMap).
- [ ] Prueba piloto en el club con pocos socios antes de abrirlo a todos.
- [ ] Más adelante: `/mi-cuenta` (cuota, vencimiento, clases restantes, graduación, asistencias) y QR rotativo si hace falta.

## 6. Etapas

> **Estado:** la etapa 2 está hecha. Para probarla en local: `npm run dev:api` y abrir `http://localhost:8787/checkin?c=club` con los socios de prueba de `worker/bifrost.js` (ej. DNI 11111111, contraseña `prueba`).

1. **Contrato** — revisar este documento contra el BiFrost actual y cerrar las preguntas abiertas.
2. **Web contra el mock** — `/checkin` completo con datos simulados. No depende de BiFrost.
3. **BiFrost** — módulo de gimnasio + endpoints + migración desde Mis Actividades.
4. **Integración** — conectar la web al BiFrost real, prueba piloto en el club.
5. **Mi cuenta** — estado de cuota, clases restantes, graduación, historial.
6. **Pago online (punto 9)** — Mercado Pago integrado **en BiFrost** (es quien registra los pagos); la web solo muestra el botón "Pagar cuota" que lleva al checkout que genera BiFrost.

## 7. Legal

Se guardan datos personales (DNI, teléfono, asistencias, ubicación al momento del check-in). Por la Ley 25.326 hay que:

- [ ] Publicar una **política de privacidad** en la web (qué se guarda, para qué, quién es responsable, cómo pedir la baja).
- [ ] Aviso y aceptación al activar la cuenta.
- [ ] Guardar solo si la ubicación estaba dentro del radio (`ubicacionVerificada`), no las coordenadas.
- [ ] Si hay socios menores, definir el consentimiento del adulto responsable.

## 8. Preguntas abiertas

1. ¿Dónde va a estar publicado el backend de BiFrost (URL)?
2. ¿Las contraseñas de los socios las maneja BiFrost? (recomendado)
3. ¿Qué reglas aplica hoy Mis Actividades al check-in? ¿Bloquea con cuota vencida? ¿Cuenta las clases del plan? ¿Hay tolerancia de días después del vencimiento?
4. ¿Cómo identifica BiFrost al negocio en llamadas entre servicios (token por negocio o `X-Business-Id`)?
5. ¿Qué sistema de graduación usa cada disciplina? ¿Hay socios menores?
6. ¿Los interesados de la web se mandan a BiFrost como prospectos?
