import { useSearchParams } from 'react-router';
import { DIAS, hoy } from '../data/horarios.js';
import { useContenido } from '../contenido.jsx';
import { DISCIPLINAS } from '../data/disciplinas.js';
import { Hero, Siguiente, usePagina } from '../components/ui.jsx';
import { wa } from '../data/site.js';
import ClaseCard from '../components/ClaseCard.jsx';

const HOY = hoy();
// En el celu la semana entera es una lista larguísima: sin filtros arrancamos en hoy
const DIA_INICIAL = HOY in DIAS && window.matchMedia('(max-width: 767px)').matches ? HOY : 'todos';

export default function Horarios() {
    usePagina('/horarios');
    const { clases: todas } = useContenido();
    const discs = Object.keys(DISCIPLINAS).filter((d) => todas.some((c) => c.disc === d));
    const [params, setParams] = useSearchParams();
    const disc = params.get('d');
    const dia = params.get('dia') || (disc ? 'todos' : DIA_INICIAL);

    const set = (k, v) => {
        const p = new URLSearchParams(params);
        v ? p.set(k, v) : p.delete(k);
        setParams(p, { replace: true, preventScrollReset: true });
    };

    const clases = todas.filter((c) => (!disc || c.disc === disc) && (dia === 'todos' || c.dia === dia));
    const dias = Object.keys(DIAS).filter((d) => clases.some((c) => c.dia === d));

    return (
        <>
            <Hero badge="Grilla de clases" titulo="Encontrá tu" resaltado="horario" subtitulo="Todas las clases son para todos los niveles. Filtrá por disciplina y día, y reservá tu prueba sin cargo" fondo="hero-contacto" />

            <section className="schedule-section horarios">
                <div className="filters" role="group" aria-label="Filtrar por disciplina">
                    <button className={`chip${!disc ? ' on' : ''}`} onClick={() => set('d')}>Todas</button>
                    {discs.map((d) => (
                        <button key={d} className={`chip${disc === d ? ' on' : ''}`} style={{ '--c': DISCIPLINAS[d].color }} onClick={() => set('d', d)}>
                            {DISCIPLINAS[d].nombre}
                        </button>
                    ))}
                </div>
                <div className="filters" role="group" aria-label="Filtrar por día">
                    <button className={`chip${dia === 'todos' ? ' on' : ''}`} onClick={() => set('dia', 'todos')}>Toda la semana</button>
                    {Object.entries(DIAS).map(([k, v]) => (
                        <button key={k} className={`chip${dia === k ? ' on' : ''}`} onClick={() => set('dia', k)}>
                            {v}{k === HOY && ' · hoy'}
                        </button>
                    ))}
                </div>

                {dias.length === 0 ? (
                    <div className="empty">
                        <p>No hay clases con esos filtros.</p>
                        {dia !== 'todos' && <button className="chip" onClick={() => set('dia', 'todos')}>Ver toda la semana</button>}
                    </div>
                ) : (
                    <div className="week" style={{ '--cols': dias.length }}>
                        {dias.map((d) => (
                            <div key={d} className={`day${d === HOY ? ' today' : ''}`}>
                                <h2>{DIAS[d]}{d === HOY && <span>Hoy</span>}</h2>
                                {clases.filter((c) => c.dia === d).map((c) => <ClaseCard key={c.desde + c.disc} clase={c} />)}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Siguiente>
                ¿Ningún horario te sirve? <a href={wa('Hola, quería consultar por los horarios')} target="_blank" rel="noopener">Escribinos</a> y armamos tu semana.
            </Siguiente>
        </>
    );
}
