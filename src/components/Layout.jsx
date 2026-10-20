import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import Icono from './Icono.jsx';
import { wa, TELEFONO, DIRECCION, EMAIL, INSTAGRAM } from '../data/site.js';

const NAV = [
    ['/', 'Inicio'],
    ['/disciplinas', 'Disciplinas'],
    ['/horarios', 'Horarios'],
    ['/precios', 'Precios'],
    ['/eventos', 'Eventos'],
    ['/nosotros', 'Nosotros'],
    ['/contacto', 'Contacto'],
];

const INSCRIBITE = wa('Hola, quiero hacer una clase de prueba');

export default function Layout() {
    const { pathname } = useLocation();
    const [menu, setMenu] = useState(false);
    const [arriba, setArriba] = useState(false);

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

    useEffect(() => {
        const onScroll = () => { setArriba(window.scrollY > 300); };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header className="site-header">
                <div className="header-inner">
                    <Link to="/" className="brand" aria-label="Club Center Fight Academy, inicio">
                        <img src="/Fotos/logoClub.png" alt="" width="542" height="510" />
                    </Link>
                    <nav className={`nav-pill${menu ? " open" : ""}`} id="nav-menu" aria-label="Principal">
                        <ul>
                            {NAV.map(([to, label]) => (
                                <li key={to}><NavLink to={to} end={to === "/"}>{label}</NavLink></li>
                            ))}
                        </ul>
                        <a href={INSCRIBITE} className="nav-cta" target="_blank" rel="noopener">
                            Inscribite <Icono n="arrow-right" />
                        </a>
                    </nav>
                    <button
                        className="menu-btn" aria-label={menu ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={menu} aria-controls="nav-menu" onClick={() => setMenu(!menu)}
                    >
                        <Icono n={menu ? "xmark" : "bars"} />
                    </button>
                </div>
            </header>

            <a href={INSCRIBITE} className="mobile-cta" target="_blank" rel="noopener">
                <Icono n="whatsapp" /> Reservar clase de prueba gratis
            </a>

            <main><Outlet /></main>

            <footer className="main-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-info">
                            <img src="/Fotos/logoClub.png" alt="Club Center Fight Academy" className="footer-logo" width="542" height="510" loading="lazy" decoding="async" />
                            <p>Tu camino hacia la excelencia en artes marciales. Formamos campeones dentro y fuera del tatami.</p>
                            <div className="social-links">
                                <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" aria-label="Instagram"><Icono n="instagram" /></a>
                            </div>
                        </div>
                        <div className="footer-links">
                            <h3>Páginas</h3>
                            <ul>
                                {NAV.slice(1).map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}
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
                        <p>&copy; {new Date().getFullYear()} Club Center Fight Academy. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>

            <a href={wa('Hola, quiero consultar sobre las clases')} className="chatbot-floating-btn" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
                <Icono n="whatsapp" />
            </a>

            <button id="btn-up" className={arriba ? 'visible' : ''} aria-label="Ir arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Icono n="arrow-up" />
            </button>
        </>
    );
}
