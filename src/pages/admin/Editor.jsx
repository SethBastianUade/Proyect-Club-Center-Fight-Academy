import { useCallback, useEffect, useState } from 'react';
import { useContenido } from '../../contenido.jsx';
import { api } from './api.js';

const NUEVO = Symbol('nuevo');

// Achica la foto en el navegador antes de subirla: WebP (o JPEG si el navegador no sabe hacer WebP), máx. 1600 px
async function achicar(archivo, max = 1600) {
    const img = await createImageBitmap(archivo);
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * k);
    canvas.height = Math.round(img.height * k);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const aBlob = (tipo, calidad) => new Promise((r) => canvas.toBlob(r, tipo, calidad));
    let blob = await aBlob('image/webp', 0.82);
    if (blob?.type !== 'image/webp') blob = await aBlob('image/jpeg', 0.85);
    return { blob, w: canvas.width, h: canvas.height };
}

function CampoFoto({ campo, valores, cambiar, onError }) {
    const [subiendo, setSubiendo] = useState(false);
    const url = valores[campo.k];

    const subir = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        setSubiendo(true);
        try {
            const { blob, w, h } = await achicar(archivo);
            const { url } = await api('fotos', { method: 'POST', body: blob });
            cambiar({ [campo.k]: url, ...(campo.dims && { w, h }) });
        } catch (err) {
            onError(err);
        } finally {
            setSubiendo(false);
            e.target.value = '';
        }
    };

    return (
        <div className="campo-foto">
            {url && <img src={url} alt="" />}
            <label className="chip">
                {subiendo ? 'Subiendo…' : url ? 'Cambiar foto' : 'Subir foto'}
                <input type="file" accept="image/*" onChange={subir} disabled={subiendo} hidden />
            </label>
            {url && !subiendo && (
                <button type="button" className="chip" onClick={() => cambiar({ [campo.k]: null, ...(campo.dims && { w: null, h: null }) })}>
                    Quitar
                </button>
            )}
        </div>
    );
}

function Formulario({ seccion, item, onGuardar, onCancelar, onError }) {
    const [valores, setValores] = useState(item);
    const [error, setError] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const cambiar = (cambios) => setValores((v) => ({ ...v, ...cambios }));

    const enviar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setError(null);
        try {
            await onGuardar(valores);
        } catch (err) {
            if (err.message === 'sesion') onError(err);
            else setError(err.message);
            setGuardando(false);
        }
    };

    return (
        <form className="editor-form" onSubmit={enviar}>
            {seccion.campos.map((c) => {
                const id = `campo-${c.k}`;
                const comun = {
                    id, value: valores[c.k] ?? '', required: c.req, placeholder: c.ph,
                    onChange: (e) => cambiar({ [c.k]: e.target.value }),
                };
                return (
                    <div key={c.k} className={`form-group campo-${c.t || 'texto'}`}>
                        <label htmlFor={c.t === 'foto' ? undefined : id}>{c.l}{c.req && ' *'}</label>
                        {c.t === 'select' ? (
                            <select {...comun}>{c.ops.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                        ) : c.t === 'largo' ? (
                            <textarea {...comun} />
                        ) : c.t === 'foto' ? (
                            <CampoFoto campo={c} valores={valores} cambiar={cambiar} onError={onError} />
                        ) : (
                            <input
                                {...comun}
                                type={{ numero: 'number', fecha: 'date', hora: 'time' }[c.t] || 'text'}
                                {...(c.t === 'numero' && { min: 0, inputMode: 'numeric' })}
                            />
                        )}
                        {c.ayuda && <small>{c.ayuda}</small>}
                    </div>
                );
            })}
            {error && <p className="admin-error" role="alert">{error}</p>}
            <div className="editor-acciones">
                <button type="submit" className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
                <button type="button" className="chip" onClick={onCancelar}>Cancelar</button>
            </div>
        </form>
    );
}

export default function Editor({ seccion, onError }) {
    const { tabla, clave, singular } = seccion;
    const { recargar } = useContenido();
    const [items, setItems] = useState(null);
    const [editando, setEditando] = useState(null); // clave del item, NUEVO o null

    const cargar = useCallback(() => api(`contenido/${tabla}`).then(setItems).catch(onError), [tabla, onError]);
    useEffect(() => {
        setItems(null);
        setEditando(null);
        cargar();
    }, [cargar]);

    const listo = async () => {
        recargar(); // el sitio público queda al día sin recargar la página
        await cargar(); // el form se cierra recién con la lista actualizada
        setEditando(null);
    };

    const guardar = async (valores) => {
        const esNuevo = editando === NUEVO;
        await api(esNuevo ? `contenido/${tabla}` : `contenido/${tabla}/${encodeURIComponent(editando)}`, {
            method: esNuevo ? 'POST' : 'PUT', body: valores,
        });
        listo();
    };

    const borrar = async (item) => {
        if (!confirm(`¿Borrar "${seccion.resumen(item).titulo}"? No se puede deshacer.`)) return;
        try {
            await api(`contenido/${tabla}/${encodeURIComponent(item[clave])}`, { method: 'DELETE' });
            listo();
        } catch (e) {
            onError(e);
        }
    };

    const form = (item) => (
        <Formulario seccion={seccion} item={item} onGuardar={guardar} onCancelar={() => setEditando(null)} onError={onError} />
    );

    if (!items) return <p className="empty">Cargando…</p>;

    return (
        <>
            {editando === NUEVO ? form(seccion.nuevo) : (
                <button className="btn btn-primary editor-agregar" onClick={() => setEditando(NUEVO)}>+ Agregar {singular}</button>
            )}
            {items.length === 0 && editando !== NUEVO && <p className="empty">Todavía no hay nada cargado.</p>}

            <ul className="editor-lista">
                {items.map((item, i) => {
                    const r = seccion.resumen(item);
                    const grupo = seccion.grupo?.(item);
                    return (
                        <li key={item[clave]}>
                            {grupo && grupo !== seccion.grupo(items[i - 1] ?? {}) && <h2 className="editor-grupo">{grupo}</h2>}
                            {editando === item[clave] ? form(item) : (
                                <div className="editor-item">
                                    {r.foto && <img src={r.foto} alt="" />}
                                    <div>
                                        <strong>{r.titulo}</strong>
                                        <span>{r.detalle}</span>
                                    </div>
                                    <button className="chip" onClick={() => setEditando(item[clave])}>Editar</button>
                                    <button className="chip chip-borrar" onClick={() => borrar(item)} aria-label={`Borrar ${r.titulo}`}>Borrar</button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
