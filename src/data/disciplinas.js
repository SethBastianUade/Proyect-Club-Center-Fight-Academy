// `color` se usa en la grilla de horarios y en las tarjetas (mismos colores que la grilla impresa)
export const DISCIPLINAS = {
    muaythai: {
        nombre: 'Muay Thai', color: '#E55A1B',
        corta: 'El arte de las ocho extremidades. Potencia, resistencia y disciplina mental.',
        larga: 'El arte de las 8 extremidades. Potencia física, resistencia y disciplina mental en cada clase. Una de las artes marciales de pie más completas del mundo.',
    },
    boxeo: {
        nombre: 'Boxeo', color: '#0EA5E9',
        corta: 'Mejorá tu técnica, reflejos y condición física con el deporte clásico de combate.',
        larga: 'Mejorá tu técnica de golpes, reflejos y condición física con el deporte de combate más clásico. Entrenamiento dinámico y progresivo para todos los niveles.',
    },
    bjj: {
        nombre: 'Jiu-Jitsu', color: '#1679A8',
        corta: 'Arte marcial de combate cuerpo a cuerpo. Técnica, control y defensa personal para todas las edades.',
        larga: 'Arte marcial de combate cuerpo a cuerpo que desarrolla técnica, control y defensa personal. Ideal para todas las edades y niveles, desde principiantes hasta competidores.',
    },
    mma: {
        nombre: 'MMA', color: '#7E3FA0',
        corta: 'Artes marciales mixtas: integrá lo mejor de cada disciplina en un entrenamiento completo.',
        larga: 'Artes marciales mixtas: integrá Jiu-Jitsu, Muay Thai y Boxeo en un entrenamiento completo. Desarrollá todas las facetas del combate moderno.',
    },
    grappling: {
        nombre: 'Grappling', color: '#B91C2C',
        corta: 'Lucha cuerpo a cuerpo sin golpes: derribos, control y sumisiones.',
        larga: 'Lucha cuerpo a cuerpo sin golpes: derribos, control y sumisiones. El complemento ideal para el Jiu-Jitsu y el MMA.',
    },
    // sinReserva: no se reserva clase de prueba, se viene directo
    sparring: {
        nombre: 'Sparring', color: '#F08A12', sinReserva: true,
        corta: 'Los sábados, combates controlados para poner en práctica lo entrenado en la semana.',
        larga: 'Los sábados, combates controlados para poner en práctica lo entrenado en la semana. No hace falta reservar: vení directo.',
    },
};

// En el inicio
export const PRINCIPALES = ['bjj', 'muaythai', 'boxeo', 'mma'];
// En /disciplinas y en el formulario de inscripción (el sparring no se elige: es parte del entrenamiento)
export const FICHAS = [...PRINCIPALES, 'grappling', 'sparring'];
export const INSCRIBIBLES = FICHAS.filter((id) => !DISCIPLINAS[id].sinReserva);
