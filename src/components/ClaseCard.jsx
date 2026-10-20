import { DIAS } from '../data/horarios.js';
import { DISCIPLINAS } from '../data/disciplinas.js';
import { wa } from '../data/site.js';
import Icono from './Icono.jsx';

const hs = (t) => t.replace(/^0/, '').replace(':00', '');

// Toda la tarjeta abre WhatsApp con la clase precargada
export default function ClaseCard({ clase: c }) {
    const nombre = c.nombre || DISCIPLINAS[c.disc].nombre;
    const cuando = `el ${DIAS[c.dia].toLowerCase()} de ${hs(c.desde)} a ${hs(c.hasta)} hs`;
    return (
        <a
            href={wa(`Hola, quiero hacer una clase de prueba de ${nombre} ${cuando}`)}
            className="clase" style={{ '--c': DISCIPLINAS[c.disc].color }} target="_blank" rel="noopener"
            aria-label={`Reservar clase de prueba de ${nombre} ${cuando}`}
        >
            <span className="clase-hora">{hs(c.desde)} a {hs(c.hasta)} hs</span>
            <strong>{nombre}</strong>
            <span className="clase-wa"><Icono n="whatsapp" /><span>Reservar</span></span>
        </a>
    );
}
