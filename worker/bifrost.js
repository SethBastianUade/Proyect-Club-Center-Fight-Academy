// Cliente de BiFrost (sistema del club: socios, cuotas, asistencias). Contrato en plan.md, sección 4.
// - Real: si hay BIFROST_URL, llama a BiFrost con el token de servicio (secret BIFROST_TOKEN).
// - Simulado: si BIFROST_MOCK=1 (solo en .dev.vars), socios de prueba en memoria para desarrollar sin BiFrost.
// Todas las funciones devuelven { ok: true, data } o { ok: false, status, codigo, mensaje }.
// `mensaje` está pensado para mostrárselo al socio tal cual.

export const modo = (env) => (env.BIFROST_URL ? 'real' : env.BIFROST_MOCK === '1' ? 'simulado' : null);

export const login = (env, dni, password) => cliente(env).login(dni, password);
export const activar = (env, dni, codigo, password) => cliente(env).activar(dni, codigo, password);
export const estado = (env, socioId) => cliente(env).estado(socioId);
export const registrarAsistencia = (env, socioId, asistencia) => cliente(env).registrarAsistencia(socioId, asistencia);

const cliente = (env) => (modo(env) === 'real' ? real(env) : simulado);

// ---------- BiFrost real ----------

function real(env) {
    const llamar = async (metodo, path, body) => {
        let r;
        try {
            r = await fetch(`${env.BIFROST_URL.replace(/\/$/, '')}${path}`, {
                method: metodo,
                headers: { 'Content-Type': 'application/json', 'X-Service-Token': env.BIFROST_TOKEN },
                body: body && JSON.stringify(body),
                signal: AbortSignal.timeout(8000),
            });
        } catch {
            return { ok: false, status: 502, codigo: 'BIFROST_NO_RESPONDE', mensaje: 'No pudimos conectar con el sistema del club. Avisá en recepción.' };
        }
        const data = await r.json().catch(() => null);
        if (r.ok) return { ok: true, data };
        return { ok: false, status: r.status, codigo: data?.codigo ?? 'ERROR', mensaje: data?.mensaje ?? 'Algo salió mal. Avisá en recepción.' };
    };
    const id = encodeURIComponent;
    return {
        login: (dni, password) => llamar('POST', '/socios/login', { dni, password }),
        activar: (dni, codigo, password) => llamar('POST', '/socios/activar', { dni, codigo, password }),
        estado: (socioId) => llamar('GET', `/socios/${id(socioId)}/estado`),
        registrarAsistencia: (socioId, asistencia) => llamar('POST', `/socios/${id(socioId)}/asistencias`, asistencia),
    };
}

// ---------- BiFrost simulado ----------
// DNI y contraseña de prueba: 11111111 / prueba (al día, pase libre), 22222222 / prueba (cuota vencida),
// 33333333 / prueba (sin clases este mes), 44444444 sin activar: código de activación ABC123.
// El estado vive en memoria del Worker: se reinicia cada vez que se reinicia el dev server.

const TODAS = ['muaythai', 'boxeo', 'bjj', 'mma', 'grappling', 'sparring'];
const SOCIOS = {
    11111111: { id: 'demo-1', nombre: 'Juan Pérez', password: 'prueba', plan: { id: 'pase-libre-total', nombre: 'Pase libre total', clasesPorMes: null }, cuota: { estado: 'AL_DIA', vence: '2026-11-30' }, usadas: 6, actividades: TODAS },
    22222222: { id: 'demo-2', nombre: 'Ana Gómez', password: 'prueba', plan: { id: 'mar-jue', nombre: 'Martes y jueves', clasesPorMes: 8 }, cuota: { estado: 'VENCIDA', vence: '2026-10-10' }, usadas: 3, actividades: ['muaythai'] },
    33333333: { id: 'demo-3', nombre: 'Pedro Ruiz', password: 'prueba', plan: { id: 'mar-jue', nombre: 'Martes y jueves', clasesPorMes: 8 }, cuota: { estado: 'AL_DIA', vence: '2026-11-15' }, usadas: 8, actividades: ['boxeo'] },
    44444444: { id: 'demo-4', nombre: 'Lucía Díaz', password: null, codigo: 'ABC123', plan: { id: 'lun-mie-vie', nombre: 'Lunes, miércoles y viernes', clasesPorMes: 12 }, cuota: { estado: 'AL_DIA', vence: '2026-11-20' }, usadas: 2, actividades: ['bjj', 'grappling', 'sparring'] },
};
const porId = (id) => Object.values(SOCIOS).find((s) => s.id === id);
const asistencias = new Set(); // "socioId|fecha|desde|actividad"

