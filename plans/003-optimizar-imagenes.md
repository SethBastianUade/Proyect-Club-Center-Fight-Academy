# Plan 003: Optimizar imágenes (WebP + tamaños + lazy/dimensiones) para Core Web Vitals

> **Instrucciones para quien ejecuta**: Seguí este plan paso a paso. Corré cada
> comando de verificación y confirmá el resultado esperado antes de avanzar. Si
> ocurre algo de la sección "Condiciones de STOP", pará y reportá — no improvises.
> Al terminar, actualizá la fila de este plan en `plans/README.md`.
>
> **Chequeo de drift (corré esto primero)**:
> `git diff --stat 0707d67..HEAD -- styles.css index.html disciplinas.html nosotros.html contacto.html inscripcion.html Fotos`
> Si algo cambió, compará los extractos de "Estado actual" contra el código vivo;
> si no coinciden, tratalo como condición de STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `0707d67`, 2026-06-13 (rebasado tras consolidar WIP competidores + Plan 001 en main)

## Por qué importa

`Fotos/` pesa ~11MB sin optimizar. `nosotros1.jpg` es **4000×3000 / 3.9MB** pero se
muestra a ≤600px; los tres banners de hero son JPEG de 1920px (268-440KB) usados como
fondos atenuados; los íconos de disciplinas son JPEG de ~900-1095px renderizados como
círculos de 110px. No hay WebP, ni `loading="lazy"`, ni `width/height` (lo que provoca
layout shift / CLS). Esto destruye el LCP y el CLS en mobile —métricas que Google usa
para rankear y que disparan el rebote—, costándole a la academia visibilidad en
búsquedas locales y leads. Objetivo: bajar el peso de imágenes ~85% y eliminar el
salto de layout, sin pérdida visible de calidad.

## Restricción del workspace (LEER PRIMERO)

El workspace **prohíbe agregar dependencias npm / `package.json` al proyecto**. Este
plan usa `npx`, que ejecuta herramientas desde un cache global **sin crear
`package.json` ni `node_modules` en el repo** — eso respeta la regla. Node v24 está
disponible. **NO** corras `npm install` dentro del repo. No commitees ningún script
ni `node_modules`.

## Estado actual

Dimensiones reales (medidas con `image-size`) y destino de cada imagen **usada**:

| Archivo | Actual | Peso | Dónde se usa / render | Destino |
|---------|--------|------|------------------------|---------|
| `Fotos/nosotros1.jpg` | 4000×3000 | 3.9M | `nosotros.html` about (≤600×420 cover) | WebP, resize 1200, q72 |
| `Fotos/bannerD.jpg` | 1920×918 | 440K | fondo hero index + disciplinas (`styles.css`) @0.32 | WebP, resize 1600, q68 |
| `Fotos/bannerNosotros.jpg` | 1920×1013 | 288K | fondo hero nosotros | WebP, resize 1600, q68 |
| `Fotos/bannerContacto.jpg` | 1920×1280 | 268K | fondo hero contacto | WebP, resize 1600, q68 |
| `Fotos/iconos/bjj.jpg` | 1095×1095 | — | tarjeta disciplina (110px círculo) | WebP, resize 256, q75 |
| `Fotos/iconos/muayThai.jpg` | 896×1107 | — | ídem | WebP, resize 256, q75 |
| `Fotos/iconos/boxeo.jpg` | 869×1046 | — | ídem | WebP, resize 256, q75 |
| `Fotos/iconos/MMA.jpg` | **170×102** | — | ídem (baja resolución) | WebP, q80, **sin resize** |
| `Fotos/competidores/competidor1.jpg` | 744×685 | — | tarjeta equipo (≤260×300 cover) | WebP, resize 600, q75 |
| `Fotos/competidores/competidor2.jpeg` | 570×925 | — | ídem | WebP, resize 600, q75 |
| `Fotos/competidores/competidor3.jpeg` | 720×746 | — | ídem | WebP, resize 600, q75 |
| `Fotos/competidores/competidor4.jpeg` | 1600×1066 | — | ídem | WebP, resize 600, q75 |
| `Fotos/grillaHorarios.jpg` | 1600×1066 | 216K | `contacto.html`, se abre en lightbox para **leer** | WebP, q85, **sin resize** |

