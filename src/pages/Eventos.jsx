import { proximos, pasados } from '../data/eventos.js';
import { useContenido } from '../contenido.jsx';
import { INSTAGRAM } from '../data/site.js';
import { Hero, SectionHeader, Cta, usePagina } from '../components/ui.jsx';
import EventoCard from '../components/EventoCard.jsx';

export default function Eventos() {
    usePagina('/eventos');
    const { eventos } = useContenido();
    const prox = proximos(eventos);
    const past = pasados(eventos);
    return (
        <>
            <Hero badge="Agenda del club" titulo="Torneos y" resaltado="eventos" subtitulo="Torneos, seminarios y exámenes de graduación" fondo="hero-disciplinas" />

            <section className="events-section">
                <SectionHeader label="Lo que viene" titulo="Próximos eventos" />
                {prox.length
                    ? <div className="events-grid">{prox.map((e) => <EventoCard key={e.slug} evento={e} />)}</div>
                    : <p className="empty">No hay eventos programados por ahora. <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">Seguinos en Instagram</a> para enterarte primero.</p>}
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
