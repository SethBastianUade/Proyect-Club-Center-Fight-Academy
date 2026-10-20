import { Link, useParams } from 'react-router';
import { EQUIPO } from '../data/equipo.js';
import { wa } from '../data/site.js';
import { useMeta } from '../components/ui.jsx';
import NoEncontrado from './NoEncontrado.jsx';
import Icono from '../components/Icono.jsx';

export default function Perfil() {
    const { slug } = useParams();
    const p = EQUIPO.find((x) => x.slug === slug);
    const rol = p?.rol === 'profesor' ? 'Profesor' : 'Competidor';
    useMeta(p?.nombre, p && `${p.nombre}, ${rol.toLowerCase()} de ${p.disciplina} en Club Center Fight Academy.`);
    if (!p) return <NoEncontrado />;

    return (
        <section className="profile">
            <Link to="/nosotros" className="back"><Icono n="arrow-left" /> Volver al equipo</Link>
            <div className="profile-grid">
                <img
                    src={p.foto || '/Fotos/logoClub.png'} alt={p.nombre}
                    width={p.w || 542} height={p.h || 510}
                    className={`profile-photo${p.foto ? '' : ' no-photo'}`}
                />
                <div>
                    <span className="section-label">{rol} · {p.disciplina}</span>
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
                    <a href={wa(`Hola, quiero entrenar ${p.disciplina} en el club`)} className="btn btn-primary" target="_blank" rel="noopener">
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
