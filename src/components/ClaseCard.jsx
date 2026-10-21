import { DIAS, hs } from '../data/horarios.js';
import { DISCIPLINAS } from '../data/disciplinas.js';
import { wa } from '../data/site.js';
import Icono from './Icono.jsx';

// Toda la tarjeta abre WhatsApp con la clase precargada, salvo las que no se reservan (sparring)
export default function ClaseCard({ clase: c }) {
    const d = DISCIPLINAS[c.disc] ?? { nombre: c.disc };
    const nombre = c.nombre || d.nombre;
    const cuando = `el ${DIAS[c.dia].toLowerCase()} de ${hs(c.desde)} a ${hs(c.hasta)} hs`;
    const contenido = (
        <>
            <span className="clase-hora">{hs(c.desde)} a {hs(c.hasta)} hs</span>
            <strong>{nombre}</strong>
        </>
    );

    if (d.sinReserva) {
        return (
            <div className="clase" style={{ '--c': d.color }}>
                {contenido}
                <span className="clase-libre">Sin reserva</span>
            </div>
        );
    }
    return (
        <a
            href={wa(`Hola, quiero hacer una clase de prueba de ${nombre} ${cuando}`)}
            className="clase" style={{ '--c': d.color }} target="_blank" rel="noopener" data-lugar="clase"
        >
            {contenido}
            {/* Lo que lee un lector de pantalla arranca igual que lo visible: "19 a 20 hs Muay Thai Reservar…" */}
            <span className="clase-wa"><Icono n="whatsapp" /><span className="clase-wa-texto">Reservar</span></span>
            <span className="sr-only"> clase de prueba {cuando}</span>
        </a>
    );
}
