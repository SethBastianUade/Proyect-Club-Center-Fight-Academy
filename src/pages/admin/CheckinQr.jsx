import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { api } from './api.js';

// QR de recepción para el check-in de socios (plan.md). Se imprime y se pega en recepción.
// Con BiFrost real el QR se genera e imprime desde BiFrost (Abonos y actividades → Check-in desde la web).
// Acá solo queda el de prueba, con el código CHECKIN_CODIGO del modo simulado.
export default function CheckinQr({ onError }) {
    const [info, setInfo] = useState(null);
    const [svg, setSvg] = useState(null);

    useEffect(() => {
        api('checkin').then(async (i) => {
            setInfo(i);
            if (i.url) setSvg(await QRCode.toString(i.url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' }));
        }).catch(onError);
    }, [onError]);

    if (!info) return <p className="empty">Cargando…</p>;

    return (
        <>
            <div className="checkin-qr-estado">
                {!info.disponible && (
                    <p className="admin-error">
                        El check-in todavía no está activo: falta conectar BiFrost (BIFROST_URL y el secret BIFROST_TOKEN). Ver <code>plan.md</code>.
                    </p>
                )}
                {info.modo === 'simulado' && <p className="admin-error">Modo de prueba: BiFrost simulado. No usar con socios reales.</p>}
                {info.modo === 'real' && <p>El QR de recepción se imprime desde BiFrost: <strong>Abonos y actividades → Check-in desde la web</strong>.</p>}
            </div>

            {svg && (
                <div className="qr-imprimible">
                    <h2>Check-in</h2>
                    <p>Escaneá con la cámara del celular</p>
                    <div className="qr-codigo" dangerouslySetInnerHTML={{ __html: svg }} />
                    <p className="qr-pie">Club Center Fight Academy</p>
                </div>
            )}
            {svg && (
                <div className="editor-acciones checkin-qr-acciones">
                    <button className="btn btn-primary" onClick={() => window.print()}>Imprimir QR</button>
                    <a className="chip" href={info.url} target="_blank" rel="noopener">Probar el link</a>
                </div>
            )}
        </>
    );
}
