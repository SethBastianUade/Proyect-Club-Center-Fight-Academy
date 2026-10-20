import { Link } from 'react-router';
import { wa, TELEFONO, DIRECCION, EMAIL, INSTAGRAM } from '../data/site.js';
import { Hero, SectionHeader, useMeta } from '../components/ui.jsx';

export default function Contacto() {
    useMeta('Contacto', 'Contactá a Club Center Fight Academy en Solis 1213, CABA. Escribinos por WhatsApp para consultas y clases de prueba.');

    const enviar = (e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const texto = `Hola! Mi nombre es ${f.nombre.value.trim()}. Quiero consultar: ${f.mensaje.value.trim()}`;
        window.open(wa(texto), '_blank');
    };

    return (
        <>
            <Hero badge="Estamos para ayudarte" titulo="Ponete en" resaltado="contacto" subtitulo="Consultá horarios, precios o escribinos para agendar tu primera clase" fondo="hero-contacto" />

            <section className="contact-main-section">
                <div className="contact-container">
                    <div className="contact-info">
                        <h2>Datos de contacto</h2>
                        <ul className="contact-list">
                            <li><i className="fas fa-map-marker-alt"></i> <span>Dirección: <b>{DIRECCION}</b></span></li>
                            <li><i className="fas fa-envelope"></i> <span>Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></span></li>
                            <li><i className="fab fa-instagram"></i> <span>Instagram: <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">@{INSTAGRAM}</a></span></li>
                            <li><i className="fab fa-whatsapp"></i> <span>WhatsApp: <a href={wa()} target="_blank" rel="noopener">{TELEFONO}</a></span></li>
                            <li><i className="far fa-clock"></i> <span>Horarios: <Link to="/horarios">ver grilla de clases</Link></span></li>
                        </ul>
                    </div>
                    <div className="contact-form-box">
                        <h2>Envianos tu consulta</h2>
                        <form className="contact-form" onSubmit={enviar}>
                            <input type="text" name="nombre" placeholder="Tu nombre" aria-label="Tu nombre" required />
                            <textarea name="mensaje" placeholder="¿En qué podemos ayudarte?" aria-label="Tu consulta" required></textarea>
                            <button type="submit" className="btn btn-primary"><i className="fab fa-whatsapp"></i> Enviar por WhatsApp</button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="map-section">
                <SectionHeader label="Ubicación" titulo="¿Dónde estamos?" texto={`Encontranos fácilmente en ${DIRECCION}`} />
                <div className="map-box">
                    <iframe
                        src="https://maps.google.com/maps?width=100%&height=100%&hl=es&q=Solis+1213,+CABA,+Argentina&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                        title="Mapa de ubicación Club Center Fight Academy" loading="lazy" allowFullScreen
                    ></iframe>
                </div>
            </section>
        </>
    );
}
