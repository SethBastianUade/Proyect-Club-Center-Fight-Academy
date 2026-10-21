import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { DISCIPLINAS } from '../data/disciplinas.js';
import { hs } from '../data/horarios.js';
import { useMeta } from '../components/ui.jsx';
import Icono from '../components/Icono.jsx';

// Check-in de socios (plan.md). Se llega escaneando el QR de recepción: /checkin?c=<código>.
// Los datos del socio vienen de BiFrost a través de worker/socios.js.

const CLAVE_CODIGO = 'checkin-codigo';

// El código del QR se guarda en la pestaña: si el socio tiene que loguearse, no se pierde
function codigoDelQr(params) {
    const c = params.get('c');
    try {
        if (c) sessionStorage.setItem(CLAVE_CODIGO, c);
        return c || sessionStorage.getItem(CLAVE_CODIGO);
    } catch {
        return c;
    }
}

async function pedir(path, body) {
    const r = await fetch(`/api/socio/${path}`, body === undefined ? {} : {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    return { status: r.status, ok: r.ok, ...data };
}

// Ubicación opcional: si el socio no da permiso o tarda, el check-in sigue igual
const ubicacion = () => new Promise((resolver) => {
    if (!navigator.geolocation) return resolver(null);
    navigator.geolocation.getCurrentPosition(
        (p) => resolver({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolver(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
});

const nombreClase = (c) => c.nombre || DISCIPLINAS[c.disc]?.nombre || c.disc;
const fechaCorta = (f) => f.split('-').reverse().slice(0, 2).join('/');

function Ingreso({ onEntrar }) {
    const [activar, setActivar] = useState(false);
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const enviar = async (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget));
        setEnviando(true);
        setError(null);
        const r = await pedir(activar ? 'activar' : 'login', f).catch(() => ({ mensaje: 'No se pudo conectar. Revisá tu conexión.' }));
        setEnviando(false);
        if (r.ok) return onEntrar();
        if (r.codigo === 'CUENTA_NO_ACTIVADA') setActivar(true);
        setError(r.mensaje || 'Algo salió mal.');
    };

    return (
        <form className="inscription-form checkin-form" onSubmit={enviar} key={activar ? 'activar' : 'login'}>
            <h1>{activar ? 'Activá tu cuenta' : 'Check-in'}</h1>
            <p className="checkin-ayuda">
                {activar
                    ? 'Usá el código que te dieron en recepción y elegí tu contraseña. Solo la primera vez.'
                    : 'Ingresá con tu DNI. Este celular queda recordado para la próxima.'}
            </p>
            <div className="form-group">
                <label htmlFor="dni">DNI</label>
                <input id="dni" name="dni" inputMode="numeric" autoComplete="username" placeholder="Sin puntos" required />
            </div>
            {activar && (
                <div className="form-group">
                    <label htmlFor="codigo">Código de activación</label>
                    <input id="codigo" name="codigo" autoComplete="one-time-code" autoCapitalize="characters" required />
                </div>
            )}
            <div className="form-group">
                <label htmlFor="password">{activar ? 'Elegí una contraseña' : 'Contraseña'}</label>
                <input
                    type="password" id="password" name="password" required minLength={activar ? 6 : undefined}
                    autoComplete={activar ? 'new-password' : 'current-password'}
                />
            </div>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={enviando}>
                {enviando ? 'Un momento…' : activar ? 'Activar y entrar' : 'Entrar'}
            </button>
            <button type="button" className="checkin-link" onClick={() => { setActivar(!activar); setError(null); }}>
                {activar ? 'Ya tengo contraseña' : 'Es mi primera vez / me olvidé la contraseña'}
            </button>
        </form>
    );
}

function Resultado({ resultado, onVolver }) {
    const ok = resultado.ok;
    return (
        <div className={`checkin-resultado ${ok ? 'ok' : 'error'}`} role="status">
            <span className="checkin-icono"><Icono n={ok ? 'check' : 'xmark'} /></span>
            <h1>{ok ? '¡Listo!' : 'No se pudo registrar'}</h1>
            {ok && <p className="checkin-clase">{resultado.clase ? `${nombreClase(resultado.clase)} · ${hs(resultado.clase.desde)} hs` : 'Entrenamiento libre'}</p>}
            <p>{resultado.mensaje}</p>
            {ok ? <p className="checkin-ayuda">Buen entrenamiento.</p> : <button className="btn btn-outline" onClick={onVolver}>Volver</button>}
        </div>
    );
}

export default function Checkin() {
    useMeta('Check-in');
    const [params] = useSearchParams();
    const [codigo] = useState(() => codigoDelQr(params));
    const [datos, setDatos] = useState(null); // respuesta de GET /api/socio/checkin
    const [claseId, setClaseId] = useState(null);
    const [paso, setPaso] = useState(null); // null | 'ubicacion' | 'registrando'
    const [resultado, setResultado] = useState(null);

    const cargar = useCallback(() => {
        setDatos(null);
        pedir('checkin').catch(() => ({ status: 0, mensaje: 'No se pudo conectar. Revisá tu conexión.' })).then((r) => {
            setDatos(r);
            if (r.clases?.length === 1) setClaseId(r.clases[0].id);
        });
    }, []);
    useEffect(cargar, [cargar]);

    const hacerCheckin = async () => {
        setPaso('ubicacion');
        const pos = await ubicacion();
        setPaso('registrando');
        const r = await pedir('checkin', { codigo, claseId, ...pos }).catch(() => ({ mensaje: 'No se pudo conectar. Revisá tu conexión.' }));
        setPaso(null);
        setResultado(r);
    };

    const salir = async () => {
        await pedir('salir', {}).catch(() => {});
        cargar();
    };

    let contenido;
    if (resultado) {
        contenido = <Resultado resultado={resultado} onVolver={() => { setResultado(null); cargar(); }} />;
    } else if (!datos) {
        contenido = <p className="empty">Cargando…</p>;
    } else if (datos.status === 401) {
        contenido = <Ingreso onEntrar={cargar} />;
    } else if (!datos.ok) {
        contenido = <div className="checkin-resultado error"><p>{datos.mensaje || 'Algo salió mal.'}</p></div>;
    } else {
        const { socio, clases } = datos;
        const vencida = socio.cuota?.estado === 'VENCIDA';
        const elegir = clases.length > 1;
        contenido = (
            <div className="checkin-panel">
                <div className="checkin-saludo">
                    <h1>Hola, {socio.nombre.split(' ')[0]}</h1>
                    <button className="checkin-link" onClick={salir}>No soy yo</button>
                </div>

                <ul className="checkin-estado">
                    <li className={vencida ? 'mal' : 'bien'}>
                        Cuota {vencida ? 'vencida' : 'al día'}
                        {socio.cuota?.vence && <span>{vencida ? 'venció' : 'vence'} el {fechaCorta(socio.cuota.vence)}</span>}
                    </li>
                    <li className={socio.clasesRestantesSemana === 0 ? 'mal' : 'bien'}>
                        {socio.clasesRestantesSemana == null ? 'Clases libres' : `${socio.clasesRestantesSemana} clases disponibles esta semana`}
                        <span>{socio.plan?.nombre}</span>
                    </li>
                </ul>

                <div className="checkin-clases">
                    <h2>{elegir ? '¿A qué clase venís?' : 'Clase'}</h2>
                    {clases.length === 0 && <p className="checkin-ayuda">No hay una clase en este horario: se registra como entrenamiento libre.</p>}
                    {clases.map((c) => (
                        <label key={c.id} className={`checkin-opcion${claseId === c.id ? ' on' : ''}`} style={{ '--c': DISCIPLINAS[c.disc]?.color }}>
                            {elegir && <input type="radio" name="clase" checked={claseId === c.id} onChange={() => setClaseId(c.id)} />}
                            <strong>{nombreClase(c)}</strong>
                            <span>{hs(c.desde)} a {hs(c.hasta)} hs</span>
                        </label>
                    ))}
                </div>

                {!codigo && <p className="admin-error">Para hacer el check-in escaneá el QR que está en recepción.</p>}
                <button
                    className="btn btn-primary checkin-boton" onClick={hacerCheckin}
                    disabled={!codigo || paso !== null || (elegir && claseId === null)}
                >
                    <Icono n="check" /> {paso === 'ubicacion' ? 'Verificando ubicación…' : paso === 'registrando' ? 'Registrando…' : 'Hacer check-in'}
                </button>
                <p className="checkin-ayuda">Te vamos a pedir la ubicación para confirmar que estás en el club.</p>
                {datos.modo === 'simulado' && <p className="checkin-aviso">Modo de prueba: BiFrost simulado</p>}
            </div>
        );
    }

    return (
        <div className="checkin">
            <Link to="/" className="checkin-logo" aria-label="Ir al sitio de Club Center Fight Academy">
                <img src="/Fotos/logo.webp" alt="" width="192" height="181" />
            </Link>
            {contenido}
        </div>
    );
}
