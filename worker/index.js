// Worker del sitio. Corre para todo menos /assets/* y /Fotos/* (ver run_worker_first en wrangler.jsonc).
// Páginas HTML                        → se les inserta el contenido de D1 (paginas.js)
// GET  /sitemap.xml                   → armado con los eventos y competidores de D1
// GET  /api/contenido                 → público: planes, clases, eventos y competidores
// GET  /api/fotos/:id                 → público: fotos subidas desde el panel
// POST /api/leads                     → público: guarda un interesado del formulario de inscripción
// POST /api/clic                      → público: suma un clic a WhatsApp (métricas anónimas)
// POST /api/admin/login               → panel: contraseña → cookie de sesión
// POST /api/admin/logout              → panel: borra la cookie
// GET  /api/admin/leads               → panel: lista de interesados + conteo por estado
// PATCH /api/admin/leads/:id          → panel: cambia estado o notas
// GET|POST /api/admin/contenido/:tabla, PUT|DELETE /api/admin/contenido/:tabla/:clave → panel: editar contenido
// POST /api/admin/fotos               → panel: sube una foto
// GET  /api/admin/metricas?dias=30     → panel: clics por lugar y página, y cantidad de interesados
// GET  /api/admin/checkin              → panel: link del QR de recepción y estado de la integración con BiFrost
// /api/socio/*                         → check-in de socios (socios.js)
// El resto de /api/admin/* exige la cookie de sesión. La contraseña es el secret ADMIN_PASSWORD.

import { json, txt } from './util.js';
import { leerContenido, editarContenido, subirFoto, servirFoto } from './contenido.js';
import { pagina, sitemap } from './paginas.js';
import { sumarClic, verMetricas } from './metricas.js';
import { rutaSocio, infoQr } from './socios.js';

export const ESTADOS = ['nuevo', 'contactado', 'prueba', 'inscripto', 'descartado'];

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const { pathname } = url;

        // Las escrituras solo desde el propio sitio
        const origin = request.headers.get('Origin');
        if (request.method !== 'GET' && origin && new URL(origin).host !== url.host) {
            return json({ error: 'Origen no permitido' }, 403);
        }

        if (!pathname.startsWith('/api/')) {
            return pathname === '/sitemap.xml' ? sitemap(url, env) : pagina(request, env);
        }

        if (pathname === '/api/contenido' && request.method === 'GET') return json(await leerContenido(env), 200, { 'Cache-Control': 'no-cache' });
        const foto = pathname.match(/^\/api\/fotos\/(\d+)$/);
        if (foto && request.method === 'GET') return servirFoto(Number(foto[1]), request, env, ctx);
        if (pathname === '/api/leads' && request.method === 'POST') return crearLead(request, env);
        if (pathname === '/api/clic' && request.method === 'POST') return sumarClic(request, env);
        if (pathname.startsWith('/api/socio/')) return rutaSocio(pathname, request, env);

        if (pathname === '/api/admin/login' && request.method === 'POST') return login(request, env);
        if (pathname === '/api/admin/logout' && request.method === 'POST') return json({ ok: true }, 200, cookie('', 0));

        if (pathname.startsWith('/api/admin/')) {
            if (!(await sesionValida(request, env))) return json({ error: 'No autorizado' }, 401);

            if (pathname === '/api/admin/leads' && request.method === 'GET') return listarLeads(url, env);
            const m = pathname.match(/^\/api\/admin\/leads\/(\d+)$/);
            if (m && request.method === 'PATCH') return actualizarLead(Number(m[1]), request, env);

            const c = pathname.match(/^\/api\/admin\/contenido\/(\w+)(?:\/([\w-]+))?$/);
            if (c) return editarContenido(c[1], c[2], request, env);
            if (pathname === '/api/admin/fotos' && request.method === 'POST') return subirFoto(request, env);
            if (pathname === '/api/admin/metricas' && request.method === 'GET') return verMetricas(url, env);
            if (pathname === '/api/admin/checkin' && request.method === 'GET') return json(infoQr(url, env));
        }

        return json({ error: 'No encontrado' }, 404);
    },
};

