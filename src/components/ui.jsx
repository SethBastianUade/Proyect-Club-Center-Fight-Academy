import { useEffect } from 'react';
import { wa } from '../data/site.js';

export function Hero({ badge, titulo, resaltado, subtitulo, fondo = 'hero-disciplinas' }) {
    return (
        <section className={`hero-section ${fondo}`}>
            <div className="hero-content">
                <span className="hero-badge">{badge}</span>
                <h1 className="hero-title">{titulo}{resaltado && <><br /><span>{resaltado}</span></>}</h1>
                {subtitulo && <p className="hero-subtitle">{subtitulo}</p>}
            </div>
        </section>
    );
}

export function SectionHeader({ label, titulo, texto }) {
    return (
        <div className="section-header">
            <span className="section-label">{label}</span>
            <h2>{titulo}</h2>
            {texto && <p>{texto}</p>}
        </div>
    );
}

export function Cta({ titulo, texto, mensaje, boton = '¡Contactanos ahora!' }) {
    return (
        <section className="cta-section">
            <div className="cta-content">
                <h2>{titulo}</h2>
                <p>{texto}</p>
                <a href={wa(mensaje)} className="btn btn-primary" target="_blank" rel="noopener">
                    <i className="fab fa-whatsapp"></i> {boton}
                </a>
            </div>
        </section>
    );
}

// Pisa el <title>/description estáticos de index.html (que quedan para previews sin JS, ej. WhatsApp)
const DEFAULT_DESC = document.querySelector('meta[name="description"]')?.content;

export function useMeta(titulo, descripcion) {
    useEffect(() => {
        document.title = titulo ? `${titulo} | Club Center Fight Academy` : 'Club Center Fight Academy - Academia Profesional de Artes Marciales';
        document.querySelector('meta[name="description"]')?.setAttribute('content', descripcion || DEFAULT_DESC);
    }, [titulo, descripcion]);
}
