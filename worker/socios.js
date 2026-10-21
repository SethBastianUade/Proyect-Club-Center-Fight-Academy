// Check-in de socios desde la web (plan.md). Los datos del socio viven en BiFrost: acá solo hay
// sesión, validaciones de presencia (código del QR + ubicación) y detección de la clase según el horario.
// POST /api/socio/login | /api/socio/activar | /api/socio/salir
// GET  /api/socio/checkin  → socio (estado en BiFrost) + clases que se pueden registrar ahora
// POST /api/socio/checkin  → registra la asistencia en BiFrost
//
// Necesita: SOCIO_SECRET y CHECKIN_CODIGO (secrets) y BiFrost (BIFROST_URL o BIFROST_MOCK=1). Sin eso responde 503.

import { json, txt } from './util.js';
import * as bifrost from './bifrost.js';

const SESION_DIAS = 90; // una vez logueado, el celu queda recordado
const MAX_FALLIDOS = 10; // por IP cada 15 minutos (tabla login_fallidos, compartida con el panel)
const VENTANA_MS = 15 * 60 * 1000;
const RADIO_METROS = 150; // distancia máxima al club para marcar la ubicación como verificada
// Ventana para detectar la clase: empieza en los próximos 30 minutos o empezó hace menos de 15
const ANTES_MIN = 30;
const DESPUES_MIN = 15;
const SEMANA = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

