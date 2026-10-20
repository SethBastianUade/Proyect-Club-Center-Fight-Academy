// API del sitio. Solo corre para /api/* (ver run_worker_first en wrangler.jsonc).
// POST /api/leads              → público: guarda un interesado del formulario de inscripción
// GET  /api/admin/leads        → panel: lista de interesados + conteo por estado
// PATCH /api/admin/leads/:id   → panel: cambia estado o notas
// /api/admin/* lo protege Cloudflare Access y además se verifica el token acá.

export const ESTADOS = ['nuevo', 'contactado', 'prueba', 'inscripto', 'descartado'];

const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const txt = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const { pathname } = url;

        // Las escrituras solo desde el propio sitio
        const origin = request.headers.get('Origin');
        if (request.method !== 'GET' && origin && new URL(origin).host !== url.host) {
            return json({ error: 'Origen no permitido' }, 403);
        }

        if (pathname === '/api/leads' && request.method === 'POST') return crearLead(request, env);

        if (pathname.startsWith('/api/admin/')) {
            const usuario = await verificarAccess(request, env);
            if (!usuario) return json({ error: 'No autorizado' }, 401);

            if (pathname === '/api/admin/leads' && request.method === 'GET') return listarLeads(url, env);
            const m = pathname.match(/^\/api\/admin\/leads\/(\d+)$/);
            if (m && request.method === 'PATCH') return actualizarLead(Number(m[1]), request, env);
        }

        if (pathname.startsWith('/api/')) return json({ error: 'No encontrado' }, 404);
        return env.ASSETS.fetch(request);
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

// ---------- Cloudflare Access ----------
// Valida el JWT que Access agrega en cada request autenticado (firma RS256, audiencia, emisor y vencimiento).
// Sin ACCESS_TEAM_DOMAIN / ACCESS_AUD configurados no deja pasar a nadie.

const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const b64json = (s) => JSON.parse(new TextDecoder().decode(b64(s)));
let certs; // claves públicas de Access, cacheadas mientras viva el isolate

async function clavesAccess(iss, refrescar) {
    if (!certs || refrescar) certs = (await (await fetch(`${iss}/cdn-cgi/access/certs`)).json()).keys;
    return certs;
}

async function verificarAccess(request, env) {
    if (env.DEV_SIN_ACCESS === '1') return { email: 'dev@local' }; // solo en .dev.vars, nunca en producción
    const token = request.headers.get('Cf-Access-Jwt-Assertion');
    if (!token || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
    try {
        const [h, p, firma] = token.split('.');
        const header = b64json(h);
        const payload = b64json(p);
        const iss = `https://${env.ACCESS_TEAM_DOMAIN}`;
        if (header.alg !== 'RS256' || payload.iss !== iss || ![].concat(payload.aud).includes(env.ACCESS_AUD)) return null;
        if (!payload.exp || payload.exp * 1000 < Date.now()) return null;

        let jwk = (await clavesAccess(iss)).find((k) => k.kid === header.kid);
        jwk ??= (await clavesAccess(iss, true)).find((k) => k.kid === header.kid); // Access rota las claves
        if (!jwk) return null;

        const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
        const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64(firma), new TextEncoder().encode(`${h}.${p}`));
        return ok ? payload : null;
    } catch {
        return null;
    }
}
