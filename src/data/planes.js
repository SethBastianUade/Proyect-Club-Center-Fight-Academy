// Aranceles mensuales. precio: null muestra "Consultar". destacado: texto de la etiqueta.
// Los ids quedan guardados en los leads: si se renombra uno, los leads viejos muestran el id.
export const PLANES = [
    {
        id: 'mar-jue', nombre: 'Martes y jueves', precio: 62900,
        items: { actividades: '1 actividad', dias: 'Martes y jueves', clases: '8 clases por mes', prueba: true },
    },
    {
        id: 'lun-mie-vie', nombre: 'Lunes, miércoles y viernes', precio: 69900,
        items: { actividades: '1 actividad', dias: 'Lunes, miércoles y viernes', clases: '12 clases por mes', prueba: true },
    },
    {
        id: 'una-actividad', nombre: 'Una actividad', precio: 74900,
        items: { actividades: '1 actividad', dias: 'Lunes a viernes', clases: 'Clases libres', prueba: true },
    },
    {
        id: 'dos-actividades', nombre: 'Dos actividades', precio: 79900,
        items: { actividades: '2 actividades, combiná como quieras', dias: 'Pase libre', clases: 'Clases libres', prueba: true },
    },
    {
        id: 'pase-libre-total', nombre: 'Pase libre total', precio: 84900, destacado: 'Más completo',
        items: { actividades: 'Todas las actividades', dias: 'Pase libre', clases: 'Clases libres', prueba: true },
    },
];

export const FILAS = [
    ['actividades', 'Actividades'],
    ['dias', 'Días'],
    ['clases', 'Clases'],
    ['prueba', 'Clase de prueba sin cargo'],
];

export const precio = (p) => (p == null ? 'Consultar' : `$${p.toLocaleString('es-AR')}`);
