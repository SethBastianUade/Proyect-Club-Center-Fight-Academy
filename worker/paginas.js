// Páginas HTML: el Worker toma el index.html de los assets y le inserta el contenido de D1, para que
// React arranque con los datos (window.__CONTENIDO__) y los buscadores / WhatsApp vean info actualizada.

import { leerContenido } from './contenido.js';
import { jsonEnScript } from './util.js';
import { MARCA, PAGINAS } from '../src/data/paginas.js';

const DIAS_SCHEMA = { lun: 'Monday', mar: 'Tuesday', mie: 'Wednesday', jue: 'Thursday', vie: 'Friday', sab: 'Saturday' };

export async function pagina(request, env) {
    // Sin los headers condicionales: si no, los assets responden 304 y el navegador mostraría contenido viejo
    const limpio = new Request(request.url, { method: request.method, headers: request.headers });
    limpio.headers.delete('If-None-Match');
    limpio.headers.delete('If-Modified-Since');
    const res = await env.ASSETS.fetch(limpio);
    if (!res.headers.get('Content-Type')?.includes('text/html')) return res;

    let contenido;
    try {
        contenido = await leerContenido(env);
    } catch {
        return res; // sin base: la página igual anda y React pide /api/contenido
    }

    const url = new URL(request.url);
    const ruta = url.pathname.replace(/\/+$/, '') || '/';
    const meta = metaDe(ruta, contenido); // null = la página no existe
    const canonica = url.origin + ruta; // sin query: /horarios?d=bjj es la misma página que /horarios
    const contenidoDe = (valor) => ({ element: (e) => e.setAttribute('content', valor) });

    let html = new HTMLRewriter()
        .on('head', { element: (e) => e.append(`<script>window.__CONTENIDO__=${jsonEnScript(contenido)}</script>`, { html: true }) })
        .on('script#ld-negocio', { element: (e) => e.setInnerContent(jsonEnScript(ldNegocio(url, contenido)), { html: true }) })
        .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonica) })
        .on('meta[property="og:url"]', contenidoDe(canonica));

    // Cada página con su título y descripción (si no, buscadores y WhatsApp ven los del inicio)
    if (meta?.titulo) {
        html = html
            .on('title', { element: (e) => e.setInnerContent(`${meta.titulo} | ${MARCA}`) })
            .on('meta[property="og:title"]', contenidoDe(meta.titulo));
    }
    if (meta?.descripcion) {
        html = html
            .on('meta[name="description"]', contenidoDe(meta.descripcion))
            .on('meta[property="og:description"]', contenidoDe(meta.descripcion));
    }
    if (meta?.imagen) html = html.on('meta[property="og:image"]', contenidoDe(new URL(meta.imagen, url.origin).href));
    if (!meta || meta.privada) {
        html = html.on('head', { element: (e) => e.append('<meta name="robots" content="noindex">', { html: true }) });
    }

    // Rutas inexistentes: 404 de verdad (React igual muestra su página de "no encontrado")
    const out = new Response(html.transform(res).body, { status: meta ? res.status : 404, headers: res.headers });
    out.headers.set('Cache-Control', 'no-cache');
    out.headers.delete('ETag');
    out.headers.delete('Content-Length');
    return out;
}

function metaDe(ruta, { eventos, competidores }) {
    if (PAGINAS[ruta]) return PAGINAS[ruta];
    if (ruta === '/admin') return { titulo: 'Panel', privada: true };
    if (ruta === '/checkin') return { titulo: 'Check-in', privada: true };
    const [, seccion, slug, ...resto] = ruta.split('/');
    if (resto.length) return null;
    if (seccion === 'eventos' && slug) {
        const e = eventos.find((x) => x.slug === slug);
        return e ? { titulo: e.titulo, descripcion: e.resumen || e.titulo, imagen: e.foto } : null;
    }
    if (seccion === 'equipo' && slug) {
        const p = competidores.find((x) => x.slug === slug);
        return p ? { titulo: p.nombre, descripcion: `${p.nombre}, competidor de ${p.disciplina} en ${MARCA}.`, imagen: p.foto } : null;
    }
    return null;
}

// Ficha del negocio para Google: horarios = primera y última clase de cada día, rango de precios de los planes
function ldNegocio(url, { clases, planes }) {
    const porDia = {};
    for (const c of clases) {
        const d = (porDia[c.dia] ??= { opens: c.desde, closes: c.hasta });
        if (c.desde < d.opens) d.opens = c.desde;
        if (c.hasta > d.closes) d.closes = c.hasta;
    }
    const horarios = Object.entries(porDia).map(([dia, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS_SCHEMA[dia], ...h }));
    const precios = planes.map((p) => p.precio).filter((p) => p != null);
    const peso = (n) => `$${n.toLocaleString('es-AR')}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: MARCA,
        description: 'Academia de artes marciales en CABA: Jiu-Jitsu, Muay Thai, Boxeo, MMA y Grappling.',
        url: `${url.origin}/`,
        logo: `${url.origin}/Fotos/logoClub.png`,
        image: `${url.origin}/Fotos/bannerD.webp`,
        foundingDate: '2020',
        telephone: '+5491131598373',
        email: 'administracion@clubcenterfa.com',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Solis 1213',
            addressLocality: 'Ciudad Autónoma de Buenos Aires',
            addressRegion: 'CABA',
            addressCountry: 'AR',
        },
        ...(horarios.length && { openingHoursSpecification: horarios }),
        ...(precios.length && { priceRange: `${peso(Math.min(...precios))} - ${peso(Math.max(...precios))} por mes` }),
        sameAs: ['https://instagram.com/clubcenterfightacademy'],
    };
}

export async function sitemap(url, env) {
    const { eventos, competidores } = await leerContenido(env);
    const rutas = [...Object.keys(PAGINAS), ...eventos.map((e) => `/eventos/${e.slug}`), ...competidores.map((p) => `/equipo/${p.slug}`)];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
        rutas.map((r) => `  <url><loc>${url.origin}${r}</loc></url>`).join('\n')
    }\n</urlset>\n`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
