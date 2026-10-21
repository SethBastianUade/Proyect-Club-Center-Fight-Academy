// Título y descripción de cada página. Los usa React (usePagina) y el Worker, que los escribe en el HTML
// para buscadores y vistas previas de WhatsApp/Instagram, y arma el sitemap con estas rutas.
// Agregar una página = sumarla acá y en src/App.jsx.
export const MARCA = 'Club Center Fight Academy';
export const TITULO_INICIO = `${MARCA} - Academia Profesional de Artes Marciales`;

export const PAGINAS = {
    '/': {
        titulo: null,
        descripcion: 'Jiu-Jitsu, Muay Thai, Boxeo y MMA en Solis 1213, CABA. Clases para todos los niveles y primera clase de prueba sin cargo.',
    },
    '/disciplinas': {
        titulo: 'Disciplinas',
        descripcion: 'Jiu-Jitsu, Muay Thai, Boxeo, MMA, Grappling y Sparring en Club Center Fight Academy, CABA. Días y horarios de cada disciplina.',
    },
    '/horarios': {
        titulo: 'Horarios',
        descripcion: 'Grilla de horarios de Club Center Fight Academy: Muay Thai, Boxeo, Jiu-Jitsu, MMA, Grappling y Sparring. Reservá tu clase de prueba gratis.',
    },
    '/precios': {
        titulo: 'Precios y planes',
        descripcion: 'Planes y precios de Club Center Fight Academy. Elegí el plan que mejor se adapta a tu rutina. Primera clase sin cargo.',
    },
    '/eventos': {
        titulo: 'Eventos',
        descripcion: 'Torneos, seminarios y exámenes de graduación de Club Center Fight Academy.',
    },
    '/nosotros': {
        titulo: 'Nosotros',
        descripcion: 'Conocé la historia, los valores y los competidores de Club Center Fight Academy.',
    },
    '/contacto': {
        titulo: 'Contacto',
        descripcion: 'Contactá a Club Center Fight Academy en Solis 1213, CABA. Escribinos por WhatsApp para consultas y clases de prueba.',
    },
    '/inscripcion': {
        titulo: 'Inscripción',
        descripcion: 'Inscribite en Club Center Fight Academy. Completá el formulario y te contactamos por WhatsApp.',
    },
    '/privacidad': {
        titulo: 'Política de privacidad',
        descripcion: 'Qué datos personales guarda Club Center Fight Academy, para qué los usa y cómo ejercer tus derechos.',
    },
};
