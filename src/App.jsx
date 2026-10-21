import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import Disciplinas from './pages/Disciplinas.jsx';
import Horarios from './pages/Horarios.jsx';
import Precios from './pages/Precios.jsx';
import Eventos from './pages/Eventos.jsx';
import Evento from './pages/Evento.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Perfil from './pages/Perfil.jsx';
import Contacto from './pages/Contacto.jsx';
import Inscripcion from './pages/Inscripcion.jsx';
import NoEncontrado from './pages/NoEncontrado.jsx';
import Privacidad from './pages/Privacidad.jsx';

// El panel va en un archivo aparte: los visitantes del sitio no descargan su código
const Admin = lazy(() => import('./pages/admin/Admin.jsx'));

export default function App() {
    return (
        <Routes>
            {/* Panel interno, sin el layout del sitio y con su propio login */}
            <Route path="admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
            <Route element={<Layout />}>
                <Route index element={<Inicio />} />
                <Route path="disciplinas" element={<Disciplinas />} />
                <Route path="horarios" element={<Horarios />} />
                <Route path="precios" element={<Precios />} />
                <Route path="eventos" element={<Eventos />} />
                <Route path="eventos/:slug" element={<Evento />} />
                <Route path="nosotros" element={<Nosotros />} />
                <Route path="equipo/:slug" element={<Perfil />} />
                <Route path="contacto" element={<Contacto />} />
                <Route path="inscripcion" element={<Inscripcion />} />
                <Route path="privacidad" element={<Privacidad />} />
                <Route path="*" element={<NoEncontrado />} />
            </Route>
        </Routes>
    );
}
