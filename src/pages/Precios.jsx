import { Link } from 'react-router';
import { PLANES, FILAS, precio } from '../data/planes.js';
import { wa } from '../data/site.js';
import { Hero, Cta, useMeta } from '../components/ui.jsx';

const celda = (v) => (v === true ? <i className="fas fa-check" aria-label="Incluido"></i> : v === false ? <i className="fas fa-minus" aria-label="No incluido"></i> : v);

export default function Precios() {
    useMeta('Precios y planes', 'Planes y precios de Club Center Fight Academy. Elegí el plan que mejor se adapta a tu rutina. Primera clase sin cargo.');
    return (
        <>
            <Hero badge="Planes" titulo="ELEGÍ TU" resaltado="PLAN" subtitulo="Primera clase de prueba sin cargo en cualquier plan" fondo="hero-nosotros" />

            <section className="pricing-section">
                <div className="plans">
                    {PLANES.map((p) => (
                        <div key={p.id} className={`plan${p.destacado ? ' featured' : ''}`}>
                            {p.destacado && <span className="plan-tag">Más elegido</span>}
                            <h3>{p.nombre}</h3>
                            <p className="plan-price">{precio(p.precio)}{p.precio != null && <small>/mes</small>}</p>
                            <ul>
                                {FILAS.map(([k, label]) => {
                                    const v = p.items[k];
                                    return (
                                        <li key={k} className={v === false ? 'off' : ''}>
                                            <i className={`fas ${v === false ? 'fa-minus' : 'fa-check'}`} aria-hidden="true"></i>
                                            {typeof v === 'string' ? v : label}
                                        </li>
                                    );
                                })}
                            </ul>
                            <Link to={`/inscripcion?plan=${p.id}`} className="btn btn-primary">Inscribirme</Link>
                            <a href={wa(`Hola, quiero info sobre el plan ${p.nombre}`)} className="plan-ask" target="_blank" rel="noopener">
                                <i className="fab fa-whatsapp"></i> Consultar
                            </a>
                        </div>
                    ))}
                </div>

                <div className="compare-wrap">
                    <table className="compare">
                        <caption>Compará los planes</caption>
                        <thead>
                            <tr><th scope="col"></th>{PLANES.map((p) => <th scope="col" key={p.id}>{p.nombre}</th>)}</tr>
                        </thead>
                        <tbody>
                            <tr><th scope="row">Precio mensual</th>{PLANES.map((p) => <td key={p.id}>{precio(p.precio)}</td>)}</tr>
                            {FILAS.map(([k, label]) => (
                                <tr key={k}><th scope="row">{label}</th>{PLANES.map((p) => <td key={p.id}>{celda(p.items[k])}</td>)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <Cta
                titulo="¿DUDAS CON LOS PLANES?"
                texto="Te ayudamos a elegir según tus objetivos y disponibilidad"
                mensaje="Hola, quería consultar por los precios y planes"
                boton="Consultar por WhatsApp"
            />
        </>
    );
}