async function crearLead(request, env) {
    let d;
    try { d = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
    // Honeypot: campo oculto que solo completan los bots. Respondemos OK para no darles pistas
    if (d.web) return json({ ok: true }, 201);

    const nombre = txt(d.nombre, 100);
    const telefono = txt(d.telefono, 30);
    if (!nombre || telefono.replace(/\D/g, '').length < 8) return json({ error: 'Faltan nombre o teléfono' }, 400);

    await env.DB.prepare('INSERT INTO leads (nombre, telefono, email, disciplina, plan) VALUES (?, ?, ?, ?, ?)')
        .bind(nombre, telefono, txt(d.email, 120) || null, txt(d.disciplina, 30) || null, txt(d.plan, 30) || null)
        .run();
    return json({ ok: true }, 201);
}

async function listarLeads(url, env) {
    const estado = url.searchParams.get('estado');
    const filtro = ESTADOS.includes(estado);
    const [leads, conteo] = await env.DB.batch([
        env.DB.prepare(`SELECT * FROM leads ${filtro ? 'WHERE estado = ?' : ''} ORDER BY creado DESC, id DESC LIMIT 500`)
            .bind(...(filtro ? [estado] : [])),
        env.DB.prepare('SELECT estado, COUNT(*) AS n FROM leads GROUP BY estado'),
    ]);
    return json({
        leads: leads.results,
        conteo: Object.fromEntries(conteo.results.map((r) => [r.estado, r.n])),
    });
}

async function actualizarLead(id, request, env) {
    let d;
    try { d = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
    if (d.estado !== undefined && !ESTADOS.includes(d.estado)) return json({ error: 'Estado inválido' }, 400);
    const notas = typeof d.notas === 'string' ? d.notas.slice(0, 2000) : null;

    const r = await env.DB.prepare(
        "UPDATE leads SET estado = COALESCE(?, estado), notas = COALESCE(?, notas), actualizado = datetime('now') WHERE id = ?"
    ).bind(d.estado ?? null, notas, id).run();
    if (!r.meta.changes) return json({ error: 'No existe' }, 404);
    return json({ ok: true });
}

// ---------- Login del panel ----------
// Sesión = cookie "<vencimiento>.<firma HMAC>" firmada con ADMIN_PASSWORD: cambiar la contraseña cierra todas las sesiones.
// Sin ADMIN_PASSWORD configurada nadie puede entrar.

const SESION_DIAS = 7;
const MAX_FALLIDOS = 5; // por IP cada 15 minutos
const VENTANA_MS = 15 * 60 * 1000;
const enc = new TextEncoder();

const cookie = (valor, maxAge) => ({
    'Set-Cookie': `__Host-sesion=${valor}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`,
});

async function firmar(texto, env) {
    const key = await crypto.subtle.importKey('raw', enc.encode(env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(texto)));
}
const hex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
const iguales = (a, b) => a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);

async function sesionValida(request, env) {
    if (!env.ADMIN_PASSWORD) return false;
    const valor = request.headers.get('Cookie')?.match(/(?:^|;\s*)__Host-sesion=([^;]+)/)?.[1];
    const [vence, firma] = valor?.split('.') ?? [];
    if (!firma || !(Number(vence) > Date.now())) return false;
    return iguales(enc.encode(firma), enc.encode(hex(await firmar(vence, env))));
}

async function login(request, env) {
    if (!env.ADMIN_PASSWORD) return json({ error: 'Panel sin contraseña configurada' }, 503);
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const ahora = Date.now();

    const { n } = await env.DB.prepare('SELECT COUNT(*) AS n FROM login_fallidos WHERE ip = ? AND creado > ?')
        .bind(ip, ahora - VENTANA_MS).first();
    if (n >= MAX_FALLIDOS) return json({ error: 'Demasiados intentos. Probá de nuevo en 15 minutos.' }, 429);

    let d;
    try { d = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
    // Se comparan las firmas (mismo largo) para que el tiempo de respuesta no revele nada de la contraseña
    const ok = typeof d.password === 'string' && iguales(await firmar(d.password, env), await firmar(env.ADMIN_PASSWORD, env));

    if (!ok) {
        await env.DB.batch([
            env.DB.prepare('INSERT INTO login_fallidos (ip, creado) VALUES (?, ?)').bind(ip, ahora),
            env.DB.prepare('DELETE FROM login_fallidos WHERE creado < ?').bind(ahora - 24 * 60 * 60 * 1000),
        ]);
        return json({ error: 'Contraseña incorrecta' }, 401);
    }

    await env.DB.prepare('DELETE FROM login_fallidos WHERE ip = ?').bind(ip).run();
    const vence = String(ahora + SESION_DIAS * 24 * 60 * 60 * 1000);
    return json({ ok: true }, 200, cookie(`${vence}.${hex(await firmar(vence, env))}`, SESION_DIAS * 24 * 60 * 60));
}
