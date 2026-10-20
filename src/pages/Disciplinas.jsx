import { Link } from 'react-router';
import { DISCIPLINAS, FICHAS } from '../data/disciplinas.js';
import { resumenHorarios } from '../data/horarios.js';
import { wa } from '../data/site.js';
import { useContenido } from '../contenido.jsx';
import { Hero, Cta, useMeta } from '../components/ui.jsx';
import Icono from '../components/Icono.jsx';

export default function Disciplinas() {
    useMeta('Disciplinas', 'Jiu-Jitsu, Muay Thai, Boxeo, MMA, Grappling y Sparring en Club Center Fight Academy, CABA. Días y horarios de cada disciplina.');
    const { clases } = useContenido();
    return (
        <>
            <Hero badge="Lo que entrenamos" titulo="Nuestras" resaltado="disciplinas" subtitulo="Todas las clases son para todos los niveles" />
            <section className="disciplines-section">
                <div className="fichas">
                    {FICHAS.map((id) => {
                        const d = DISCIPLINAS[id];
                        const horarios = resumenHorarios(clases.filter((c) => c.disc === id));
                        return (
                            <article className="ficha" id={id} key={id} style={{ '--c': d.color }}>
                                <h2>{d.nombre}</h2>
                                <p>{d.larga}</p>
                                {horarios.length > 0 && (
                                    <ul className="ficha-horarios" aria-label={`Horarios de ${d.nombre}`}>
                                        {horarios.map((h) => <li key={h}><Icono n="clock" /> {h}</li>)}
                                    </ul>
                                )}
                                <div className="ficha-acciones">
                                    {!d.sinReserva && (
                                        <a href={wa(`Hola, quiero hacer una clase de prueba de ${d.nombre}`)} className="btn btn-primary" target="_blank" rel="noopener">
                                            <Icono n="whatsapp" /> Reservar prueba
                                        </a>
                                    )}
                                    <Link to={`/horarios?d=${id}`} className="btn-discipline">Ver horarios</Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
            <Cta
                titulo="¿Cuál es tu disciplina?"
                texto="Consultanos por WhatsApp y te ayudamos a elegir el camino perfecto para vos"
                mensaje="Hola, quiero información sobre las disciplinas"
                boton="¡Consultanos ahora!"
            />
        </>
    );
}
