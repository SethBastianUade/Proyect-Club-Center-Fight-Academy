import { useEffect } from 'react';
import { Link } from 'react-router';
import { wa } from '../data/site.js';
import { DISCIPLINAS, PRINCIPALES } from '../data/disciplinas.js';
import { proximos } from '../data/eventos.js';
import { SectionHeader, Cta, useMeta } from '../components/ui.jsx';
import EventoCard from '../components/EventoCard.jsx';

const PRUEBA = wa('Hola, quiero hacer una clase de prueba');

const STATS = [['200+', 'Alumnos Activos'], ['4', 'Disciplinas'], ['10+', 'Años de Experiencia'], ['50+', 'Torneos Participados']];

const FEATURES = [
    ['fa-medal', 'Profesores Certificados', 'Instructores con amplia experiencia y certificaciones internacionales en cada disciplina.'],
    ['fa-users', 'Comunidad Activa', 'Sumate a una comunidad apasionada por las artes marciales, el respeto y la superación.'],
    ['fa-dumbbell', 'Instalaciones Modernas', 'Espacios equipados y actualizados para que alcances tu mejor rendimiento.'],
    ['fa-trophy', 'Competencias', 'Participación y representación en torneos nacionales e internacionales.'],
];

export default function Inicio() {
    useMeta();
    const eventos = proximos().slice(0, 3);

    // Widget de reseñas de Google (Elfsight)
    useEffect(() => {
        if (document.querySelector('script[src*="elfsight"]')) return;
        const s = document.createElement('script');
        s.src = 'https://static.elfsight.com/platform/platform.js';
        s.async = true;
        document.body.appendChild(s);
    }, []);

    return (
        <>
            <section className="hero-banner">
                <img src="/Fotos/bannerD.webp" alt="" className="hero-banner-bg" fetchPriority="high" />
                <div className="hero-banner-inner">
                    <div className="hero-pill fade-in-1">
                        <span>Gratis</span> Primera clase de prueba sin cargo
                    </div>
                    <h1 className="fade-in-2">Entrená como<br /><span>un campeón</span></h1>
                    <p className="hero-banner-desc fade-in-3">
                        Jiu-Jitsu, Muay Thai, Boxeo y MMA en el corazón de CABA. Profesores certificados y clases para todos los niveles, desde tu primer día hasta tu primera pelea.
                    </p>
                    <div className="hero-banner-actions fade-in-4">
                        <a href={PRUEBA} className="hb-btn hb-btn-primary" target="_blank" rel="noopener">
                            <i className="fab fa-whatsapp"></i> Reservar clase de prueba
                        </a>
                        <Link to="/horarios" className="hb-btn hb-btn-ghost">
                            Ver horarios <i className="fas fa-arrow-right" aria-hidden="true"></i>
                        </Link>
                    </div>

                    <div className="hero-stats fade-in-4">
                        {STATS.map(([n, l]) => (
                            <div key={l}><strong>{n}</strong><span>{l}</span></div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="disciplines-section">
                <SectionHeader label="Lo que entrenamos" titulo="NUESTRAS DISCIPLINAS" texto="Elegí tu camino hacia la excelencia con instructores certificados" />
                <div className="disciplines-grid">
                    {PRINCIPALES.map((id) => {
                        const d = DISCIPLINAS[id];
                        return (
                            <div className="discipline-card" key={id}>
                                <img src={d.img} alt={d.nombre} width={d.w} height={d.h} loading="lazy" decoding="async" />
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
                    <SectionHeader label="Agenda" titulo="PRÓXIMOS EVENTOS" texto="Torneos, seminarios y exámenes de graduación" />
                    <div className="events-grid">
                        {eventos.map((e) => <EventoCard key={e.slug} evento={e} />)}
                    </div>
                    <p className="section-more"><Link to="/eventos" className="btn-discipline">Ver todos los eventos</Link></p>
                </section>
            )}

            <section className="why-us-section">
                <SectionHeader label="Nuestra diferencia" titulo="¿POR QUÉ ELEGIRNOS?" texto="Somos más que una academia de artes marciales" />
                <div className="features-grid">
                    {FEATURES.map(([icon, t, p]) => (
                        <div className="feature-card" key={t}>
                            <i className={`fas ${icon}`}></i>
                            <h3>{t}</h3>
                            <p>{p}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="testimonials-section">
                <SectionHeader label="Opiniones" titulo="LO QUE DICEN NUESTROS ALUMNOS" texto="Experiencias reales de nuestra comunidad" />
                <div className="elfsight-app-14b65929-b170-4f67-a161-ebc540e7ea4a" data-elfsight-app-lazy></div>
            </section>

            <Cta
                titulo="¿LISTO PARA COMENZAR?"
                texto="Agendá tu primera clase de prueba gratuita hoy mismo y sentí la diferencia"
                mensaje="Hola, quiero hacer una clase de prueba"
            />
        </>
    );
}
