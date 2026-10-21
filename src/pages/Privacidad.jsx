import { DIRECCION, EMAIL } from '../data/site.js';
import { MARCA } from '../data/paginas.js';
import { usePagina } from '../components/ui.jsx';

// Texto base según la Ley 25.326 de Protección de Datos Personales. Si se suman datos nuevos
// (ej. login de socios, ver plan.md), hay que actualizarlo.
export default function Privacidad() {
    usePagina('/privacidad');
    return (
        <section className="legal">
            <span className="section-label">Legal</span>
            <h1>Política de privacidad</h1>
            <p className="legal-fecha">Última actualización: octubre de 2026</p>

            <h2>Quién es responsable de tus datos</h2>
            <p>{MARCA}, con domicilio en {DIRECCION}. Contacto: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>

            <h2>Qué datos guardamos</h2>
            <ul>
                <li><b>Formulario de inscripción:</b> nombre, teléfono, email (opcional), disciplina y plan que elegiste.</li>
                <li><b>Uso del sitio:</b> cantidad de visitas y de clics en los botones de WhatsApp, de forma anónima y sin cookies. No sabemos quién hizo cada clic.</li>
            </ul>
            <p>Los mensajes que nos mandás por WhatsApp quedan en WhatsApp y se rigen por sus propias políticas.</p>

            <h2>Para qué los usamos</h2>
            <p>Solo para contactarte por tu consulta o inscripción y para mejorar el sitio. No vendemos ni compartimos tus datos con terceros con fines comerciales.</p>

            <h2>Dónde se guardan y por cuánto tiempo</h2>
            <p>En los servidores de Cloudflare, que alojan este sitio. Los conservamos mientras sean útiles para el fin por el que los diste; podés pedir que los borremos en cualquier momento.</p>

            <h2>Tus derechos</h2>
            <p>
                Podés pedir acceso, corrección o eliminación de tus datos escribiendo a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                Te respondemos dentro de los plazos de la Ley 25.326: 10 días corridos para el acceso y 5 días hábiles para la corrección o eliminación.
            </p>
            <p>
                La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la
                atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por
                incumplimiento de las normas vigentes en materia de protección de datos personales.
            </p>
        </section>
    );
}
