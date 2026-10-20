import { Link } from 'react-router';
import { TIPOS } from '../data/eventos.js';

export default function EventoCard({ evento: e }) {
    const f = new Date(e.fecha + 'T12:00:00');
    return (
        <Link to={`/eventos/${e.slug}`} className={`event-card tipo-${e.tipo}`}>
            <div className="event-date">
                <span className="event-day">{f.getDate()}</span>
                <span className="event-month">{f.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')}</span>
            </div>
            <div className="event-body">
                <span className="event-type">{TIPOS[e.tipo]}</span>
                <h3>{e.titulo}</h3>
                <p>{e.resumen}</p>
            </div>
        </Link>
    );
}
