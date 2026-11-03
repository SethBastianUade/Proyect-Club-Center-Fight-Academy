// `color` se usa en la grilla de horarios y en las tarjetas (mismos colores que la grilla impresa)
export const DISCIPLINAS = {
    muaythai: {
        nombre: 'Muay Thai', color: '#E55A1B',
        corta: 'El arte de las ocho extremidades. Potencia, resistencia y disciplina mental. Para mayores de 16 años.',
        larga: 'El arte de las 8 extremidades. Potencia física, resistencia y disciplina mental en cada clase. Una de las artes marciales de pie más completas del mundo. Para mayores de 16 años.',
    },
    boxeo: {
        nombre: 'Boxeo', color: '#0EA5E9',
        corta: 'Mejorá tu técnica, reflejos y condición física con el deporte clásico de combate. Para mayores de 16 años.',
        larga: 'Mejorá tu técnica de golpes, reflejos y condición física con el deporte de combate más clásico. Entrenamiento dinámico y progresivo para todos los niveles. Para mayores de 16 años.',
    },
    bjj: {
        nombre: 'Jiu-Jitsu', color: '#1679A8',
        corta: 'Arte marcial de combate cuerpo a cuerpo. Técnica, control y defensa personal. Para mayores de 16 años.',
        larga: 'Arte marcial de combate cuerpo a cuerpo que desarrolla técnica, control y defensa personal. Para todos los niveles, desde principiantes hasta competidores. Para mayores de 16 años.',
    },
    mma: {
        nombre: 'MMA', color: '#7E3FA0',
        corta: 'Artes marciales mixtas: integrá lo mejor de cada disciplina en un entrenamiento completo. Para mayores de 16 años.',
        larga: 'Artes marciales mixtas: integrá Jiu-Jitsu, Muay Thai y Boxeo en un entrenamiento completo. Desarrollá todas las facetas del combate moderno. Para mayores de 16 años.',
    },
    grappling: {
        nombre: 'Grappling', color: '#B91C2C',
        corta: 'Lucha cuerpo a cuerpo sin golpes: derribos, control y sumisiones. Para mayores de 16 años.',
        larga: 'Lucha cuerpo a cuerpo sin golpes: derribos, control y sumisiones. El complemento ideal para el Jiu-Jitsu y el MMA. Para mayores de 16 años.',
    },
    // El sparring no es una disciplina: es la práctica de los sábados. Está acá solo para la grilla de horarios
    // (color y "Sin reserva": no se reserva clase de prueba, se viene directo)
    sparring: { nombre: 'Sparring', color: '#F08A12', sinReserva: true },
};

// En el inicio
export const PRINCIPALES = ['bjj', 'muaythai', 'boxeo', 'mma'];
// En /disciplinas y en el formulario de inscripción
export const FICHAS = [...PRINCIPALES, 'grappling'];
export const INSCRIBIBLES = FICHAS;
