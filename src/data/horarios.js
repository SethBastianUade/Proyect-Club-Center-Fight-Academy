// Las clases viven en D1 (tabla clases) y llegan con useContenido(). Acá quedan los helpers.
export const DIAS = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado' };

const ABREV = { lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb' };

// "09:30" → "9:30", "19:00" → "19"
export const hs = (t) => t.replace(/^0/, '').replace(':00', '');
const enumerar = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}` : xs[0]);

// Resumen de las clases de una disciplina, una línea por grupo de días con los mismos horarios:
// ["Lun, Mié y Vie · 9:30 y 19 hs", "Mar y Jue · 18 y 20 hs"]
export function resumenHorarios(clases) {
    const diasPorHora = new Map();
    for (const c of [...clases].sort((a, b) => a.desde.localeCompare(b.desde))) {
        diasPorHora.set(c.desde, [...(diasPorHora.get(c.desde) ?? []), c.dia]);
    }
    const horasPorDias = new Map();
    for (const [desde, dias] of diasPorHora) {
        const k = Object.keys(DIAS).filter((d) => dias.includes(d)).join(',');
        horasPorDias.set(k, [...(horasPorDias.get(k) ?? []), desde]);
    }
    return [...horasPorDias].map(([k, horas]) => `${enumerar(k.split(',').map((d) => ABREV[d]))} · ${enumerar(horas.map(hs))} hs`);
}

const SEMANA = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
export const hoy = () => SEMANA[new Date().getDay()];

// Las próximas clases que todavía no empezaron: hoy, o el siguiente día con clases
export function proximasClases(clases, n = 3, ahora = new Date()) {
    const hhmm = ahora.toTimeString().slice(0, 5);
    for (let i = 0; i < 7; i++) {
        const dia = SEMANA[(ahora.getDay() + i) % 7];
        const delDia = clases.filter((c) => c.dia === dia && (i > 0 || c.desde > hhmm));
        if (delDia.length) return { dia, cuando: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DIAS[dia], clases: delDia.slice(0, n) };
    }
    return null;
}
