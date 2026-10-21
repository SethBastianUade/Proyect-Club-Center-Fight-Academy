-- Clics en botones de WhatsApp, sumados por día, página y lugar. Anónimos: no se guarda quién hizo clic.
CREATE TABLE clics (
    dia TEXT NOT NULL,         -- AAAA-MM-DD, hora de Argentina
    pagina TEXT NOT NULL,      -- ruta: /, /horarios, /precios...
    lugar TEXT NOT NULL,       -- dónde estaba el botón: hero, clase, barra... (LUGARES en worker/metricas.js)
    n INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (dia, pagina, lugar)
);
