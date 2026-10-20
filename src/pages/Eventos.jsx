import { proximos, pasados } from '../data/eventos.js';
import { Hero, SectionHeader, Cta, useMeta } from '../components/ui.jsx';
import EventoCard from '../components/EventoCard.jsx';

export default function Eventos() {
    useMeta('Eventos', 'Torneos, seminarios y exámenes de graduación de Club Center Fight Academy.');
    const prox = proximos();
    const past = pasados();
    return (
        <>
            <Hero badge="Agenda del club" titulo="Torneos y" resaltado="eventos" subtitulo="Torneos, seminarios y exámenes de graduación" fondo="hero-disciplinas" />

            <section className="events-section">
                <SectionHeader label="Lo que viene" titulo="Próximos eventos" />
                {prox.length
                    ? <div className="events-grid">{prox.map((e) => <EventoCard key={e.slug} evento={e} />)}</div>
                    : <p className="empty">No hay eventos programados por ahora. Seguinos en Instagram para enterarte primero.</p>}
            </section>

            {past.length > 0 && (
                <section className="events-section past">
                    <SectionHeader label="Archivo" titulo="Eventos anteriores" />
                    <div className="events-grid">{past.map((e) => <EventoCard key={e.slug} evento={e} />)}</div>
                </section>
            )}

            <Cta
                titulo="¿Querés participar?"
                texto="Consultanos por los próximos torneos y seminarios"
                mensaje="Hola, quería consultar por los próximos eventos"
            />
        </>
    );
}
