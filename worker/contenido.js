// Contenido editable desde el panel: planes, clases, eventos y competidores (migrations/0003_contenido.sql).
// Cada tabla se describe en TABLAS y un único CRUD genérico la maneja. Los nombres de tablas y columnas
// salen siempre de TABLAS, nunca del request, así que es seguro armarlos dentro del SQL.

import { json } from './util.js';

const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

// Tipos de columna: 'texto' (200), 'largo' (5000), 'entero', 'hora' (HH:MM), 'fecha' (AAAA-MM-DD), 'foto' (/api/fotos/:id o /Fotos/...),
// o un array de valores permitidos. '!' al final = obligatorio. Los arrays siempre son obligatorios.
// clave: columna id. slugDe: si la clave es texto, se genera de esa columna al crear y después no cambia (los links no se rompen).
const TABLAS = {
    planes: {
        clave: 'id', slugDe: 'nombre', orden: 'orden, precio',
        cols: { nombre: 'texto!', precio: 'entero', actividades: 'texto', dias: 'texto', clases: 'texto', destacado: 'texto', orden: 'entero' },
    },
    clases: {
        clave: 'id', orden: "instr('lun mar mie jue vie sab', dia), desde",
        cols: { dia: DIAS, desde: 'hora!', hasta: 'hora!', disc: 'texto!', nombre: 'texto' },
    },
    eventos: {
        clave: 'slug', slugDe: 'titulo', orden: 'fecha DESC',
        cols: { titulo: 'texto!', tipo: ['torneo', 'seminario', 'examen'], fecha: 'fecha!', hora: 'hora', lugar: 'texto', resumen: 'texto', texto: 'largo', foto: 'foto' },
    },
    competidores: {
        clave: 'slug', slugDe: 'nombre', orden: 'orden, nombre',
        cols: { nombre: 'texto!', disciplina: 'texto!', foto: 'foto', w: 'entero', h: 'entero', record: 'texto', bio: 'largo', logros: 'largo', orden: 'entero' },
    },
};

const FORMATOS = {
    hora: /^([01]\d|2[0-3]):[0-5]\d$/,
    fecha: /^\d{4}-\d{2}-\d{2}$/,
    foto: /^\/(api\/fotos\/\d+|Fotos\/[\w./-]+)$/,
};

export async function leerContenido(env) {
    const nombres = Object.keys(TABLAS);
    const res = await env.DB.batch(nombres.map((t) => env.DB.prepare(`SELECT * FROM ${t} ORDER BY ${TABLAS[t].orden}`)));
    return Object.fromEntries(nombres.map((t, i) => [t, res[i].results]));
}

// Devuelve la fila lista para guardar, o tira un string con el error para mostrar en el panel
function validar(def, d) {
    const fila = {};
    for (const [col, tipo] of Object.entries(def.cols)) {
        const opciones = Array.isArray(tipo) ? tipo : null;
        const base = opciones ? null : tipo.replace('!', '');
        let v = typeof d[col] === 'string' ? d[col].trim() : d[col];

        if (v === undefined || v === null || v === '') {
            if (opciones || tipo.endsWith('!')) throw `Falta completar "${col}"`;
            fila[col] = null;
            continue;
        }
        if (opciones) {
            if (!opciones.includes(v)) throw `"${col}" no es válido`;
        } else if (base === 'entero') {
            v = Number(v);
            if (!Number.isInteger(v) || v < 0) throw `"${col}" tiene que ser un número entero`;
        } else if (FORMATOS[base]) {
            if (!FORMATOS[base].test(v)) throw `"${col}" no tiene el formato correcto`;
        } else {
            v = String(v).slice(0, base === 'largo' ? 5000 : 200);
        }
        fila[col] = v;
    }
    if (fila.desde && fila.hasta && fila.hasta <= fila.desde) throw 'La clase tiene que terminar después de empezar';
    return fila;
}

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'item';

async function slugLibre(env, tabla, clave, texto) {
    const base = slugify(texto);
    const { results } = await env.DB.prepare(`SELECT ${clave} AS k FROM ${tabla} WHERE ${clave} = ? OR ${clave} LIKE ?`)
        .bind(base, `${base}-%`).all();
    const usados = new Set(results.map((r) => r.k));
    let slug = base;
    for (let i = 2; usados.has(slug); i++) slug = `${base}-${i}`;
    return slug;
}

export async function editarContenido(tabla, clave, request, env) {
    const def = TABLAS[tabla];
    if (!def) return json({ error: 'No encontrado' }, 404);
    const { method } = request;

    if (method === 'GET' && !clave) {
        const { results } = await env.DB.prepare(`SELECT * FROM ${tabla} ORDER BY ${def.orden}`).all();
        return json(results);
    }
    if (method === 'DELETE' && clave) {
        const r = await env.DB.prepare(`DELETE FROM ${tabla} WHERE ${def.clave} = ?`).bind(clave).run();
        return r.meta.changes ? json({ ok: true }) : json({ error: 'No existe' }, 404);
    }
    if ((method === 'POST' && !clave) || (method === 'PUT' && clave)) {
        let fila;
        try {
            fila = validar(def, await request.json());
        } catch (e) {
            return json({ error: typeof e === 'string' ? e : 'Datos inválidos' }, 400);
        }
        const cols = Object.keys(fila);

        if (method === 'PUT') {
            const r = await env.DB.prepare(`UPDATE ${tabla} SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE ${def.clave} = ?`)
                .bind(...Object.values(fila), clave).run();
            return r.meta.changes ? json({ ok: true, clave }) : json({ error: 'No existe' }, 404);
        }

        if (def.slugDe) {
            fila[def.clave] = await slugLibre(env, tabla, def.clave, fila[def.slugDe]);
            cols.push(def.clave);
        }
        const r = await env.DB.prepare(`INSERT INTO ${tabla} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
            .bind(...cols.map((c) => fila[c])).run();
        return json({ ok: true, clave: fila[def.clave] ?? r.meta.last_row_id }, 201);
    }
    return json({ error: 'Método no permitido' }, 405);
}

// ---------- Fotos ----------
// Se guardan en D1 (sin R2, que pide tarjeta). El panel las achica a WebP antes de subirlas.

const TIPOS_FOTO = ['image/webp', 'image/jpeg', 'image/png'];
const MAX_FOTO = 1_500_000; // D1 admite filas de hasta 2 MB

export async function subirFoto(request, env) {
    const tipo = request.headers.get('Content-Type');
    if (!TIPOS_FOTO.includes(tipo)) return json({ error: 'Formato de imagen no soportado' }, 400);
    const datos = await request.arrayBuffer();
    if (!datos.byteLength || datos.byteLength > MAX_FOTO) return json({ error: 'La foto pesa demasiado (máximo 1,5 MB)' }, 400);

    const r = await env.DB.prepare('INSERT INTO fotos (tipo, datos) VALUES (?, ?)').bind(tipo, datos).run();
    return json({ url: `/api/fotos/${r.meta.last_row_id}` }, 201);
}

export async function servirFoto(id, request, env, ctx) {
    const cache = caches.default;
    const guardada = await cache.match(request);
    if (guardada) return guardada;

    const foto = await env.DB.prepare('SELECT tipo, datos FROM fotos WHERE id = ?').bind(id).first();
    if (!foto) return new Response('No encontrada', { status: 404 });

    // Una foto nunca cambia (cambiarla en el panel sube otra con otro id): se cachea para siempre
    const res = new Response(new Uint8Array(foto.datos), {
        headers: { 'Content-Type': foto.tipo, 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
    ctx.waitUntil(cache.put(request, res.clone()));
    return res;
}