Referencias a corregir (CSS = fondos; HTML = `<img>`):
- `styles.css:262` → `background: url('Fotos/bannerD.jpg') ...`
- `styles.css:1031` → `url('Fotos/bannerD.jpg')`
- `styles.css:1034` → `url('Fotos/bannerNosotros.jpg')`
- `styles.css:1037` → `url('Fotos/bannerContacto.jpg')`
- `index.html:97,103,109,115` → `<img src="Fotos/iconos/{bjj,muayThai,boxeo,MMA}.jpg" ...>`
- `disciplinas.html:69,74,79,84` → ídem íconos
- `nosotros.html:82` → `<img src="Fotos/nosotros1.jpg" ...>`
- `nosotros.html:96,101,106,111` → `<img src="Fotos/competidores/competidor{1.jpg,2.jpeg,3.jpeg,4.jpeg}" ...>`
- `contacto.html:93` → `<img src="Fotos/grillaHorarios.jpg" class="schedule-img" ...>`

Regla global de CSS relevante (`styles.css:52-55`): `img { max-width:100%; height:auto; }`
— por eso poner `width`/`height` en el HTML no deforma: dan el aspect-ratio que evita CLS.

**`logoClub.png` (542×510, 160K)**: queda en PNG (es también el favicon). NO lo
conviertas a WebP. Opcionalmente comprimilo (ver Step 4); sí le agregamos `width/height`.

## Suggested executor toolkit

- **Recomendado**: `npx --yes sharp-cli` (mantenido, trae binarios precompilados de
  sharp, no requiere compilador). Antes de usarlo corré `npx --yes sharp-cli --help`
  para confirmar disponibilidad y nombres de flags de tu versión.
- **Para medir dimensiones**: `npx --yes image-size <archivo>` (imprime `WxH`).
- **Fallback manual (para humano, sin agente)**: https://squoosh.app — arrastrar cada
  imagen, elegir WebP, ajustar calidad/resize según la tabla, descargar.

## Scope

**En alcance**:
- `Fotos/**` — crear los `.webp` (y, en Step 4 opcional, borrar assets sin uso).
- `styles.css` — repuntar las 4 `url()` de banners.
- `index.html`, `disciplinas.html`, `nosotros.html`, `contacto.html`, `inscripcion.html`
  — `src` de `<img>` + atributos `loading`/`decoding`/`width`/`height`.

**Fuera de alcance** (NO tocar):
- `logoClub.png` → mantener PNG (favicon). Solo `width/height`, opcional compresión.
- El carrusel muerto (`script.js`/`.carousel-*` en CSS) y `Fotos/opiniones/*` — son
  parte de otro hallazgo (código muerto), no de este plan.
- **No** hagas upscale de `MMA.jpg` (origen 170×102): es baja resolución; conseguir
  una imagen mejor es tarea del cliente (ver Maintenance).

## Git workflow

- Rama: `mejoras/003-optimizar-imagenes`.
- Commit en español, estilo del repo: p. ej. `Optimizo imágenes a WebP y agrego lazy-loading y dimensiones`.
- NO push ni PR salvo pedido explícito.

## Steps

> Orden: primero generamos los WebP (Step 1), después repuntamos referencias
> (Step 2), después agregamos atributos leyendo las dimensiones **finales** (Step 3).
> Así los `width/height` reflejan lo que realmente se sirve.

### Step 1: Generar los WebP optimizados

Confirmá la herramienta: `npx --yes sharp-cli --help` → imprime ayuda (sin error).

Corré (desde la raíz del repo). `sharp-cli` con `-f webp` escribe `<basename>.webp`
en el directorio de `-o`:

```bash
# Banners (fondos de hero) → 1600w
npx --yes sharp-cli -i Fotos/bannerD.jpg        -o Fotos -f webp -q 68 resize 1600
npx --yes sharp-cli -i Fotos/bannerNosotros.jpg -o Fotos -f webp -q 68 resize 1600
npx --yes sharp-cli -i Fotos/bannerContacto.jpg -o Fotos -f webp -q 68 resize 1600
# Nosotros (about) → 1200w
npx --yes sharp-cli -i Fotos/nosotros1.jpg      -o Fotos -f webp -q 72 resize 1200
# Íconos de disciplinas → 256w (MMA sin resize: ya es chico)
npx --yes sharp-cli -i Fotos/iconos/bjj.jpg      -o Fotos/iconos -f webp -q 75 resize 256
npx --yes sharp-cli -i Fotos/iconos/muayThai.jpg -o Fotos/iconos -f webp -q 75 resize 256
npx --yes sharp-cli -i Fotos/iconos/boxeo.jpg    -o Fotos/iconos -f webp -q 75 resize 256
npx --yes sharp-cli -i Fotos/iconos/MMA.jpg      -o Fotos/iconos -f webp -q 80
# Competidores → 600w
npx --yes sharp-cli -i Fotos/competidores/competidor1.jpg  -o Fotos/competidores -f webp -q 75 resize 600
npx --yes sharp-cli -i Fotos/competidores/competidor2.jpeg -o Fotos/competidores -f webp -q 75 resize 600
npx --yes sharp-cli -i Fotos/competidores/competidor3.jpeg -o Fotos/competidores -f webp -q 75 resize 600
npx --yes sharp-cli -i Fotos/competidores/competidor4.jpeg -o Fotos/competidores -f webp -q 75 resize 600
# Grilla de horarios (legible en lightbox) → sin resize, q85
npx --yes sharp-cli -i Fotos/grillaHorarios.jpg -o Fotos -f webp -q 85
```

