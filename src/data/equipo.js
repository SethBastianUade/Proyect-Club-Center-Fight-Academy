// rol: profesor | competidor. record / logros / fotos son opcionales.
// TODO(cliente): profesores de EJEMPLO (sin foto se usa el logo). Completar récords y logros reales.
export const EQUIPO = [
    {
        slug: 'profesor-muay-thai', rol: 'profesor', nombre: 'Profesor de Muay Thai', disciplina: 'Muay Thai',
        bio: 'Instructor certificado con años de experiencia formando competidores y alumnos recreativos.',
    },
    {
        slug: 'profesor-jiu-jitsu', rol: 'profesor', nombre: 'Profesor de Jiu-Jitsu', disciplina: 'Jiu-Jitsu',
        bio: 'Cinturón negro. A cargo de las clases de Jiu-Jitsu, Grappling y el sparring de los sábados.',
    },
    {
        slug: 'sebastian-arroyo', rol: 'competidor', nombre: 'Sebastián Arroyo', disciplina: 'Jiu-Jitsu',
        foto: '/Fotos/competidores/competidor1.webp', w: 600, h: 552,
    },
    {
        slug: 'gaston-campos', rol: 'competidor', nombre: 'Gaston Campos', disciplina: 'Kick-Boxing',
        foto: '/Fotos/competidores/competidor2.webp', w: 600, h: 974,
    },
    {
        slug: 'elian-rogelio', rol: 'competidor', nombre: 'Elian Rogelio', disciplina: 'MMA',
        foto: '/Fotos/competidores/competidor3.webp', w: 600, h: 622,
    },
    {
        slug: 'matias', rol: 'competidor', nombre: 'Matias', disciplina: 'Kick-Boxing',
        foto: '/Fotos/competidores/competidor4.webp', w: 600, h: 400,
    },
];
