import { Link } from 'react-router';
import { EQUIPO } from '../data/equipo.js';
import { Hero, SectionHeader, Cta, useMeta } from '../components/ui.jsx';

const VALORES = [['fa-handshake', 'Respeto'], ['fa-bolt', 'Disciplina'], ['fa-heart', 'Pasión'], ['fa-users', 'Comunidad'], ['fa-trophy', 'Excelencia']];

function Grupo({ rol, label, titulo, texto }) {
    const gente = EQUIPO.filter((p) => p.rol === rol);
    if (!gente.length) return null;
    return (
        <section className={`team-section team-${rol}`}>
            <SectionHeader label={label} titulo={titulo} texto={texto} />
            <div className="team-grid">
                {gente.map((p) => (
                    <Link to={`/equipo/${p.slug}`} className="team-card" key={p.slug}>
                        <img
                            src={p.foto || '/Fotos/logoClub.png'} alt={p.nombre}
                            width={p.w || 542} height={p.h || 510}
                            className={p.foto ? '' : 'no-photo'} loading="lazy" decoding="async"
                        />
                        <h3>{p.nombre}</h3>
                        <p>{rol === 'profesor' ? 'Profesor' : 'Competidor'} de {p.disciplina}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function Nosotros() {
    useMeta('Nosotros', 'Conocé la historia, valores, profesores y competidores de Club Center Fight Academy.');
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
                            {VALORES.map(([i, v]) => <li key={v}><i className={`fas ${i}`}></i> {v}</li>)}
                        </ul>
                    </div>
                    <div className="about-img">
                        <img src="/Fotos/nosotros1.webp" alt="Historia Club Center Fight Academy" width="1200" height="900" loading="lazy" decoding="async" />
                    </div>
                </div>
            </section>

            <Grupo rol="profesor" label="Staff" titulo="Nuestros profesores" texto="Instructores certificados en cada disciplina" />
            <Grupo rol="competidor" label="Orgullo del equipo" titulo="Competidores destacados" texto="Representantes de Club Center Fight Academy" />

            <Cta
                titulo="¿Querés ser parte?"
                texto="Sumate a Club Center Fight Academy y viví la experiencia de entrenar con los mejores"
                mensaje="Hola, quiero conocer el club"
                boton="¡Contactanos!"
            />
        </>
    );
}
