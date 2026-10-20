// `color` se usa en la grilla de horarios (mismos colores que la grilla impresa)
export const DISCIPLINAS = {
    muaythai: {
        nombre: 'Muay Thai', color: '#E55A1B', img: '/Fotos/iconos/muayThai.webp', w: 256, h: 316,
        corta: 'El arte de las ocho extremidades. Potencia, resistencia y disciplina mental.',
        larga: 'El arte de las 8 extremidades. Potencia física, resistencia y disciplina mental en cada clase. Una de las artes marciales de pie más completas del mundo.',
    },
    boxeo: {
        nombre: 'Boxeo', color: '#0EA5E9', img: '/Fotos/iconos/boxeo.webp', w: 256, h: 308,
        corta: 'Mejorá tu técnica, reflejos y condición física con el deporte clásico de combate.',
        larga: 'Mejorá tu técnica de golpes, reflejos y condición física con el deporte de combate más clásico. Entrenamiento dinámico y progresivo para todos los niveles.',
    },
    bjj: {
        nombre: 'Jiu-Jitsu', color: '#1679A8', img: '/Fotos/iconos/bjj.webp', w: 256, h: 256,
        corta: 'Arte marcial de combate cuerpo a cuerpo. Técnica, control y defensa personal para todas las edades.',
        larga: 'Arte marcial de combate cuerpo a cuerpo que desarrolla técnica, control y defensa personal. Ideal para todas las edades y niveles, desde principiantes hasta competidores.',
    },
    mma: {
        nombre: 'MMA', color: '#7E3FA0', img: '/Fotos/iconos/MMA.webp', w: 170, h: 102,
        corta: 'Artes marciales mixtas: integrá lo mejor de cada disciplina en un entrenamiento completo.',
        larga: 'Artes marciales mixtas: integrá Jiu-Jitsu, Muay Thai y Boxeo en un entrenamiento completo. Desarrollá todas las facetas del combate moderno.',
    },
    // Solo aparecen en la grilla, no tienen ficha propia
    grappling: { nombre: 'Grappling', color: '#B91C2C' },
    sparring: { nombre: 'Sparring', color: '#F08A12' },
};

export const PRINCIPALES = ['bjj', 'muaythai', 'boxeo', 'mma'];
