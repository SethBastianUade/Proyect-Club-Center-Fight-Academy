import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { EVENTOS, TIPOS, fechaLarga } from '../data/eventos.js';
import { wa } from '../data/site.js';
import { Hero, useMeta } from '../components/ui.jsx';
import NoEncontrado from './NoEncontrado.jsx';

export default function Evento() {
    const { slug } = useParams();
    const e = EVENTOS.find((x) => x.slug === slug);
    const [copiado, setCopiado] = useState(false);
    useMeta(e?.titulo, e?.resumen);
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
                <Link to="/eventos" className="back"><i className="fas fa-arrow-left"></i> Todos los eventos</Link>
                <ul className="event-facts">
                    <li><i className="far fa-calendar"></i> <span className="cap">{fechaLarga(e.fecha)}</span></li>
                    {e.hora && <li><i className="far fa-clock"></i> {e.hora} hs</li>}
                    {e.lugar && <li><i className="fas fa-map-marker-alt"></i> {e.lugar}</li>}
                </ul>
                <p className="event-text">{e.texto}</p>
                <div className="event-actions">
                    {futuro && (
                        <a href={wa(`Hola, quiero info sobre "${e.titulo}" (${e.fecha})`)} className="btn btn-primary" target="_blank" rel="noopener">
                            <i className="fab fa-whatsapp"></i> Quiero participar
                        </a>
                    )}
                    <button className="btn btn-outline" onClick={compartir}>
                        <i className="fas fa-share-nodes"></i> {copiado ? '¡Link copiado!' : 'Compartir'}
                    </button>
                </div>
            </section>
        </>
    );
}
