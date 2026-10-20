// Íconos de Font Awesome como SVG inline: solo se bundlean los que están acá (antes era todo el CSS del CDN)
import {
    faArrowLeft, faArrowRight, faArrowUp, faBars, faBolt, faCheck, faEnvelope, faHandshake,
    faHeart, faLocationDot, faMinus, faPhone, faShareNodes, faTrophy, faUsers, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const ICONOS = {
    'arrow-left': faArrowLeft, 'arrow-right': faArrowRight, 'arrow-up': faArrowUp, bars: faBars, bolt: faBolt,
    calendar: faCalendar, check: faCheck, clock: faClock, envelope: faEnvelope,
    google: faGoogle, handshake: faHandshake, heart: faHeart, instagram: faInstagram, mapa: faLocationDot,
    minus: faMinus, phone: faPhone, share: faShareNodes, trophy: faTrophy, users: faUsers,
    whatsapp: faWhatsapp, xmark: faXmark,
};

// Decorativo por defecto; con `label` se anuncia como imagen
export default function Icono({ n, label, className = '' }) {
    const [w, h, , , d] = ICONOS[n].icon;
    return (
        <svg
            className={`icono ${className}`} viewBox={`0 0 ${w} ${h}`} focusable="false"
            {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
        >
            <path fill="currentColor" d={d} />
        </svg>
    );
}
