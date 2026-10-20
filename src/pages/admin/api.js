// fetch a /api/admin/*. Tira Error('sesion') si la sesión venció; si no, con el mensaje del servidor
export async function api(path, { body, ...opciones } = {}) {
    const esArchivo = body instanceof Blob;
    const r = await fetch(`/api/admin/${path}`, {
        ...opciones,
        body: esArchivo || body === undefined ? body : JSON.stringify(body),
        headers: { 'Content-Type': esArchivo ? body.type : 'application/json' },
    });
    if (r.status === 401) throw new Error('sesion');
    const data = await r.json().catch(() => null);
    if (!r.ok) throw new Error(data?.error || 'No se pudo conectar con el servidor');
    return data;
}
