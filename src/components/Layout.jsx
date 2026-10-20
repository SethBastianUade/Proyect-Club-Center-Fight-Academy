import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
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
    const [cookies, setCookies] = useState(false);

    useEffect(() => {
        setMenu(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = menu ? 'hidden' : '';
    }, [menu]);

    useEffect(() => {
        const onScroll = () => setArriba(window.scrollY > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        let t;
        try {
            if (!localStorage.getItem('cookiesAccepted')) t = setTimeout(() => setCookies(true), 2000);
        } catch { /* storage bloqueado: no mostramos el aviso */ }
        return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
    }, []);

    const aceptarCookies = () => {
        try { localStorage.setItem('cookiesAccepted', 'true'); } catch { /* sin storage */ }
        setCookies(false);
    };

    return (
        <>
            <header className="main-header">
                <div className="header-container">
                    <div className="logo-container">
                        <Link to="/" className="logo-link">
                            <img src="/Fotos/logoClub.png" alt="Club Center Fight Academy" className="main-logo" width="542" height="510" />
                        </Link>
                    </div>
                    <nav className="main-nav">
                        <ul className={`nav-links${menu ? ' active' : ''}`} id="nav-links">
                            {NAV.map(([to, label]) => (
                                <li key={to}><NavLink to={to} end={to === '/'}>{label}</NavLink></li>
                            ))}
                        </ul>
                        <button
                            className={`mobile-menu-btn${menu ? ' active' : ''}`}
                            aria-label="Menú" aria-expanded={menu} aria-controls="nav-links"
                            onClick={() => setMenu(!menu)}
                        >
                            <span></span><span></span><span></span>
                        </button>
                    </nav>
                    <div className="header-cta">
                        <a href={INSCRIBITE} className="btn-whatsapp" target="_blank" rel="noopener">
                            <i className="fab fa-whatsapp"></i> ¡Inscribite ahora!
                        </a>
                    </div>
                </div>
            </header>

            <div className="mobile-whatsapp-bar">
                <a href={INSCRIBITE} className="btn-whatsapp" target="_blank" rel="noopener">
                    <i className="fab fa-whatsapp"></i> ¡Inscribite ahora!
                </a>
            </div>

            <main><Outlet /></main>

            <footer className="main-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-info">
                            <img src="/Fotos/logoClub.png" alt="Club Center Fight Academy" className="footer-logo" width="542" height="510" loading="lazy" decoding="async" />
                            <p>Tu camino hacia la excelencia en artes marciales. Formamos campeones dentro y fuera del tatami.</p>
                            <div className="social-links">
                                <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
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
                            <p><i className="fas fa-map-marker-alt"></i> {DIRECCION}</p>
                            <p><i className="fas fa-phone"></i> {TELEFONO}</p>
                            <p><i className="fas fa-envelope"></i> {EMAIL}</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Club Center Fight Academy. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>

            <a href={wa('Hola, quiero consultar sobre las clases')} className="chatbot-floating-btn" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
                <i className="fab fa-whatsapp"></i>
            </a>

            <button id="btn-up" className={arriba ? 'visible' : ''} aria-label="Ir arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <i className="fas fa-arrow-up"></i>
            </button>

            {cookies && (
                <div id="cookie-bar">
                    Usamos cookies para mejorar tu experiencia.
                    <button id="accept-cookies" onClick={aceptarCookies}>Aceptar</button>
                </div>
            )}
        </>
    );
}
