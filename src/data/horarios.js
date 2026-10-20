// Transcripto de la grilla impresa (legacy/Fotos/grillaHorarios.jpg).
// [día, desde, hasta, disciplina, nombre opcional]
const H = [
    ['lun', '09:30', '10:30', 'muaythai'], ['mie', '09:30', '10:30', 'muaythai'], ['vie', '09:30', '10:30', 'muaythai'],
    ['lun', '13:00', '14:00', 'boxeo'], ['mie', '13:00', '14:00', 'boxeo'], ['vie', '13:00', '14:00', 'boxeo'],
    ['mar', '15:00', '16:00', 'boxeo'], ['jue', '15:00', '16:00', 'boxeo'],
    ['mar', '16:00', '17:00', 'grappling'], ['jue', '16:00', '17:00', 'grappling'],
    ['lun', '16:30', '18:00', 'bjj'], ['mie', '16:30', '18:00', 'bjj'], ['vie', '16:30', '18:00', 'bjj'],
    ['mar', '17:00', '18:00', 'mma'], ['jue', '17:00', '18:00', 'mma'],
    ['lun', '18:00', '19:00', 'boxeo'], ['mar', '18:00', '19:00', 'muaythai'], ['mie', '18:00', '19:00', 'boxeo'], ['jue', '18:00', '19:00', 'muaythai'], ['vie', '18:00', '19:00', 'boxeo'],
    ['lun', '19:00', '20:00', 'muaythai'], ['mar', '19:00', '20:00', 'boxeo'], ['mie', '19:00', '20:00', 'muaythai'], ['jue', '19:00', '20:00', 'boxeo'], ['vie', '19:00', '20:00', 'muaythai'],
    ['lun', '20:00', '21:00', 'mma'], ['mar', '20:00', '21:00', 'muaythai'], ['mie', '20:00', '21:00', 'mma'], ['jue', '20:00', '21:00', 'muaythai'], ['vie', '20:00', '21:00', 'mma'],
    ['lun', '21:00', '22:00', 'boxeo'], ['mie', '21:00', '22:00', 'boxeo'], ['vie', '21:00', '22:00', 'boxeo'],
    ['sab', '11:00', '12:00', 'sparring', 'Sparring Muay Thai / Boxeo'],
    ['sab', '12:00', '14:00', 'sparring', 'Sparring Jiu-Jitsu'],
];

export const DIAS = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado' };

export const CLASES = H.map(([dia, desde, hasta, disc, nombre]) => ({ dia, desde, hasta, disc, nombre }))
    .sort((a, b) => a.desde.localeCompare(b.desde));
