import { useSearchParams } from 'react-router';
import { CLASES, DIAS } from '../data/horarios.js';
import { DISCIPLINAS } from '../data/disciplinas.js';
import { wa } from '../data/site.js';
import { Hero, Cta, useMeta } from '../components/ui.jsx';

const hs = (t) => t.replace(/^0/, '').replace(':00', '');
const HOY = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'][new Date().getDay()];
const DISCS = [...new Set(CLASES.map((c) => c.disc))];

export default function Horarios() {
    useMeta('Horarios', 'Grilla de horarios de Club Center Fight Academy: Muay Thai, Boxeo, Jiu-Jitsu, MMA, Grappling y Sparring. Reservá tu clase de prueba gratis.');
    const [params, setParams] = useSearchParams();
    const disc = params.get('d');
    const dia = params.get('dia');

    const set = (k, v) => {
        const p = new URLSearchParams(params);
        v ? p.set(k, v) : p.delete(k);
        setParams(p, { replace: true, preventScrollReset: true });
    };

    const clases = CLASES.filter((c) => (!disc || c.disc === disc) && (!dia || c.dia === dia));
    const dias = Object.keys(DIAS).filter((d) => clases.some((c) => c.dia === d));

    return (
        <>
            <Hero badge="Grilla de clases" titulo="ENCONTRÁ TU" resaltado="HORARIO" subtitulo="Filtrá por disciplina y día, y reservá tu clase de prueba sin cargo" fondo="hero-contacto" />

            <section className="schedule-section horarios">
                <div className="filters" role="group" aria-label="Filtrar por disciplina">
                    <button className={`chip${!disc ? ' on' : ''}`} onClick={() => set('d')}>Todas</button>
                    {DISCS.map((d) => (
                        <button key={d} className={`chip${disc === d ? ' on' : ''}`} style={{ '--c': DISCIPLINAS[d].color }} onClick={() => set('d', d)}>
                            {DISCIPLINAS[d].nombre}
                        </button>
                    ))}
                </div>
                <div className="filters" role="group" aria-label="Filtrar por día">
                    <button className={`chip${!dia ? ' on' : ''}`} onClick={() => set('dia')}>Toda la semana</button>
                    {Object.entries(DIAS).map(([k, v]) => (
                        <button key={k} className={`chip${dia === k ? ' on' : ''}`} onClick={() => set('dia', k)}>
                            {v}{k === HOY && ' · hoy'}
                        </button>
                    ))}
                </div>

                {dias.length === 0 ? (
                    <p className="empty">No hay clases con esos filtros.</p>
                ) : (
                    <div className="week" style={{ '--cols': dias.length }}>
                        {dias.map((d) => (
                            <div key={d} className={`day${d === HOY ? ' today' : ''}`}>
                                <h3>{DIAS[d]}{d === HOY && <span>Hoy</span>}</h3>
                                {clases.filter((c) => c.dia === d).map((c) => {
                                    const nombre = c.nombre || DISCIPLINAS[c.disc].nombre;
                                    return (
                                        <div key={c.desde + c.disc} className="clase" style={{ '--c': DISCIPLINAS[c.disc].color }}>
                                            <span className="clase-hora">{hs(c.desde)} a {hs(c.hasta)} hs</span>
                                            <strong>{nombre}</strong>
                                            <a
                                                href={wa(`Hola, quiero hacer una clase de prueba de ${nombre} el ${DIAS[d].toLowerCase()} de ${hs(c.desde)} a ${hs(c.hasta)} hs`)}
                                                target="_blank" rel="noopener"
                                            >
                                                <i className="fab fa-whatsapp"></i> Reservar prueba
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Cta
                titulo="¿NO ENCONTRÁS TU HORARIO?"
                texto="Escribinos y te ayudamos a armar tu semana de entrenamiento"
                mensaje="Hola, quería consultar por los horarios"
                boton="Consultar horarios"
            />
        </>
    );
}
