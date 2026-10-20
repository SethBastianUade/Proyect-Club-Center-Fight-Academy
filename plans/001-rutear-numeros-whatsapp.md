# Plan 001: Rutear intencionalmente y centralizar los números de WhatsApp (recepción/chatbot)

> **Instrucciones para quien ejecuta**: Seguí este plan paso a paso. Corré cada
> comando de verificación y confirmá el resultado esperado antes de avanzar. Si
> ocurre algo de la sección "Condiciones de STOP", pará y reportá — no improvises.
> Al terminar, actualizá la fila de este plan en `plans/README.md`.
>
> **Chequeo de drift (corré esto primero)**:
> `git diff --stat ac84eca..HEAD -- index.html disciplinas.html nosotros.html contacto.html inscripcion.html script.js chatbot.js`
> Si algo cambió, compará los extractos de "Estado actual" contra el código vivo;
> si no coinciden, tratalo como condición de STOP.

## Status

- **Priority**: P1
- **Effort**: S-M
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `ac84eca`, 2026-06-13
- **Reemplaza a**: Plan 002 (el fix del doble submit del form de contacto está absorbido acá)

## Por qué importa

La academia usa **dos canales de WhatsApp legítimos**:

- **RECEPCIÓN** = `5491131598373` (humano)
- **CHATBOT / asistente virtual** = `5491139536882`

Hoy el ruteo entre ambos está aplicado de forma **inconsistente y sin fuente única**.
El ejemplo más claro: el botón del header **"¡Inscribite ahora!"** va a recepción en
el `index` pero al chatbot en las otras 4 páginas — misma etiqueta, misma intención,
línea distinta según dónde esté el visitante. Además `chatbot.js` igualó su
`receptionNumber` al del chatbot (con el comentario *"Cambiado al mismo número del
asistente virtual"*), y el form de contacto dispara **dos** handlers a la vez (uno por
`script.js`, otro inline) abriendo dos ventanas de WhatsApp.

**Política de ruteo decidida (split por intención):**
- **Alta intención → RECEPCIÓN**: "Inscribite", "Clase de prueba", y los formularios
  de contacto e inscripción. Un humano cierra la venta.
- **Consultas / info → CHATBOT**: "Conocé las disciplinas", "Contactanos" informativo,
  botón flotante de consultas generales.

Este plan aplica esa política de forma consistente en las 5 páginas, elimina el doble
submit, corrige `chatbot.js` para que sea fuente correcta de ambos números, y deja la
política documentada para que no vuelva a divergir.

## Estado actual

Números (definición canónica): RECEPCIÓN `5491131598373`, CHATBOT `5491139536882`.

`chatbot.js:5-13` (config; `receptionNumber` quedó mal igualado):
```js
const CHATBOT_CONFIG = {
    chatbotNumber: '5491139536882',
    receptionNumber: '5491139536882', // Cambiado al mismo número del asistente virtual
    ...
};
```

`script.js:18-23` (arranque del handler duplicado) y `script.js:147-164` (la función
`initContactForm`, que abre `wa.me/5491131598373`) — ambos a eliminar; el form de
contacto ya tiene su handler inline en `contacto.html:164-198`.

Ejemplos de las líneas a cambiar (mismo patrón en cada archivo):
- `index.html:170` — CTA final: `<a href="https://wa.me/5491139536882?text=Hola%20quiero%20hacer%20una%20clase%20de%20prueba" class="btn btn-primary" target="_blank">`
- `disciplinas.html:37` — header: `<a href="https://wa.me/5491139536882" class="btn-whatsapp" target="_blank">`
- `contacto.html:172` — handler inline del form: `const url = ` + "`https://wa.me/5491139536882?text=${encodeURIComponent(texto)}`" + `;`
- `inscripcion.html:154` — `const WHATSAPP_NUMBER = '5491139536882';`

## Tabla de cambios (esta es la fuente de verdad — NO hagas find/replace global)

> ⚠️ **No reemplaces el número en bloque por archivo.** Varias páginas tienen el
> número del chatbot que DEBE quedarse (CTA informativos, número mostrado). Cambiá
> **solo** las líneas listadas.

