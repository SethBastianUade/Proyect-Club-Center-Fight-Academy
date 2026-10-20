import { useSearchParams } from 'react-router';
import { DISCIPLINAS, PRINCIPALES } from '../data/disciplinas.js';
import { useContenido } from '../contenido.jsx';
import { wa } from '../data/site.js';
import { SectionHeader, useMeta } from '../components/ui.jsx';
import Icono from '../components/Icono.jsx';

export default function Inscripcion() {
    useMeta('Inscripción', 'Inscribite en Club Center Fight Academy. Completá el formulario y te contactamos por WhatsApp.');
    const [params] = useSearchParams();
    const { planes } = useContenido();

    const enviar = (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget));
        const plan = planes.find((p) => p.id === f.plan)?.nombre;
        const texto = [
            'Hola! Quiero inscribirme en Club Center Fight Academy.', '',
            `Nombre: ${f.nombre}`, `Teléfono: ${f.telefono}`, ...(f.email ? [`Email: ${f.email}`] : []),
            `Disciplina: ${DISCIPLINAS[f.disciplina].nombre}`, `Plan: ${plan}`, '',
            '¿Me pasan info para comenzar?',
        ].join('\n');
        // Queda guardado para el panel de leads. keepalive: el request sigue aunque el navegador ya se fue a WhatsApp
        fetch('/api/leads', {
            method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
        }).catch(() => { /* si falla, igual llega por WhatsApp */ });
        window.location.href = wa(texto);
    };

    return (
        <section className="inscription-section">
            <SectionHeader label="Empezá hoy" titulo="Inscripción" texto="Completá el formulario y te contactamos por WhatsApp para coordinar tu inicio" />
            <div className="inscription-container">
                <form className="inscription-form" onSubmit={enviar}>
                    {/* Trampa para bots: invisible para personas */}
                    <input type="text" name="web" className="trampa" tabIndex="-1" autoComplete="off" aria-hidden="true" />
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo *</label>
                        <input type="text" id="nombre" name="nombre" placeholder="Tu nombre y apellido" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono *</label>
                        <input type="tel" id="telefono" name="telefono" placeholder="+54 9 11 ..." autoComplete="tel" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email <small>(opcional)</small></label>
                        <input type="email" id="email" name="email" placeholder="tucorreo@email.com" autoComplete="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="disciplina">Disciplina *</label>
                        <select id="disciplina" name="disciplina" defaultValue={params.get('d') || ''} required>
                            <option value="">Seleccioná una disciplina</option>
                            {PRINCIPALES.map((id) => <option key={id} value={id}>{DISCIPLINAS[id].nombre}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="plan">Plan *</label>
                        <select id="plan" name="plan" defaultValue={params.get('plan') || ''} required>
                            <option value="">Seleccioná un plan</option>
                            {planes.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary"><Icono n="whatsapp" /> Completar inscripción</button>
                </form>
            </div>
        </section>
    );
}
