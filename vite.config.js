import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITIO } from './src/data/site.js';
import { EVENTOS } from './src/data/eventos.js';
import { COMPETIDORES } from './src/data/equipo.js';

// Mismas rutas que src/App.jsx: si sumás una página, agregala acá también
const PAGINAS = ['', 'disciplinas', 'horarios', 'precios', 'eventos', 'nosotros', 'contacto', 'inscripcion'];

// sitemap.xml armado en el build con los eventos y competidores de src/data
const sitemap = () => ({
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
        const rutas = [...PAGINAS, ...EVENTOS.map((e) => `eventos/${e.slug}`), ...COMPETIDORES.map((p) => `equipo/${p.slug}`)];
        const urls = rutas.map((r) => `  <url><loc>${SITIO}/${r}</loc></url>`).join('\n');
        this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
    },
});

export default defineConfig({
    plugins: [react(), sitemap()],
    // La API corre en `npm run dev:api` (wrangler dev, puerto 8787)
    server: { proxy: { '/api': 'http://localhost:8787' } },
});
