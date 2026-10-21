import { Link } from 'react-router';
import { FILAS, precio } from '../data/planes.js';
import { useContenido } from '../contenido.jsx';
import { wa } from '../data/site.js';
import { Hero, Cta, usePagina } from '../components/ui.jsx';
import Icono from '../components/Icono.jsx';

const celda = (v) => (v === true ? <Icono n="check" label="Incluido" /> : v === false ? <Icono n="minus" label="No incluido" className="no" /> : v);

export default function Precios() {
    const { planes } = useContenido();
    usePagina('/precios');
    return (
        <>
            <Hero badge="Planes" titulo="Elegí tu" resaltado="plan" subtitulo="Primera clase de prueba sin cargo en cualquier plan" fondo="hero-nosotros" />

            <section className="pricing-section">
                <div className="plans">
                    {planes.map((p) => (
                        <div key={p.id} className={`plan${p.destacado ? ' featured' : ''}`}>
                            {p.destacado && <span className="plan-tag">{p.destacado}</span>}
                            <h3>{p.nombre}</h3>
                            <p className="plan-price">{precio(p.precio)}{p.precio != null && <small>/mes</small>}</p>
                            <ul>
                                {FILAS.filter(([k]) => p.items[k] != null).map(([k, label]) => {
                                    const v = p.items[k];
                                    return (
                                        <li key={k} className={v === false ? 'off' : ''}>
                                            <Icono n={v === false ? 'minus' : 'check'} />
                                            {typeof v === 'string' ? v : label}
                                        </li>
                                    );
                                })}
                            </ul>
                            <Link to={`/inscripcion?plan=${p.id}`} className="btn btn-primary">Inscribirme</Link>
                            <a href={wa(`Hola, quiero info sobre el plan ${p.nombre}`)} className="plan-ask" target="_blank" rel="noopener" data-lugar="plan">
                                <Icono n="whatsapp" /> Consultar
                            </a>
                        </div>
                    ))}
                </div>

                <div className="compare-wrap">
                    <table className="compare">
                        <caption>Compará los planes</caption>
                        <thead>
                            <tr><th scope="col"></th>{planes.map((p) => <th scope="col" key={p.id}>{p.nombre}</th>)}</tr>
                        </thead>
                        <tbody>
                            <tr><th scope="row">Precio mensual</th>{planes.map((p) => <td key={p.id}>{precio(p.precio)}</td>)}</tr>
                            {FILAS.map(([k, label]) => (
                                <tr key={k}><th scope="row">{label}</th>{planes.map((p) => <td key={p.id}>{celda(p.items[k])}</td>)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <Cta
                titulo="¿Dudas con los planes?"
                texto="Te ayudamos a elegir según tus objetivos y disponibilidad"
                mensaje="Hola, quería consultar por los precios y planes"
                boton="Consultar por WhatsApp"
            />
        </>
    );
}
