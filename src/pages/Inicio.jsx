import { Link } from 'react-router';
import { wa, DIRECCION, MAPA } from '../data/site.js';
import { precio } from '../data/planes.js';
import { DISCIPLINAS, PRINCIPALES } from '../data/disciplinas.js';
import { proximos } from '../data/eventos.js';
import { SectionHeader, Cta, usePagina } from '../components/ui.jsx';
import { OPINIONES, GOOGLE_RESENAS } from '../data/opiniones.js';
import EventoCard from '../components/EventoCard.jsx';
import ClaseCard from '../components/ClaseCard.jsx';
import Icono from '../components/Icono.jsx';
import { proximasClases } from '../data/horarios.js';
import { useContenido } from '../contenido.jsx';

const PRUEBA = wa('Hola, quiero hacer una clase de prueba');

const STATS = [['200+', 'Alumnos activos'], ['4', 'Disciplinas'], ['2020', 'Entrenando desde'], ['50+', 'Torneos disputados']];

export default function Inicio() {
    usePagina('/');
    const contenido = useContenido();
    const eventos = proximos(contenido.eventos).slice(0, 3);
    const proximas = proximasClases(contenido.clases, 3);
    const precios = contenido.planes.map((p) => p.precio).filter((p) => p != null);


    return (
        <>
            <section className="hero-banner">
                <img
                    src="/Fotos/bannerD.webp" srcSet="/Fotos/bannerD-800.webp 800w, /Fotos/bannerD.webp 1600w" sizes="100vw"
                    alt="" className="hero-banner-bg" fetchPriority="high"
                />
                <div className="hero-banner-inner">
                    <div className="hero-pill fade-in-1">
                        <span>Gratis</span> Primera clase de prueba sin cargo
                    </div>
                    <h1 className="fade-in-2">Entrená como<br /><span>un campeón</span></h1>
                    <p className="hero-banner-desc fade-in-3">
                        Jiu-Jitsu, Muay Thai, Boxeo y MMA en el corazón de CABA. Profesores certificados y clases para todos los niveles, desde tu primer día hasta tu primera pelea.
                    </p>
                    <div className="hero-banner-actions fade-in-4" data-lugar="hero">
                        <a href={PRUEBA} className="hb-btn hb-btn-primary" target="_blank" rel="noopener">
                            <Icono n="whatsapp" /> Reservar clase de prueba
                        </a>
                        <Link to="/horarios" className="hb-btn hb-btn-ghost">
                            Ver horarios <Icono n="arrow-right" />
                        </Link>
                    </div>
                    {precios.length > 0 && (
                        <Link to="/precios" className="hero-precio fade-in-4">
                            Planes desde <b>{precio(Math.min(...precios))}</b>/mes · Ver precios
                        </Link>
                    )}

                    <div className="hero-stats fade-in-4">
                        {STATS.map(([n, l]) => (
                            <div key={l}><strong>{n}</strong><span>{l}</span></div>
                        ))}
                    </div>
                </div>
            </section>

            {proximas && (
                <section className="hoy-section">
                    <div className="hoy-club">
                        <div className="hoy-head">
                            <span className="section-label">{proximas.cuando} en el club</span>
                            <h2>Próximas clases</h2>
                            <p>Tocá una clase y reservá tu prueba gratis por WhatsApp.</p>
                        </div>
                        <div className="hoy-list">
                            {proximas.clases.map((c) => <ClaseCard key={c.desde + c.disc} clase={c} />)}
                        </div>
                        <Link to="/horarios" className="btn-discipline">Ver grilla completa</Link>
                    </div>
                </section>
            )}

            <section className="disciplines-section">
                <SectionHeader label="Lo que entrenamos" titulo="Nuestras disciplinas" texto="Elegí tu camino hacia la excelencia con instructores certificados" />
                <div className="disciplines-grid">
                    {PRINCIPALES.map((id) => {
                        const d = DISCIPLINAS[id];
                        return (
                            <div className="discipline-card" key={id} style={{ '--c': d.color }}>
                                <h3>{d.nombre}</h3>
                                <p>{d.corta}</p>
                                <Link to={`/horarios?d=${id}`} className="btn-discipline">Ver horarios</Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {eventos.length > 0 && (
                <section className="events-section">
                    <SectionHeader label="Agenda" titulo="Próximos eventos" texto="Torneos, seminarios y exámenes de graduación" />
                    <div className="events-grid">
                        {eventos.map((e) => <EventoCard key={e.slug} evento={e} />)}
                    </div>
                    <p className="section-more"><Link to="/eventos" className="btn-discipline">Ver todos los eventos</Link></p>
                </section>
            )}

            <section className="testimonials-section">
                <SectionHeader label="Opiniones" titulo="Lo que dicen nuestros alumnos" texto="Experiencias reales de nuestra comunidad" />
                <ul className="reviews">
                    {OPINIONES.map((o) => (
                        <li className="review" key={o.autor}>
                            <Icono n="google" label="Reseña de Google" />
                            <blockquote>“{o.texto}”</blockquote>
                            <p className="review-author"><span aria-hidden="true">{o.autor[0]}</span>{o.autor}</p>
                        </li>
                    ))}
                </ul>
                <p className="section-more">
                    <a href={GOOGLE_RESENAS} className="btn-discipline" target="_blank" rel="noopener">Ver todas en Google</a>
                </p>
            </section>

            <section className="ubicacion-section">
                <div className="ubicacion">
                    <div>
                        <span className="section-label">Dónde estamos</span>
                        <h2>{DIRECCION}</h2>
                        <p>Clases de lunes a sábado. <Link to="/horarios">Ver horarios</Link></p>
                    </div>
                    <a href={MAPA} className="btn btn-outline" target="_blank" rel="noopener"><Icono n="mapa" /> Cómo llegar</a>
                </div>
            </section>

            <Cta
                titulo="¿Listo para empezar?"
                texto="Agendá tu primera clase de prueba gratuita hoy mismo y sentí la diferencia"
                mensaje="Hola, quiero hacer una clase de prueba"
            />
        </>
    );
}
