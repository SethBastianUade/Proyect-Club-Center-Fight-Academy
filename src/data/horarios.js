// Las clases viven en D1 (tabla clases) y llegan con useContenido(). Acá quedan los helpers.
export const DIAS = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado' };

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