const enc = new TextEncoder();
const iguales = (a, b) => {
    const x = enc.encode(a);
    const y = enc.encode(b);
    return x.byteLength === y.byteLength && crypto.subtle.timingSafeEqual(x, y);
};
async function firma(env, texto) {
    const key = await crypto.subtle.importKey('raw', enc.encode(env.SOCIO_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(texto)));
    return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const NO_DISPONIBLE = { codigo: 'NO_DISPONIBLE', mensaje: 'El check-in online todavía no está disponible. Avisá en recepción.' };
export const disponible = (env) => Boolean(env.SOCIO_SECRET && env.CHECKIN_CODIGO && bifrost.modo(env));

// ---------- Sesión: cookie "<socioId>.<vencimiento>.<firma>" ----------

const cookie = (valor, maxAge) => ({
    // Lax y no Strict: el socio llega abriendo el link del QR desde la cámara
    'Set-Cookie': `__Host-socio=${valor}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
});

async function crearSesion(env, socioId) {
    const base = `${encodeURIComponent(socioId).replace(/\./g, '%2E')}.${Date.now() + SESION_DIAS * 86400e3}`;
    return cookie(`${base}.${await firma(env, base)}`, SESION_DIAS * 86400);
}

async function socioDeSesion(request, env) {
    const valor = request.headers.get('Cookie')?.match(/(?:^|;\s*)__Host-socio=([^;]+)/)?.[1];
    const [id, vence, f] = valor?.split('.') ?? [];
    if (!f || !(Number(vence) > Date.now())) return null;
    return iguales(f, await firma(env, `${id}.${vence}`)) ? decodeURIComponent(id) : null;
}

// ---------- Endpoints ----------

export async function rutaSocio(pathname, request, env) {
    if (!disponible(env)) return json(NO_DISPONIBLE, 503);
    const { method } = request;

    if (pathname === '/api/socio/salir' && method === 'POST') return json({ ok: true }, 200, cookie('', 0));
    if ((pathname === '/api/socio/login' || pathname === '/api/socio/activar') && method === 'POST') {
        return ingresar(pathname.endsWith('activar'), request, env);
    }

    const socioId = await socioDeSesion(request, env);
    if (!socioId) return json({ codigo: 'SIN_SESION', mensaje: 'Ingresá con tu DNI y contraseña.' }, 401);

    if (pathname === '/api/socio/checkin' && method === 'GET') {
        const r = await bifrost.estado(env, socioId);
        // la cuenta ya no existe en BiFrost: cerramos la sesión
        if (!r.ok) return json({ codigo: r.codigo, mensaje: r.mensaje }, r.status, r.status === 404 ? cookie('', 0) : {});
        return json({ socio: r.data, clases: await clasesAhora(env), modo: bifrost.modo(env) });
    }
    if (pathname === '/api/socio/checkin' && method === 'POST') return checkin(socioId, request, env);

    return json({ error: 'No encontrado' }, 404);
}

async function ingresar(esActivacion, request, env) {
    const ip = `socio:${request.headers.get('CF-Connecting-IP') || 'local'}`;
    const ahora = Date.now();
    const { n } = await env.DB.prepare('SELECT COUNT(*) AS n FROM login_fallidos WHERE ip = ? AND creado > ?').bind(ip, ahora - VENTANA_MS).first();
    if (n >= MAX_FALLIDOS) return json({ codigo: 'DEMASIADOS_INTENTOS', mensaje: 'Demasiados intentos. Probá de nuevo en 15 minutos.' }, 429);

    let d;
    try { d = await request.json(); } catch { return json({ codigo: 'DATOS_INVALIDOS', mensaje: 'Datos inválidos.' }, 400); }
    const dni = txt(d.dni, 12).replace(/\D/g, '');
    const password = typeof d.password === 'string' ? d.password.slice(0, 200) : '';
    if (!dni || !password) return json({ codigo: 'DATOS_INVALIDOS', mensaje: 'Completá tu DNI y contraseña.' }, 400);

    const r = esActivacion
        ? await bifrost.activar(env, dni, txt(d.codigo, 20), password)
        : await bifrost.login(env, dni, password);
    if (!r.ok) {
        if (r.status === 401 || r.status === 400) {
            await env.DB.prepare('INSERT INTO login_fallidos (ip, creado) VALUES (?, ?)').bind(ip, ahora).run();
        }
        return json({ codigo: r.codigo, mensaje: r.mensaje }, r.status);
    }
    return json({ ok: true, nombre: r.data.nombre }, 200, await crearSesion(env, r.data.socioId));
}

// Hora de Argentina (UTC-3 todo el año) como fecha "falsa" en UTC: getUTC* devuelve la hora local del club
const ahoraAR = () => new Date(Date.now() - 3 * 3600e3);
const minutos = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

async function clasesAhora(env) {
    const ar = ahoraAR();
    const dia = SEMANA[ar.getUTCDay()];
    const ahora = ar.getUTCHours() * 60 + ar.getUTCMinutes();
    const { results } = await env.DB.prepare('SELECT id, dia, desde, hasta, disc, nombre FROM clases WHERE dia = ? ORDER BY desde').bind(dia).all();
    return results.filter((c) => ahora >= minutos(c.desde) - ANTES_MIN && ahora <= minutos(c.desde) + DESPUES_MIN);
}

// Distancia en metros entre dos puntos (fórmula de haversine)
function distancia(lat1, lng1, lat2, lng2) {
    const rad = (g) => (g * Math.PI) / 180;
    const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
    return 2 * 6371e3 * Math.asin(Math.sqrt(a));
}

async function checkin(socioId, request, env) {
    let d;
    try { d = await request.json(); } catch { return json({ codigo: 'DATOS_INVALIDOS', mensaje: 'Datos inválidos.' }, 400); }

    if (typeof d.codigo !== 'string' || !iguales(d.codigo, env.CHECKIN_CODIGO)) {
        return json({ codigo: 'CODIGO_QR_INVALIDO', mensaje: 'Escaneá el QR que está en recepción para hacer el check-in.' }, 403);
    }

    const candidatas = await clasesAhora(env);
    let clase = null;
    if (d.claseId != null) {
        clase = candidatas.find((c) => c.id === Number(d.claseId));
        if (!clase) return json({ codigo: 'CLASE_INVALIDA', mensaje: 'Esa clase ya no está disponible para check-in. Recargá la página.' }, 400);
    } else if (candidatas.length > 1) {
        return json({ codigo: 'ELEGIR_CLASE', mensaje: 'Elegí a qué clase venís.' }, 400);
    } else {
        clase = candidatas[0] ?? null; // ninguna = entrenamiento libre
    }

    // Solo se guarda si estaba dentro del radio, nunca las coordenadas
    const lat = Number(d.lat);
    const lng = Number(d.lng);
    const ubicacionVerificada = Number.isFinite(lat) && Number.isFinite(lng)
        && distancia(lat, lng, Number(env.CLUB_LAT), Number(env.CLUB_LNG)) <= RADIO_METROS;

    const r = await bifrost.registrarAsistencia(env, socioId, {
        fechaHora: ahoraAR().toISOString().slice(0, 19) + '-03:00',
        actividad: clase?.disc ?? null,
        clase: clase && { dia: clase.dia, desde: clase.desde, hasta: clase.hasta },
        origen: 'WEB',
        ubicacionVerificada,
    });
    if (!r.ok) return json({ codigo: r.codigo, mensaje: r.mensaje }, r.status);
    return json({ ok: true, mensaje: r.data.mensaje, clase, ubicacionVerificada });
}

// Para el panel: link del QR de recepción y en qué modo está la integración
export const infoQr = (url, env) => ({
    disponible: disponible(env),
    modo: bifrost.modo(env),
    url: env.CHECKIN_CODIGO ? `${url.origin}/checkin?c=${encodeURIComponent(env.CHECKIN_CODIGO)}` : null,
});
