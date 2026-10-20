-- Interesados que completan el formulario de inscripción
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creado TEXT NOT NULL DEFAULT (datetime('now')),
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT,
    disciplina TEXT,
    plan TEXT,
    estado TEXT NOT NULL DEFAULT 'nuevo'
        CHECK (estado IN ('nuevo', 'contactado', 'prueba', 'inscripto', 'descartado')),
    notas TEXT,
    actualizado TEXT
);

CREATE INDEX leads_creado ON leads (creado DESC);
