// Los planes viven en D1 (tabla planes) y llegan con useContenido(). Acá quedan las filas y el formato de precio.
export const FILAS = [
    ['actividades', 'Actividades'],
    ['dias', 'Días'],
    ['clases', 'Clases'],
];

export const precio = (p) => (p == null ? 'Consultar' : `$${p.toLocaleString('es-AR')}`);
