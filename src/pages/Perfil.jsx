import { Link, useParams } from 'react-router';
import { useContenido } from '../contenido.jsx';
import { wa } from '../data/site.js';
import { useMeta } from '../components/ui.jsx';
import NoEncontrado from './NoEncontrado.jsx';
import Icono from '../components/Icono.jsx';

export default function Perfil() {
    const { slug } = useParams();
    const { competidores, cargando } = useContenido();
    const p = competidores.find((x) => x.slug === slug);
    useMeta(p?.nombre, p && `${p.nombre}, competidor de ${p.disciplina} en Club Center Fight Academy.`);
    if (cargando) return null;
    if (!p) return <NoEncontrado />;

    return (
        <section className="profile">
            <Link to="/nosotros" className="back"><Icono n="arrow-left" /> Volver al equipo</Link>
            <div className="profile-grid">
                <img
                    src={p.foto || '/Fotos/logo.webp'} alt={p.nombre}
                    width={p.w || 192} height={p.h || 181}
                    className={`profile-photo${p.foto ? '' : ' no-photo'}`}
                />
                <div>
                    <span className="section-label">Competidor · {p.disciplina}</span>
                    <h1>{p.nombre}</h1>
                    {p.record && (
                        <p className="record" aria-label="Récord">
                            <span><b>{p.record.g}</b> G</span><span><b>{p.record.p}</b> P</span><span><b>{p.record.e ?? 0}</b> E</span>
                        </p>
                    )}
                    {p.bio && <p className="profile-bio">{p.bio}</p>}
                    {p.logros?.length > 0 && (
                        <>
                            <h2>Logros</h2>
                            <ul className="logros">{p.logros.map((l) => <li key={l}><Icono n="trophy" /> {l}</li>)}</ul>
                        </>
                    )}
                    <a href={wa(`Hola, quiero entrenar ${p.disciplina} en el club`)} className="btn btn-primary" target="_blank" rel="noopener" data-lugar="perfil">
                        <Icono n="whatsapp" /> Entrená {p.disciplina}
                    </a>
                </div>
            </div>
            {p.fotos?.length > 0 && (
                <div className="profile-gallery">
                    {p.fotos.map((f) => <img key={f} src={f} alt={p.nombre} loading="lazy" decoding="async" />)}
                </div>
            )}
        </section>
    );
}
