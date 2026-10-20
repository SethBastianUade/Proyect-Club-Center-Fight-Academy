// TODO(cliente): eventos de EJEMPLO. Cargar los reales.
// fecha en formato AAAA-MM-DD. tipo: torneo | seminario | examen
export const EVENTOS = [
    {
        slug: 'examen-graduacion-bjj-noviembre',
        titulo: 'Examen de graduación de Jiu-Jitsu',
        tipo: 'examen', fecha: '2026-11-21', hora: '12:00',
        lugar: 'Club Center · Solis 1213, CABA',
        resumen: 'Cierre de año con entrega de grados y franjas para alumnos de Jiu-Jitsu.',
        texto: 'Todos los alumnos de Jiu-Jitsu están invitados a rendir. Consultá con tu profesor si estás en condiciones de subir de grado. Familias bienvenidas.',
    },
    {
        slug: 'seminario-muay-thai-diciembre',
        titulo: 'Seminario de clinch en Muay Thai',
        tipo: 'seminario', fecha: '2026-12-06', hora: '11:00',
        lugar: 'Club Center · Solis 1213, CABA',
        resumen: 'Dos horas intensivas de clinch, rodillas y control. Abierto a alumnos de otras academias.',
        texto: 'Seminario abierto a todos los niveles. Cupos limitados: reservá tu lugar por WhatsApp.',
    },
    {
        slug: 'torneo-interno-octubre',
        titulo: 'Torneo interno de Kick-Boxing',
        tipo: 'torneo', fecha: '2026-10-04', hora: '15:00',
        lugar: 'Club Center · Solis 1213, CABA',
        resumen: 'Peleas amateurs entre alumnos del club. Entrada libre para el público.',
        texto: 'Gran jornada con más de 15 peleas. Gracias a todos los que participaron y alentaron.',
    },
];

export const TIPOS = { torneo: 'Torneo', seminario: 'Seminario', examen: 'Examen' };

const hoy = () => new Date().toISOString().slice(0, 10);
export const proximos = () => EVENTOS.filter((e) => e.fecha >= hoy()).sort((a, b) => a.fecha.localeCompare(b.fecha));
export const pasados = () => EVENTOS.filter((e) => e.fecha < hoy()).sort((a, b) => b.fecha.localeCompare(a.fecha));

export const fechaLarga = (f) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
