import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { TIPOS, fechaLarga } from '../data/eventos.js';
import { useContenido } from '../contenido.jsx';
import { wa } from '../data/site.js';
import { Hero, useMeta } from '../components/ui.jsx';
import NoEncontrado from './NoEncontrado.jsx';
import Icono from '../components/Icono.jsx';

export default function Evento() {
    const { slug } = useParams();
    const { eventos, cargando } = useContenido();
    const e = eventos.find((x) => x.slug === slug);
    const [copiado, setCopiado] = useState(false);
    useMeta(e?.titulo, e?.resumen);
    if (cargando) return null;
    if (!e) return <NoEncontrado />;

    const futuro = e.fecha >= new Date().toISOString().slice(0, 10);

    const compartir = async () => {
        const data = { title: e.titulo, text: e.resumen, url: location.href };
        try {
            if (navigator.share) return await navigator.share(data);
            await navigator.clipboard.writeText(location.href);
            setCopiado(true);
        } catch { /* el usuario canceló */ }
    };

    return (
        <>
            <Hero badge={TIPOS[e.tipo]} titulo={e.titulo} fondo="hero-disciplinas hero-evento" />
            <section className="event-detail">
                <Link to="/eventos" className="back"><Icono n="arrow-left" /> Todos los eventos</Link>
                <ul className="event-facts">
                    <li><Icono n="calendar" /> <span className="cap">{fechaLarga(e.fecha)}</span></li>
                    {e.hora && <li><Icono n="clock" /> {e.hora} hs</li>}
                    {e.lugar && <li><Icono n="mapa" /> {e.lugar}</li>}
                </ul>
                {e.foto && <img src={e.foto} alt={`Flyer de ${e.titulo}`} className="event-flyer" />}
                {e.texto && <p className="event-text">{e.texto}</p>}
                <div className="event-actions">
                    {futuro && (
                        <a href={wa(`Hola, quiero info sobre "${e.titulo}" (${e.fecha})`)} className="btn btn-primary" target="_blank" rel="noopener" data-lugar="evento">
                            <Icono n="whatsapp" /> Quiero participar
                        </a>
                    )}
                    <button className="btn btn-outline" onClick={compartir}>
                        <Icono n="share" /> {copiado ? '¡Link copiado!' : 'Compartir'}
                    </button>
                </div>
            </section>
        </>
    );
}
