import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { api } from './api.js';

// QR de recepción para el check-in de socios (plan.md). Se imprime y se pega en recepción.
// El link lleva el código secreto CHECKIN_CODIGO: si se filtra, se cambia el secret y se reimprime.
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
                        El check-in todavía no está activo: falta {!info.url ? 'cargar el código del QR (secret CHECKIN_CODIGO)' : 'conectar BiFrost'}.
                        Ver <code>plan.md</code>.
                    </p>
                )}
                {info.modo === 'simulado' && <p className="admin-error">Modo de prueba: BiFrost simulado. No usar con socios reales.</p>}
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
