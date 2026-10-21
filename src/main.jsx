import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { ContenidoProvider } from './contenido.jsx';
// Fuentes servidas desde el propio sitio. Inter variable: un solo archivo para todos los pesos
// (el navegador baja solo el subset latin, que cubre tildes y ñ)
import '@fontsource-variable/inter/wght.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ContenidoProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ContenidoProvider>
    </StrictMode>
);
