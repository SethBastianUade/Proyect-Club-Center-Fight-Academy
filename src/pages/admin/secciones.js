// Secciones de contenido del panel. Cada una se edita con el Editor genérico.
// Las columnas (k) y las reglas de validación tienen que coincidir con TABLAS en worker/contenido.js.
// Tipos de campo (t): texto (default), numero, select (con ops), fecha, hora, largo, foto.
import { DIAS } from '../../data/horarios.js';
import { DISCIPLINAS } from '../../data/disciplinas.js';
import { TIPOS, fechaLarga } from '../../data/eventos.js';
import { precio } from '../../data/planes.js';

const opciones = (obj) => Object.entries(obj).map(([v, l]) => [v, typeof l === 'string' ? l : l.nombre]);
const LUGAR = 'Club Center · Solis 1213, CABA';

export const SECCIONES = {
    precios: {
        titulo: 'Precios', tabla: 'planes', clave: 'id', singular: 'plan',
        nuevo: { orden: 99 },
        resumen: (p) => ({ titulo: p.nombre, detalle: `${precio(p.precio)}${p.precio != null ? '/mes' : ''}${p.destacado ? ` · ${p.destacado}` : ''}` }),
        campos: [
            { k: 'nombre', l: 'Nombre del plan', req: true },
            { k: 'precio', l: 'Precio mensual', t: 'numero', ayuda: 'Sin puntos ni $. Vacío muestra "Consultar".' },
            { k: 'actividades', l: 'Actividades', ph: '1 actividad' },
            { k: 'dias', l: 'Días', ph: 'Lunes a viernes' },
            { k: 'clases', l: 'Clases', ph: '12 clases por mes' },
            { k: 'destacado', l: 'Etiqueta destacada', ph: 'Más elegido', ayuda: 'Opcional. Resalta el plan.' },
            { k: 'orden', l: 'Orden', t: 'numero', ayuda: 'Los números más bajos aparecen primero.' },
        ],
    },
    horarios: {
        titulo: 'Horarios', tabla: 'clases', clave: 'id', singular: 'clase',
        nuevo: { dia: 'lun', disc: 'muaythai' },
        grupo: (c) => DIAS[c.dia],
        resumen: (c) => ({ titulo: `${c.desde} a ${c.hasta}`, detalle: c.nombre || DISCIPLINAS[c.disc]?.nombre || c.disc }),
        campos: [
            { k: 'dia', l: 'Día', t: 'select', ops: opciones(DIAS), req: true },
            { k: 'desde', l: 'Desde', t: 'hora', req: true },
            { k: 'hasta', l: 'Hasta', t: 'hora', req: true },
            { k: 'disc', l: 'Disciplina', t: 'select', ops: opciones(DISCIPLINAS), req: true },
            { k: 'nombre', l: 'Nombre a mostrar', ph: 'Sparring Jiu-Jitsu', ayuda: 'Opcional. Si queda vacío se usa el de la disciplina.' },
        ],
    },
    eventos: {
        titulo: 'Eventos', tabla: 'eventos', clave: 'slug', singular: 'evento',
        nuevo: { tipo: 'torneo', lugar: LUGAR },
        resumen: (e) => ({ titulo: e.titulo, detalle: `${TIPOS[e.tipo]} · ${fechaLarga(e.fecha)}`, foto: e.foto }),
        campos: [
            { k: 'titulo', l: 'Título', req: true },
            { k: 'tipo', l: 'Tipo', t: 'select', ops: opciones(TIPOS), req: true },
            { k: 'fecha', l: 'Fecha', t: 'fecha', req: true },
            { k: 'hora', l: 'Hora', t: 'hora' },
            { k: 'lugar', l: 'Lugar', ph: LUGAR },
            { k: 'resumen', l: 'Resumen', ayuda: 'Una línea: se ve en la tarjeta y al compartir el link.' },
            { k: 'texto', l: 'Detalle', t: 'largo' },
            { k: 'foto', l: 'Flyer', t: 'foto' },
        ],
    },
    competidores: {
        titulo: 'Competidores', tabla: 'competidores', clave: 'slug', singular: 'competidor',
        nuevo: { orden: 99 },
        resumen: (p) => ({ titulo: p.nombre, detalle: p.disciplina, foto: p.foto }),
        campos: [
            { k: 'nombre', l: 'Nombre', req: true },
            { k: 'disciplina', l: 'Disciplina', ph: 'Kick-Boxing', req: true },
            { k: 'foto', l: 'Foto', t: 'foto', dims: true },
            { k: 'record', l: 'Récord', ph: '12-3-1', ayuda: 'Ganadas-Perdidas-Empates. Opcional.' },
            { k: 'bio', l: 'Bio', t: 'largo' },
            { k: 'logros', l: 'Logros', t: 'largo', ayuda: 'Uno por línea.' },
            { k: 'orden', l: 'Orden', t: 'numero', ayuda: 'Los números más bajos aparecen primero.' },
        ],
    },
};
