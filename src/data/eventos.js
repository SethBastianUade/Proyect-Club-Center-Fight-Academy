// Eventos del club (por ahora no hay). Formato de cada uno:
// { slug: 'examen-bjj-noviembre', titulo, tipo: 'torneo' | 'seminario' | 'examen', fecha: 'AAAA-MM-DD', hora: '12:00',
//   lugar: 'Club Center · Solis 1213, CABA', resumen: 'una línea para la tarjeta', texto: 'detalle para la página del evento' }
export const EVENTOS = [];

export const TIPOS = { torneo: 'Torneo', seminario: 'Seminario', examen: 'Examen' };

const hoy = () => new Date().toISOString().slice(0, 10);
export const proximos = () => EVENTOS.filter((e) => e.fecha >= hoy()).sort((a, b) => a.fecha.localeCompare(b.fecha));
export const pasados = () => EVENTOS.filter((e) => e.fecha < hoy()).sort((a, b) => b.fecha.localeCompare(a.fecha));

export const fechaLarga = (f) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
