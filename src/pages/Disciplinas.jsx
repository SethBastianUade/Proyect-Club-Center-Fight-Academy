import { Link } from 'react-router';
import { DISCIPLINAS, PRINCIPALES } from '../data/disciplinas.js';
import { Hero, SectionHeader, Cta, useMeta } from '../components/ui.jsx';

export default function Disciplinas() {
    useMeta('Disciplinas', 'Conocé todas las disciplinas de Club Center Fight Academy: Jiu-Jitsu, Muay Thai, Boxeo y MMA con profesores certificados en CABA.');
    return (
        <>
            <Hero badge="Lo que entrenamos" titulo="NUESTRAS" resaltado="DISCIPLINAS" subtitulo="Descubrí tu pasión y entrená con los mejores instructores" />
            <section className="disciplines-section">
                <SectionHeader label="Elegí tu camino" titulo="ELEGÍ TU DISCIPLINA" texto="Jiu-Jitsu, Muay Thai, Boxeo y MMA con profesores certificados. Clases para todos los niveles." />
                <div className="disciplines-grid">
                    {PRINCIPALES.map((id) => {
                        const d = DISCIPLINAS[id];
                        return (
                            <div className="discipline-card" id={id} key={id}>
                                <img src={d.img} alt={d.nombre} width={d.w} height={d.h} loading="lazy" decoding="async" />
                                <h3>{d.nombre}</h3>
                                <p>{d.larga}</p>
                                <Link to={`/horarios?d=${id}`} className="btn-discipline">Ver horarios</Link>
                            </div>
                        );
                    })}
                </div>
            </section>
            <Cta
                titulo="¿CUÁL ES TU DISCIPLINA?"
                texto="Consultanos por WhatsApp y te ayudamos a elegir el camino perfecto para vos"
                mensaje="Hola, quiero información sobre las disciplinas"
                boton="¡Consultanos ahora!"
            />
        </>
    );
}