const error = (status, codigo, mensaje) => ({ ok: false, status, codigo, mensaje });
const fechaCorta = (f) => f.split('-').reverse().slice(0, 2).join('/');

const simulado = {
    async login(dni, password) {
        const s = SOCIOS[dni];
        if (s && !s.password) return error(403, 'CUENTA_NO_ACTIVADA', 'Todavía no activaste tu cuenta. Usá el código que te dieron en recepción.');
        if (!s || s.password !== password) return error(401, 'CREDENCIALES_INVALIDAS', 'DNI o contraseña incorrectos.');
        return { ok: true, data: { socioId: s.id, nombre: s.nombre } };
    },

    async activar(dni, codigo, password) {
        const s = SOCIOS[dni];
        if (!s || !s.codigo || s.codigo !== codigo?.toUpperCase()) return error(400, 'CODIGO_INVALIDO', 'El código no es válido o ya se usó. Pedí uno nuevo en recepción.');
        if (!password || password.length < 6) return error(422, 'PASSWORD_DEBIL', 'La contraseña tiene que tener al menos 6 caracteres.');
        s.password = password;
        s.codigo = null;
        return { ok: true, data: { socioId: s.id, nombre: s.nombre } };
    },

    async estado(socioId) {
        const s = porId(socioId);
        if (!s) return error(404, 'SOCIO_NO_ENCONTRADO', 'No encontramos tu cuenta. Avisá en recepción.');
        const restantes = s.plan.clasesPorMes == null ? null : Math.max(0, s.plan.clasesPorMes - s.usadas);
        return {
            ok: true,
            data: { nombre: s.nombre, plan: s.plan, cuota: s.cuota, clasesUsadasMes: s.usadas, clasesRestantesMes: restantes, actividades: s.actividades },
        };
    },

    async registrarAsistencia(socioId, a) {
        const s = porId(socioId);
        if (!s) return error(404, 'SOCIO_NO_ENCONTRADO', 'No encontramos tu cuenta. Avisá en recepción.');
        if (s.cuota.estado === 'VENCIDA') return error(422, 'CUOTA_VENCIDA', `Tu cuota venció el ${fechaCorta(s.cuota.vence)}. Pasá por recepción.`);
        if (s.plan.clasesPorMes != null && s.usadas >= s.plan.clasesPorMes) {
            return error(422, 'SIN_CLASES_DISPONIBLES', `Ya usaste las ${s.plan.clasesPorMes} clases de tu plan este mes. Pasá por recepción.`);
        }
        if (a.actividad && !s.actividades.includes(a.actividad)) return error(422, 'ACTIVIDAD_NO_INCLUIDA', 'Esta actividad no está incluida en tu plan. Pasá por recepción.');
        const clave = `${s.id}|${a.fechaHora.slice(0, 10)}|${a.clase?.desde ?? 'libre'}|${a.actividad ?? ''}`;
        if (asistencias.has(clave)) return error(409, 'YA_REGISTRADO', 'Ya hiciste check-in en esta clase.');

        asistencias.add(clave);
        s.usadas++;
        const restantes = s.plan.clasesPorMes == null ? null : s.plan.clasesPorMes - s.usadas;
        return {
            ok: true,
            data: {
                asistenciaId: String(asistencias.size),
                mensaje: `Check-in registrado.${restantes != null ? ` Te quedan ${restantes} clases este mes.` : ''}`,
            },
        };
    },
};
