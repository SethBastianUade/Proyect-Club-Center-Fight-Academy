export const json = (data, status = 200, headers = {}) =>
    Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export const txt = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Para meter JSON adentro de un <script> sin que un "</script>" en los datos lo corte
export const jsonEnScript = (data) => JSON.stringify(data).replace(/</g, '\u003c');