| Archivo | Línea | Elemento | Hoy | Acción |
|---------|-------|----------|-----|--------|
| index.html | 37 | header "Inscribite" | recepción | ✅ sin cambio |
| index.html | 45 | barra móvil "Inscribite" | recepción | ✅ sin cambio |
| index.html | 59 | hero "Clase de prueba" | recepción | ✅ sin cambio |
| index.html | 170 | CTA final (clase de prueba) | chatbot | → **recepción** |
| disciplinas.html | 37 | header "Inscribite" | chatbot | → **recepción** |
| disciplinas.html | 45 | barra móvil | chatbot | → **recepción** |
| disciplinas.html | 96 | CTA "Consultanos" (info) | chatbot | ✅ sin cambio (consulta) |
| nosotros.html | 37 | header | chatbot | → **recepción** |
| nosotros.html | 45 | barra móvil | chatbot | → **recepción** |
| nosotros.html | 123 | CTA (conocer el club) | chatbot | ✅ sin cambio (consulta) |
| contacto.html | 37 | header | chatbot | → **recepción** |
| contacto.html | 45 | barra móvil | chatbot | → **recepción** |
| contacto.html | 69 | dato mostrado "WhatsApp: …" | chatbot | ⚠️ FUERA DE ALCANCE (ver decisión) |
| contacto.html | 172 | handler inline del form | chatbot | → **recepción** |
| inscripcion.html | 37 | header | chatbot | → **recepción** |
| inscripcion.html | 45 | barra móvil | chatbot | → **recepción** |
| inscripcion.html | 154 | `const WHATSAPP_NUMBER` (form) | chatbot | → **recepción** |
| script.js | 18-23, 147-164 | handler duplicado del form | recepción | 🗑️ **ELIMINAR** |
| chatbot.js | 7 | `receptionNumber` | chatbot (mal) | → **recepción** + corregir comentario |
| chatbot.js | 6 | `chatbotNumber` | chatbot | ✅ sin cambio |

**Decisión fuera de alcance (no la toques sin confirmación):** el número **mostrado**
como teléfono/WhatsApp público —el footer de todas las páginas (`+54 9 11 3953-6882`)
y `contacto.html:69`— sigue siendo el del chatbot. Cambiar el número *publicado* es
otra decisión (figura en Google, redes, etc.). Default: dejarlo. Si la academia quiere
que el WhatsApp público sea recepción, es un cambio aparte.

## Comandos que vas a necesitar

| Propósito | Comando | Esperado |
|-----------|---------|----------|
| Previsualizar | `python -m http.server 8000` | sirve el sitio |
| Recepción en index | `grep -c 5491131598373 index.html` | `4` |
| Chatbot en index | `grep -c 5491139536882 index.html` | `0` |
| Handler duplicado borrado | `grep -n "initContactForm\|whatsappForm" script.js` | sin coincidencias |
| Config de chatbot.js | `grep -n "5491131598373\|5491139536882" chatbot.js` | una de cada |

## Scope

**En alcance**: `index.html`, `disciplinas.html`, `nosotros.html`, `contacto.html`,
`inscripcion.html`, `script.js`, `chatbot.js` — solo en las líneas de la tabla.

**Fuera de alcance** (NO tocar):
- Números **mostrados** (footer de todas las páginas, `contacto.html:69`).
- CTA informativos `disciplinas.html:96` y `nosotros.html:123` (quedan en chatbot).
- El texto `?text=...` de cada URL (dejalo como está; ver Maintenance si querés
  unificarlo después).
- `inscripcion.html:164-187` (la lógica del form de inscripción) salvo el número en
  la línea 154.

## Git workflow

- Rama: `mejoras/001-rutear-numeros-whatsapp`.
- Commit en español, estilo del repo (ver `git log`): p. ej.
  `Ruteo los CTA por intención entre recepción y chatbot, y elimino el doble submit`.
- NO push ni PR salvo pedido explícito.

## Steps

### Step 1: Cambiar a RECEPCIÓN los CTA de alta intención

En cada archivo, en **solo** las líneas marcadas "→ recepción" de la tabla, cambiá
el número del host `wa.me`:
- `index.html:170`
- `disciplinas.html:37,45`
- `nosotros.html:37,45`
- `contacto.html:37,45`
- `inscripcion.html:37,45`

Cambiá `wa.me/5491139536882` → `wa.me/5491131598373`. Mantené idéntico el resto de
cada URL (incluido `?text=` si lo tiene) y todos los atributos.

**Verify**:
- `grep -c 5491131598373 index.html` → `4`; `grep -c 5491139536882 index.html` → `0`
- `grep -c 5491131598373 disciplinas.html` → `2`; `grep -c 5491139536882 disciplinas.html` → `1`
- `grep -c 5491131598373 nosotros.html` → `2`; `grep -c 5491139536882 nosotros.html` → `1`

### Step 2: Rutear los formularios a RECEPCIÓN

- `contacto.html:172`: en el handler inline, cambiá `wa.me/5491139536882` →
  `wa.me/5491131598373`.
- `inscripcion.html:154`: `const WHATSAPP_NUMBER = '5491139536882';` →
  `const WHATSAPP_NUMBER = '5491131598373';`

**Verify**:
- `grep -c 5491131598373 contacto.html` → `3` (líneas 37, 45, 172)
- `grep -c 5491139536882 contacto.html` → `1` (línea 69, el dato mostrado, intacto)
- `grep -c 5491131598373 inscripcion.html` → `3`; `grep -c 5491139536882 inscripcion.html` → `0`

