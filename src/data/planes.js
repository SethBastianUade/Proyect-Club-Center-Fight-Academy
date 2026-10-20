// TODO(cliente): precios de EJEMPLO. Reemplazar por los reales antes de publicar.
// precio: null muestra "Consultar".
export const PLANES = [
    {
        id: '2x', nombre: '2 veces por semana', precio: 30000,
        items: { disciplinas: '1 disciplina', frecuencia: '2 clases semanales', sparring: false, matricula: true },
    },
    {
        id: 'libre', nombre: 'Pase libre', precio: 40000, destacado: true,
        items: { disciplinas: '1 disciplina', frecuencia: 'Ilimitada', sparring: true, matricula: true },
    },
    {
        id: 'combo', nombre: 'Combo full', precio: 55000,
        items: { disciplinas: 'Todas las disciplinas', frecuencia: 'Ilimitada', sparring: true, matricula: true },
    },
];

export const FILAS = [
    ['disciplinas', 'Disciplinas'],
    ['frecuencia', 'Frecuencia'],
    ['sparring', 'Sparring de los sábados'],
    ['matricula', 'Clase de prueba sin cargo'],
];

export const precio = (p) => (p == null ? 'Consultar' : `$${p.toLocaleString('es-AR')}`);
