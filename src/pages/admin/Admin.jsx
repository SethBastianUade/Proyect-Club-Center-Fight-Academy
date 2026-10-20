import { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useMeta } from '../../components/ui.jsx';
import { api } from './api.js';
import { SECCIONES } from './secciones.js';
import Leads from './Leads.jsx';
import Editor from './Editor.jsx';

// Panel interno del club (/admin). La sección activa queda en la URL: /admin?s=horarios
const MENU = [['interesados', 'Interesados'], ...Object.entries(SECCIONES).map(([k, s]) => [k, s.titulo])];

function Login({ onEntrar }) {
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const entrar = async (e) => {
        e.preventDefault();
        const password = e.currentTarget.password.value;
        setEnviando(true);
        try {
            await api('login', { method: 'POST', body: { password } });
            onEntrar();
        } catch (err) {
            // en el login un 401 es contraseña incorrecta, no sesión vencida
            setError(err.message === 'sesion' ? 'Contraseña incorrecta' : err.message);
            setEnviando(false);
        }
    };

    return (
        <div className="admin admin-login">
            <form className="inscription-form" onSubmit={entrar}>
                <img src="/Fotos/logoClub.png" alt="Club Center Fight Academy" width="542" height="510" />
                <h1>Panel del club</h1>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" name="password" autoComplete="current-password" required autoFocus />
                </div>
                {error && <p className="admin-error" role="alert">{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
            </form>
        </div>
    );
}

export default function Admin() {
    useMeta('Panel');
    const [params, setParams] = useSearchParams();
    const s = SECCIONES[params.get('s')] ? params.get('s') : 'interesados';
    const [sesion, setSesion] = useState(true);
    const [error, setError] = useState(null);

    const onError = useCallback((e) => (e.message === 'sesion' ? setSesion(false) : setError(e.message)), []);

    const salir = async () => {
        await api('logout', { method: 'POST' }).catch(() => {});
        setSesion(false);
    };

    if (!sesion) return <Login onEntrar={() => { setError(null); setSesion(true); }} />;

    return (
        <div className="admin">
            <header className="admin-header">
                <Link to="/" className="brand" aria-label="Volver al sitio"><img src="/Fotos/logoClub.png" alt="" width="542" height="510" /></Link>
                <h1>Panel</h1>
                <button className="chip admin-salir" onClick={salir}>Salir</button>
            </header>

            <nav className="admin-menu" aria-label="Secciones del panel">
                {MENU.map(([k, titulo]) => (
                    <button
                        key={k} className={`chip${s === k ? ' on' : ''}`} aria-current={s === k ? 'page' : undefined}
                        onClick={() => { setError(null); setParams(k === 'interesados' ? {} : { s: k }); }}
                    >
                        {titulo}
                    </button>
                ))}
            </nav>

            {error && (
                <p className="admin-error" role="alert">
                    {error} <button onClick={() => setError(null)}>Cerrar</button>
                </p>
            )}

            {s === 'interesados'
                ? <Leads onError={onError} />
                : <Editor key={s} seccion={SECCIONES[s]} onError={onError} />}
        </div>
    );
}
