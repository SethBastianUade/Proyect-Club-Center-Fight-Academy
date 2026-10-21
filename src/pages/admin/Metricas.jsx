import { useEffect, useState } from 'react';
import { PAGINAS } from '../../data/paginas.js';
import { api } from './api.js';

// Mismas claves que LUGARES en worker/metricas.js y que los data-lugar del sitio
const LUGARES = {
    hero: 'Botón principal del inicio',
    barra: 'Barra verde de abajo (celu)',
    flotante: 'Botón flotante (compu)',
    clase: 'Reservar en una clase de la grilla',
    disciplina: 'Reservar desde Disciplinas',
    plan: 'Consultar un plan',
    cta: 'Bloque final de cada página',
    evento: 'Página de un evento',
    perfil: 'Perfil de un competidor',
    contacto: 'WhatsApp en Contacto',
    otro: 'Otros',
};
const PERIODOS = [[7, 'Últimos 7 días'], [30, 'Últimos 30 días'], [90, 'Últimos 90 días']];

const nombrePagina = (ruta) => (ruta === '/' ? 'Inicio' : PAGINAS[ruta]?.titulo ?? ruta);

function Ranking({ titulo, filas, nombre }) {
    return (
        <div className="metricas-bloque">
            <h2>{titulo}</h2>
            {filas.length === 0 ? <p className="empty">Sin clics todavía.</p> : (
                <ol className="metricas-lista">
                    {filas.map(([k, n]) => <li key={k}><span>{nombre(k)}</span><b>{n}</b></li>)}
                </ol>
            )}
        </div>
    );
}

export default function Metricas({ onError }) {
    const [dias, setDias] = useState(30);
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        setDatos(null);
        api(`metricas?dias=${dias}`).then(setDatos).catch(onError);
    }, [dias, onError]);

    const clics = datos?.porLugar.reduce((t, f) => t + f.n, 0) ?? 0;

    return (
        <>
            <div className="admin-filtros" role="group" aria-label="Período">
                {PERIODOS.map(([d, l]) => (
                    <button key={d} className={`chip${dias === d ? ' on' : ''}`} onClick={() => setDias(d)}>{l}</button>
                ))}
            </div>

            {!datos ? <p className="empty">Cargando…</p> : (
                <>
                    <div className="metricas-totales">
                        <div><b>{clics}</b><span>clics a WhatsApp</span></div>
                        <div><b>{datos.leads}</b><span>inscripciones por formulario</span></div>
                    </div>
                    <div className="metricas-grid">
                        <Ranking titulo="Desde qué botón" filas={datos.porLugar.map((f) => [f.lugar, f.n])} nombre={(k) => LUGARES[k] ?? k} />
                        <Ranking titulo="Desde qué página" filas={datos.porPagina.map((f) => [f.pagina, f.n])} nombre={nombrePagina} />
                    </div>
                    <p className="metricas-nota">
                        Cuenta cada vez que alguien toca un botón de WhatsApp en el sitio (no sabemos quién ni si después escribió).
                        Las visitas por página están en Cloudflare → Web Analytics.
                    </p>
                </>
            )}
        </>
    );
}
