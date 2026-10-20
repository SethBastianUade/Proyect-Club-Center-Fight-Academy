import { useCallback, useEffect, useState } from 'react';
import { DISCIPLINAS } from '../../data/disciplinas.js';
import { useContenido } from '../../contenido.jsx';
import Icono from '../../components/Icono.jsx';
import { api } from './api.js';

// Mismos estados que el CHECK de migrations/0001_leads.sql y ESTADOS en worker/index.js
const ESTADOS = {
    nuevo: 'Nuevo',
    contactado: 'Contactado',
    prueba: 'Vino a la prueba',
    inscripto: 'Se inscribió',
    descartado: 'Descartado',
};

// D1 guarda en UTC sin zona: "2026-10-20 21:58:00"
const fecha = (f) => new Date(f.replace(' ', 'T') + 'Z')
    .toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

// Números cargados a mano ("11 3159-8373", "011 15 3159-8373") → formato wa.me de Argentina (549 + área + número)
const waLead = (l) => {
    let n = l.telefono.replace(/\D/g, '').replace(/^0/, '');
    if (!n.startsWith('54') && n.length === 12) n = n.replace(/^(\d{2,4}?)15/, '$1'); // saca el 15 del celular
    const disc = DISCIPLINAS[l.disciplina]?.nombre;
    const texto = `Hola ${l.nombre.split(' ')[0]}! Te escribimos de Club Center Fight Academy por tu inscripción${disc ? ` a ${disc}` : ''}.`;
    return `https://wa.me/${n.startsWith('54') ? n : '549' + n}?text=${encodeURIComponent(texto)}`;
};

export default function Leads({ onError }) {
    const { planes } = useContenido();
    const [filtro, setFiltro] = useState('');
    const [datos, setDatos] = useState(null);

    const cargar = useCallback(() => {
        api(`leads${filtro ? `?estado=${filtro}` : ''}`).then(setDatos).catch(onError);
    }, [filtro, onError]);
    useEffect(cargar, [cargar]);

    const guardar = async (id, cambios) => {
        setDatos((d) => ({ ...d, leads: d.leads.map((l) => (l.id === id ? { ...l, ...cambios } : l)) }));
        try {
            await api(`leads/${id}`, { method: 'PATCH', body: cambios });
            if (cambios.estado) cargar(); // actualiza el conteo (y saca el lead si ya no entra en el filtro)
        } catch (e) {
            onError(e);
            cargar();
        }
    };

    const conteo = datos?.conteo || {};
    const total = Object.values(conteo).reduce((a, b) => a + b, 0);

    return (
        <>
            <div className="admin-filtros" role="group" aria-label="Filtrar por estado">
                <button className={`chip${!filtro ? ' on' : ''}`} onClick={() => setFiltro('')}>Todos · {total}</button>
                {Object.entries(ESTADOS).map(([k, v]) => (
                    <button key={k} className={`chip${filtro === k ? ' on' : ''}`} onClick={() => setFiltro(k)}>
                        {v} · {conteo[k] || 0}
                    </button>
                ))}
            </div>

            {!datos && <p className="empty">Cargando…</p>}
            {datos?.leads.length === 0 && <p className="empty">No hay interesados{filtro && ' con ese estado'}.</p>}

            <ul className="leads">
                {datos?.leads.map((l) => (
                    <li key={l.id} className={`lead lead-${l.estado}`}>
                        <div className="lead-top">
                            <strong>{l.nombre}</strong>
                            <span className="lead-fecha">{fecha(l.creado)}</span>
                        </div>
                        <p className="lead-info">
                            {[DISCIPLINAS[l.disciplina]?.nombre, planes.find((p) => p.id === l.plan)?.nombre ?? l.plan].filter(Boolean).join(' · ')}
                        </p>
                        <p className="lead-contacto">
                            <a href={waLead(l)} target="_blank" rel="noopener" className="lead-wa"><Icono n="whatsapp" /> {l.telefono}</a>
                            {l.email && <a href={`mailto:${l.email}`}><Icono n="envelope" /> {l.email}</a>}
                        </p>
                        <select
                            value={l.estado} aria-label={`Estado de ${l.nombre}`}
                            onChange={(e) => guardar(l.id, { estado: e.target.value })}
                        >
                            {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <textarea
                            defaultValue={l.notas || ''} placeholder="Notas" title="Se guardan al salir del campo" aria-label={`Notas de ${l.nombre}`}
                            onBlur={(e) => e.target.value !== (l.notas || '') && guardar(l.id, { notas: e.target.value })}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}
