// Los planes viven en D1 (tabla planes) y llegan con useContenido(). Acá quedan las filas y el formato de precio.
export const FILAS = [
    ['actividades', 'Actividades'],
    ['dias', 'Días'],
    ['clases', 'Clases'],
];

// Precio más barato de los planes (null si ninguno tiene precio): "Planes desde $X"
export const desde = (planes) => {
    const precios = planes.map((p) => p.precio).filter((p) => p != null);
    return precios.length ? Math.min(...precios) : null;
};

export const precio = (p) => (p == null ? 'Consultar' : `$${p.toLocaleString('es-AR')}`);