Si los flags difieren en tu versión de `sharp-cli`, mapealos por nombre
(input/output/format/quality/resize-width) usando `--help`. Lo que importa es el
resultado: cada `.webp` existe y pesa mucho menos.

**Verify**:
- `ls Fotos/*.webp Fotos/iconos/*.webp Fotos/competidores/*.webp` → lista los 13 nuevos
  archivos: `bannerD.webp, bannerNosotros.webp, bannerContacto.webp, nosotros1.webp,
  grillaHorarios.webp`; `iconos/{bjj,muayThai,boxeo,MMA}.webp`;
  `competidores/competidor{1,2,3,4}.webp`.
- `du -h Fotos/nosotros1.webp` → **< 250K** (venía de 3.9M).
- `du -h Fotos/bannerD.webp` → **< 200K**.

### Step 2: Repuntar las referencias a `.webp`

**CSS** (`styles.css`): cambiá la extensión en las 4 `url()`:
- línea 262: `url('Fotos/bannerD.jpg')` → `url('Fotos/bannerD.webp')`
- línea 1031: `bannerD.jpg` → `bannerD.webp`
- línea 1034: `bannerNosotros.jpg` → `bannerNosotros.webp`
- línea 1037: `bannerContacto.jpg` → `bannerContacto.webp`

**HTML** — cambiá el `src` (solo la extensión/ruta del archivo, dejá el resto del tag):
- `index.html` y `disciplinas.html`: los 4 íconos `Fotos/iconos/*.jpg` → `*.webp`
- `nosotros.html`: `Fotos/nosotros1.jpg` → `nosotros1.webp`; los 4
  `Fotos/competidores/competidorN.{jpg,jpeg}` → `competidorN.webp`
- `contacto.html`: `Fotos/grillaHorarios.jpg` → `grillaHorarios.webp`
  (el lightbox de la grilla lee `scheduleImg.src` por JS, así que sigue solo).

**Verify**:
- `grep -rn "Fotos/bannerD.jpg\|bannerNosotros.jpg\|bannerContacto.jpg" styles.css` → sin coincidencias
- `grep -rn "iconos/.*\.jpg\|nosotros1\.jpg\|competidor.*\.jpe\?g\|grillaHorarios\.jpg" *.html` → sin coincidencias
- `grep -rln "\.webp" *.html styles.css` → lista index, disciplinas, nosotros, contacto, styles.css

### Step 3: Agregar `loading`, `decoding`, `width` y `height`

Para cada `<img>` de contenido, agregá `decoding="async"`, `width`, `height` y
`loading` según la tabla. **Obtené las dimensiones finales** de cada `.webp` con
`npx --yes image-size <archivo>` y usá esos números exactos en `width`/`height`.

| `<img>` | Archivos | `loading` | `width`/`height` |
|---------|----------|-----------|------------------|
| Logo del header (`index/disciplinas/nosotros/contacto/inscripcion.html`) | `logoClub.png` | **`eager`** (above the fold; o sea, no pongas `loading`) | `width="542" height="510"` |
| Logo del footer (las 5 páginas) | `logoClub.png` | `lazy` | `width="542" height="510"` |
| Íconos disciplinas (`index`, `disciplinas`) | `iconos/*.webp` | `lazy` | leer con image-size |
| Imagen about (`nosotros.html:82`) | `nosotros1.webp` | `lazy` | leer (≈1200×900) |
| Competidores (`nosotros.html`) | `competidores/*.webp` | `lazy` | leer con image-size |
| Grilla (`contacto.html:93`) | `grillaHorarios.webp` | `lazy` | leer (≈1600×1066) |

Ejemplo del shape a producir (ícono de disciplina):
```html
<img src="Fotos/iconos/bjj.webp" alt="Jiu-Jitsu" width="256" height="256" loading="lazy" decoding="async" />
```
Ejemplo logo del header (sin `loading`, carga inmediata):
```html
<img src="Fotos/logoClub.png" alt="Club Center Fight Academy" class="main-logo" width="542" height="510">
```

No cambies `class`, `alt` ni nada más de cada tag.

