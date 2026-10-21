// Métricas de conversión: clics a WhatsApp por página y lugar (migrations/0004_clics.sql).
// El sitio los manda con sendBeacon desde components/Layout.jsx; el panel los muestra en la pestaña Métricas.

import { json } from './util.js';

// Mismas claves que los data-lugar del sitio y que LUGARES en src/pages/admin/Metricas.jsx
const LUGARES = ['hero', 'barra', 'flotante', 'clase', 'cta', 'plan', 'disciplina', 'evento', 'perfil', 'contacto', 'otro'];

// Fecha de hoy (o de hace `atras` días) en Argentina, UTC-3 todo el año
const diaArgentina = (atras = 0) => new Date(Date.now() - 3 * 3600e3 - atras * 86400e3).toISOString().slice(0, 10);

export async function sumarClic(request, env) {
    let d;
    try { d = JSON.parse(await request.text()); } catch { return new Response(null, { status: 400 }); }
    const pagina = typeof d.pagina === 'string' && /^\/[\w/-]{0,80}$/.test(d.pagina) ? d.pagina : null;
    if (!pagina || !LUGARES.includes(d.lugar)) return new Response(null, { status: 400 });

    await env.DB.prepare('INSERT INTO clics (dia, pagina, lugar, n) VALUES (?, ?, ?, 1) ON CONFLICT (dia, pagina, lugar) DO UPDATE SET n = n + 1')
        .bind(diaArgentina(), pagina, d.lugar).run();
    return new Response(null, { status: 204 });
}

export async function verMetricas(url, env) {
    const dias = Math.min(Math.max(Number(url.searchParams.get('dias')) || 30, 1), 365);
    const desde = diaArgentina(dias - 1);
    const [porLugar, porPagina, leads] = await env.DB.batch([
        env.DB.prepare('SELECT lugar, SUM(n) AS n FROM clics WHERE dia >= ? GROUP BY lugar ORDER BY n DESC').bind(desde),
        env.DB.prepare('SELECT pagina, SUM(n) AS n FROM clics WHERE dia >= ? GROUP BY pagina ORDER BY n DESC').bind(desde),
        // leads.creado está en UTC ("2026-10-20 21:58:00"): la comparación por texto alcanza para un resumen
        env.DB.prepare('SELECT COUNT(*) AS n FROM leads WHERE creado >= ?').bind(desde),
    ]);
    return json({ dias, desde, porLugar: porLugar.results, porPagina: porPagina.results, leads: leads.results[0].n });
}
