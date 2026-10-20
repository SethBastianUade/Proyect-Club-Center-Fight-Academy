import { Link } from 'react-router';
import { useMeta } from '../components/ui.jsx';

export default function NoEncontrado() {
    useMeta('Página no encontrada');
    return (
        <section className="profile" style={{ textAlign: 'center' }}>
            <span className="section-label">Error 404</span>
            <h1>NO ENCONTRAMOS ESA PÁGINA</h1>
            <p className="profile-bio">Puede que el link esté mal o que la página ya no exista.</p>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </section>
    );
}