**Verify**:
- `grep -c 'loading="lazy"' nosotros.html` → ≥ 6 (about + 4 competidores + logo footer)
- `grep -c "decoding=" index.html` → ≥ 5 (logos + 4 íconos)
- En devtools (Network, throttling Fast 3G) recargá cada página: las imágenes
  below-the-fold cargan al hacer scroll; ninguna da 404.
- Lighthouse mobile (o el panel de Performance): **CLS ≈ 0** y caída notoria del peso
  transferido vs. antes.

### Step 4 (opcional): Borrar assets pesados sin uso

Estas imágenes **no se referencian** en ningún HTML/CSS/JS (verificalo). Borrarlas
no afecta la carga (no se descargan), pero aliviana el repo ~3.5MB:

`Fotos/foto_fondo.PNG` (2.2M), `Fotos/bannerP.jpg` (492K), `Fotos/fondo1.jpg` (268K),
`Fotos/Prueba.jpeg` (296K), `Fotos/grillaHorarios.jpeg` (328K, duplicado del `.jpg`),
`Fotos/iconos/iconos.jpg`, `Fotos/iconos/kickBoxing.jpg`,
`Fotos/competidores/competidor0.jpg`, `Fotos/logoSportClub.png`, `Fotos/ig_logo.jpg`.

Antes de borrar cada una: `grep -rn "<nombre-archivo>" . --include=*.html --include=*.css --include=*.js`
→ debe dar **sin coincidencias**. Si alguna aparece referenciada, **NO la borres** y
reportá (STOP).

> Sobre los originales `.jpg/.jpeg` que **sí** convertiste a `.webp`: tras el Step 2
> ya no se referencian, pero **no los borres en este plan** — dejalos como respaldo.
> Su limpieza es follow-up deferido (ver Maintenance).

**Verify**: `git status` lista solo borrados de la lista de arriba (si hiciste el Step 4).

## Done criteria

- [ ] Existen los 13 `.webp` (Step 1) y `Fotos/nosotros1.webp` < 250K
- [ ] `grep` no encuentra referencias a los `.jpg/.jpeg` convertidos en HTML/CSS (Step 2)
- [ ] Todos los `<img>` de contenido tienen `width`+`height`+`decoding`; los
      below-the-fold tienen `loading="lazy"` (Step 3)
- [ ] Al recargar cada página no hay imágenes 404 (devtools Network)
- [ ] CLS ≈ 0 en Lighthouse mobile
- [ ] No se modificaron archivos fuera del Scope (`git status`)
- [ ] Fila de este plan actualizada en `plans/README.md`

## Condiciones de STOP

- `npx --yes sharp-cli --help` falla o las conversiones no corren tras 2 intentos
  razonables: **NO bloquees el plan entero** → hacé solo el Step 3 (lazy/decoding/
  dimensiones sobre los archivos actuales, que ya da una mejora real de CLS) y dejá
  el re-encode a WebP para un humano con la receta de squoosh.app (toolkit). Reportá.
- Una imagen convertida se ve degradada (bloques, borrosa): subí la calidad (`-q`)
  +8 y reconvertí esa imagen.
- La grilla de horarios queda ilegible al ampliarla en el lightbox: subí su `-q` o
  dejala sin convertir (el `.jpg` original).
- Algún archivo del Step 4 resulta estar referenciado: no lo borres, reportá.
- Los archivos no coinciden con los extractos de "Estado actual" (drift desde `ac84eca`).

## Maintenance notes

- **Nuevas imágenes**: exportarlas WebP ≤1600w, con `width/height` y `loading="lazy"`
  si están below-the-fold.
- **`MMA.jpg` es baja resolución (170×102)**: se ve peor que las otras disciplinas
  (se está agrandando dentro del círculo de 110px). Pedirle al cliente una imagen
  cuadrada de ≥800px para emparejar la calidad. (Mejora de contenido, no de este plan.)
- **Follow-up deferido**: una vez verificado en prod que los `.webp` cargan bien,
  se pueden borrar los originales `.jpg/.jpeg` ya convertidos (quedaron sin referenciar
  tras el Step 2). No se hace acá para tener respaldo durante el cambio.
- **Mejora opcional de LCP**: el banner del hero del index es un `background-image`
  (no puede llevar `loading`). Si se quiere exprimir el LCP, agregar en el `<head>`
  del index un `<link rel="preload" as="image" href="Fotos/bannerD.webp">`. Fuera de
  alcance acá para mantener el plan acotado.
- En review: mirar que la calidad visual de about (`nosotros1`) y de la grilla siga
  siendo buena, y que el favicon (sigue PNG) no se haya roto.
