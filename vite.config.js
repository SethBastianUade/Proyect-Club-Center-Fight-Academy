import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// sitemap.xml lo arma el Worker (worker/index.js) con los eventos y competidores de D1
export default defineConfig({
    plugins: [react()],
    // La API corre en `npm run dev:api` (wrangler dev, puerto 8787)
    server: { proxy: { '/api': 'http://localhost:8787' } },
});
