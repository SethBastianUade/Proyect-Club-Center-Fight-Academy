import { Link } from 'react-router';
import { useContenido } from '../contenido.jsx';
import { Hero, SectionHeader, Siguiente, usePagina } from '../components/ui.jsx';
import { wa } from '../data/site.js';
import Icono from '../components/Icono.jsx';

const VALORES = [['handshake', 'Respeto'], ['bolt', 'Disciplina'], ['heart', 'Pasión'], ['users', 'Comunidad'], ['trophy', 'Excelencia']];

function Competidores() {
    const { competidores } = useContenido();
    if (!competidores.length) return null;
    return (
        <section className="team-section">
            <SectionHeader label="Orgullo del equipo" titulo="Competidores destacados" texto="Representantes de Club Center Fight Academy" />
            <div className="team-grid">
                {competidores.map((p) => (
                    <Link to={`/equipo/${p.slug}`} className="team-card" key={p.slug}>
                        <img
                            src={p.foto || '/Fotos/logo.webp'} alt={p.nombre}
                            width={p.w || 192} height={p.h || 181}
                            className={p.foto ? '' : 'no-photo'} loading="lazy" decoding="async"
                        />
                        <h3>{p.nombre}</h3>
                        <p>Competidor de {p.disciplina}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function Nosotros() {
    usePagina('/nosotros');
    return (
        <>
            <Hero badge="Quiénes somos" titulo="Club Center" resaltado="Fight Academy" subtitulo="Pasión, valores y excelencia en artes marciales desde CABA" fondo="hero-nosotros" />

            <section className="about-section">
                <SectionHeader
                    label="Nuestra historia" titulo="De dónde venimos"
                    texto="Club Center Fight Academy nació con el sueño de crear una comunidad donde el respeto, la disciplina y la superación personal sean los pilares fundamentales."
                />
                <div className="about-container">
                    <div className="about-text">
                        <div className="section-header align-left">
                            <span className="section-label">Lo que nos guía</span>
                            <h2>Nuestros valores</h2>
                        </div>
                        <ul className="about-values">
                            {VALORES.map(([i, v]) => <li key={v}><Icono n={i} /> {v}</li>)}
                        </ul>
                    </div>
                    <div className="about-img">
                        <img src="/Fotos/nosotros1.webp" srcSet="/Fotos/nosotros1-800.webp 800w, /Fotos/nosotros1.webp 1200w" sizes="(min-width: 768px) 55vw, 100vw" alt="Alumnos entrenando en Club Center Fight Academy" width="1200" height="900" loading="lazy" decoding="async" />
                    </div>
                </div>
            </section>

            <Competidores />

            <Siguiente>
                Conocé las <Link to="/disciplinas">disciplinas</Link> o <a href={wa('Hola, quiero hacer una clase de prueba')} target="_blank" rel="noopener">reservá tu clase de prueba</a>.
            </Siguiente>
        </>
    );
}
