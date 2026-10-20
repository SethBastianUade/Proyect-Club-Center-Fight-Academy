// Los eventos viven en D1 (tabla eventos) y llegan con useContenido(). Acá quedan los helpers.
export const TIPOS = { torneo: 'Torneo', seminario: 'Seminario', examen: 'Examen' };

const hoy = () => new Date().toISOString().slice(0, 10);
export const proximos = (eventos) => eventos.filter((e) => e.fecha >= hoy()).sort((a, b) => a.fecha.localeCompare(b.fecha));
export const pasados = (eventos) => eventos.filter((e) => e.fecha < hoy()).sort((a, b) => b.fecha.localeCompare(a.fecha));

export const fechaLarga = (f) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
