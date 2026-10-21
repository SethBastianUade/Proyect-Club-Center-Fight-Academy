import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import Icono from './Icono.jsx';
import { wa, TELEFONO, DIRECCION, EMAIL, INSTAGRAM } from '../data/site.js';
import { proximos } from '../data/eventos.js';
import { useContenido } from '../contenido.jsx';

const NAV = [
    ['/', 'Inicio'],
    ['/disciplinas', 'Disciplinas'],
    ['/horarios', 'Horarios'],
    ['/precios', 'Precios'],
    ['/eventos', 'Eventos'],
    ['/nosotros', 'Nosotros'],
    ['/contacto', 'Contacto'],
];

const PRUEBA = wa('Hola, quiero hacer una clase de prueba');
// Páginas con su propio formulario: la barra de WhatsApp competiría con su botón
const SIN_BARRA = ['/inscripcion', '/contacto'];

export default function Layout() {
    const { pathname } = useLocation();
    const [menu, setMenu] = useState(false);
    const [arriba, setArriba] = useState(false);
    const [pasoHero, setPasoHero] = useState(false);
    const { eventos } = useContenido();
    // Eventos solo en el menú cuando hay alguno por venir
    const nav = proximos(eventos).length ? NAV : NAV.filter(([to]) => to !== '/eventos');
    // En el inicio el hero ya tiene su botón de reservar: la barra aparece recién al pasarlo
    const barra = !SIN_BARRA.includes(pathname) && (pathname !== '/' || pasoHero);

    useEffect(() => {
        setMenu(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = menu ? 'hidden' : '';
        if (!menu) return;
        const onKey = (e) => e.key === 'Escape' && setMenu(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [menu]);

    // Métricas anónimas: cuenta cada clic a WhatsApp con la página y el lugar del botón (data-lugar).
    // Va acá y no en main.jsx para no contar los clics del panel /admin
    useEffect(() => {
        const onClick = (e) => {
            const a = e.target.closest?.('a[href^="https://wa.me/"]');
            if (!a) return;
            const lugar = a.closest('[data-lugar]')?.dataset.lugar || 'otro';
            navigator.sendBeacon?.('/api/clic', JSON.stringify({ pagina: location.pathname, lugar }));
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            setArriba(window.scrollY > 300);
            setPasoHero(window.scrollY > window.innerHeight * 0.7);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header className="site-header">
                <div className="header-inner">
                    <Link to="/" className="brand" aria-label="Club Center Fight Academy, inicio">
                        <img src="/Fotos/logo.webp" alt="" width="192" height="181" />
                    </Link>
                    <nav className={`nav-pill${menu ? " open" : ""}`} id="nav-menu" aria-label="Principal">
                        <ul>
                            {nav.map(([to, label]) => (
                                <li key={to}><NavLink to={to} end={to === "/"}>{label}</NavLink></li>
                            ))}
                        </ul>
                        <Link to="/inscripcion" className="nav-cta">
                            Inscribite <Icono n="arrow-right" />
                        </Link>
                    </nav>
                    <button
                        className="menu-btn" aria-label={menu ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={menu} aria-controls="nav-menu" onClick={() => setMenu(!menu)}
                    >
                        <Icono n={menu ? "xmark" : "bars"} />
                    </button>
                </div>
            </header>

            <a href={PRUEBA} className={`mobile-cta${barra ? '' : ' oculta'}`} data-lugar="barra" target="_blank" rel="noopener" aria-hidden={!barra} tabIndex={barra ? undefined : -1}>
                <Icono n="whatsapp" /> Reservar clase de prueba gratis
            </a>

            <main><Outlet /></main>

            <footer className="main-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-info">
                            <img src="/Fotos/logo.webp" alt="Club Center Fight Academy" className="footer-logo" width="192" height="181" loading="lazy" decoding="async" />
                            <p>Tu camino hacia la excelencia en artes marciales. Formamos campeones dentro y fuera del tatami.</p>
                            <div className="social-links">
                                <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" aria-label="Instagram"><Icono n="instagram" /></a>
                            </div>
                        </div>
                        <div className="footer-links">
                            <h3>Páginas</h3>
                            <ul>
                                {nav.slice(1).map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}
                            </ul>
                        </div>
                        <div className="footer-contact">
                            <h3>Contacto</h3>
                            <p><Icono n="mapa" /> {DIRECCION}</p>
                            <p><Icono n="phone" /> {TELEFONO}</p>
                            <p><Icono n="envelope" /> {EMAIL}</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Club Center Fight Academy. Todos los derechos reservados. <Link to="/privacidad">Política de privacidad</Link></p>
                    </div>
                </div>
            </footer>

            <a href={wa('Hola, quiero consultar sobre las clases')} className="chatbot-floating-btn" target="_blank" rel="noopener" data-lugar="flotante" aria-label="Contactar por WhatsApp">
                <Icono n="whatsapp" />
            </a>

            <button id="btn-up" className={arriba ? 'visible' : ''} aria-label="Ir arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Icono n="arrow-up" />
            </button>
        </>
    );
}