### Step 3: Eliminar el handler duplicado del form de contacto (absorbe el Plan 002)

En `script.js`:
1. Borrá el bloque de arranque dentro del `DOMContentLoaded` (líneas ~18-23):
   `const contactForm = document.getElementById('whatsappForm'); if (contactForm) { initContactForm(contactForm); }` y su comentario.
2. Borrá la función completa `initContactForm` (líneas ~147-164) y su comentario.

El form de contacto queda manejado solo por su handler inline en `contacto.html`
(que tras el Step 2 apunta a recepción).

**Verify**:
- `grep -n "initContactForm\|whatsappForm" script.js` → sin coincidencias
- Abrí `contacto.html`, enviá el form con nombre+mensaje → se abre **una sola**
  ventana, a `wa.me/5491131598373`.

### Step 4: Corregir `chatbot.js` como fuente correcta de ambos números

En `chatbot.js:7`, cambiá:
```js
    receptionNumber: '5491139536882', // Cambiado al mismo número del asistente virtual
```
por:
```js
    receptionNumber: '5491131598373', // Recepción (humano) — canal de alta intención
```
Dejá `chatbotNumber: '5491139536882'` igual. (El botón flotante usa `chatbotNumber` →
consultas generales → correcto según la política.)

**Verify**:
- `grep -n "5491131598373" chatbot.js` → línea 7 (`receptionNumber`)
- `grep -n "5491139536882" chatbot.js` → línea 6 (`chatbotNumber`)

### Step 5: Documentar la política

Agregá un comentario arriba de `CHATBOT_CONFIG` en `chatbot.js` (no afecta el código):
```js
// Política de ruteo de WhatsApp:
//  - Alta intención (Inscribite, clase de prueba, formularios) -> recepción (5491131598373)
//  - Consultas / info / botón flotante -> chatbot / asistente virtual (5491139536882)
// Los <a href> estáticos llevan el número hardcodeado según esta regla.
```

**Verify**: `grep -n "Política de ruteo" chatbot.js` → 1 coincidencia.

## Done criteria

- [ ] Los counts de grep del Step 1 y Step 2 dan exactamente lo indicado
- [ ] `grep -n "initContactForm\|whatsappForm" script.js` → sin coincidencias
- [ ] Enviar el form de contacto abre 1 sola ventana a recepción (`...31598373`)
- [ ] Enviar el form de inscripción va a recepción (`...31598373`)
- [ ] El botón flotante de WhatsApp sigue yendo al chatbot (`...39536882`)
- [ ] Los CTA informativos (`disciplinas:96`, `nosotros:123`) siguen en chatbot
- [ ] `chatbot.js` tiene recepción en `receptionNumber` y chatbot en `chatbotNumber`
- [ ] El número mostrado en footer y `contacto:69` quedó intacto (chatbot)
- [ ] No se modificaron archivos fuera del Scope (`git status`)
- [ ] Fila de este plan actualizada en `plans/README.md`

## Condiciones de STOP

- La academia confirma que prefiere otra política (p. ej. todo al chatbot): reportá
  para replanificar antes de tocar nada.
- Algún archivo no coincide con los extractos de "Estado actual" (drift desde `ac84eca`).
- Tras el Step 3, enviar el form de contacto no abre ninguna ventana (revisá que no
  hayas tocado el handler inline de `contacto.html`).
- Un count de grep no da el número esperado: probablemente cambiaste una línea de más
  (¿un CTA informativo o el número mostrado?) — revisá contra la tabla, no improvises.

## Maintenance notes

- **Single source of truth (mejora futura, fuera de alcance acá)**: para que cambiar
  un número sea editar un solo lugar, se puede marcar cada CTA con
  `data-wa="recepcion|chatbot"` + `data-wa-text="…"`, dejar el `href` correcto como
  fallback sin-JS, y un script que reconstruya el `href` desde un objeto central
  `{ recepcion, chatbot }`. No se hace en este plan porque los `<a>` estáticos no
  deben depender de JS para funcionar (son los botones de conversión).
- **Texto pre-cargado**: los botones "Inscribite" de las subpáginas no llevan `?text=`.
  Como mejora opcional se puede unificar a un texto tipo
  `?text=Hola%20quiero%20inscribirme` para que recepción reciba el mensaje pre-armado.
- **Número público**: si en algún momento se decide que el WhatsApp *mostrado* (footer,
  `contacto:69`) sea recepción, es un cambio aparte y conviene coordinarlo con Google
  Business / redes.
- En review: confirmar con la academia que recepción efectivamente quiere recibir las
  inscripciones/clases de prueba, y que el asistente virtual queda para consultas.
