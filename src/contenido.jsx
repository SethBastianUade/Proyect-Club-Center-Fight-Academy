import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Contenido editable desde el panel (planes, clases, eventos, competidores), guardado en D1.
// En producción el Worker lo inserta en el HTML como window.__CONTENIDO__, así la página arranca con los datos.
// Si no está (vite dev, o falló la base), se pide a /api/contenido.
const VACIO = { planes: [], clases: [], eventos: [], competidores: [] };

// "12-3-1" → { g: 12, p: 3, e: 1 }
const record = (r) => {
    const m = r?.match(/^(\d+)\s*-\s*(\d+)(?:\s*-\s*(\d+))?$/);
    return m ? { g: +m[1], p: +m[2], e: +(m[3] ?? 0) } : null;
};

const normalizar = (c) => ({
    planes: c.planes.map((p) => ({ ...p, items: { actividades: p.actividades, dias: p.dias, clases: p.clases, prueba: true } })),
    clases: c.clases,
    eventos: c.eventos,
    competidores: c.competidores.map((p) => ({
        ...p,
        record: record(p.record),
        logros: p.logros?.split('\n').map((l) => l.trim()).filter(Boolean) ?? [],
    })),
});

const inicial = window.__CONTENIDO__;
const Ctx = createContext({ ...VACIO, cargando: true, recargar: () => {} });

export function ContenidoProvider({ children }) {
    const [datos, setDatos] = useState(() => (inicial ? normalizar(inicial) : null));

    const recargar = useCallback(() => fetch('/api/contenido')
        .then((r) => r.json())
        .then((d) => setDatos(normalizar(d)))
        .catch(() => setDatos((d) => d ?? VACIO)), []);
    useEffect(() => { if (!inicial) recargar(); }, [recargar]);

    return <Ctx.Provider value={{ ...(datos ?? VACIO), cargando: !datos, recargar }}>{children}</Ctx.Provider>;
}

export const useContenido = () => useContext(Ctx);
