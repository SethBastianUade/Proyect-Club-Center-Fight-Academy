import { useEffect } from 'react';
import { wa } from '../data/site.js';
import { MARCA, TITULO_INICIO, PAGINAS } from '../data/paginas.js';
import Icono from './Icono.jsx';

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

// principal: en páginas sin Hero el encabezado de la sección es el título de la página (h1)
export function SectionHeader({ label, titulo, texto, principal = false }) {
    const H = principal ? 'h1' : 'h2';
    return (
        <div className="section-header">
            <span className="section-label">{label}</span>
            <H>{titulo}</H>
            {texto && <p>{texto}</p>}
        </div>
    );
}

export function Cta({ titulo, texto, mensaje, boton = '¡Contactanos ahora!' }) {
    return (
        <section className="cta-section" data-lugar="cta">
            <div className="cta-content">
                <h2>{titulo}</h2>
                <p>{texto}</p>
                <a href={wa(mensaje)} className="btn btn-primary" target="_blank" rel="noopener">
                    <Icono n="whatsapp" /> {boton}
                </a>
            </div>
        </section>
    );
}

// Pisa el <title>/description del HTML al navegar entre páginas (el Worker ya los escribe bien en la carga inicial)
export function useMeta(titulo, descripcion) {
    useEffect(() => {
        document.title = titulo ? `${titulo} | ${MARCA}` : TITULO_INICIO;
        document.querySelector('meta[name="description"]')?.setAttribute('content', descripcion || PAGINAS['/'].descripcion);
    }, [titulo, descripcion]);
}

export const usePagina = (ruta) => useMeta(PAGINAS[ruta].titulo, PAGINAS[ruta].descripcion);
