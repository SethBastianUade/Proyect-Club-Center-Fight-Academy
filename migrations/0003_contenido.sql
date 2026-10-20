-- Contenido editable desde el panel (antes vivía en src/data/). Arranca con los datos que había en el sitio.

CREATE TABLE planes (
    id TEXT PRIMARY KEY,
    orden INTEGER NOT NULL DEFAULT 0,
    nombre TEXT NOT NULL,
    precio INTEGER,            -- NULL = "Consultar"
    destacado TEXT,            -- texto de la etiqueta, ej. "Más completo"
    actividades TEXT,
    dias TEXT,
    clases TEXT
);

CREATE TABLE clases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia TEXT NOT NULL CHECK (dia IN ('lun', 'mar', 'mie', 'jue', 'vie', 'sab')),
    desde TEXT NOT NULL,       -- HH:MM
    hasta TEXT NOT NULL,
    disc TEXT NOT NULL,        -- clave de src/data/disciplinas.js
    nombre TEXT                -- opcional, pisa el nombre de la disciplina
);

CREATE TABLE eventos (
    slug TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('torneo', 'seminario', 'examen')),
    fecha TEXT NOT NULL,       -- AAAA-MM-DD
    hora TEXT,
    lugar TEXT,
    resumen TEXT,
    texto TEXT,
    foto TEXT                  -- flyer: /api/fotos/:id
);

CREATE TABLE competidores (
    slug TEXT PRIMARY KEY,
    orden INTEGER NOT NULL DEFAULT 0,
    nombre TEXT NOT NULL,
    disciplina TEXT NOT NULL,
    foto TEXT,
    w INTEGER,                 -- tamaño de la foto, para reservar el espacio al cargar
    h INTEGER,
    bio TEXT,
    record TEXT,               -- "G-P-E", ej. "12-3-1"
    logros TEXT                -- uno por línea
);

-- Fotos subidas desde el panel. Se sirven en /api/fotos/:id
CREATE TABLE fotos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    datos BLOB NOT NULL,
    creado TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO planes (id, orden, nombre, precio, destacado, actividades, dias, clases) VALUES
    ('mar-jue', 1, 'Martes y jueves', 62900, NULL, '1 actividad', 'Martes y jueves', '8 clases por mes'),
    ('lun-mie-vie', 2, 'Lunes, miércoles y viernes', 69900, NULL, '1 actividad', 'Lunes, miércoles y viernes', '12 clases por mes'),
    ('una-actividad', 3, 'Una actividad', 74900, NULL, '1 actividad', 'Lunes a viernes', 'Clases libres'),
    ('dos-actividades', 4, 'Dos actividades', 79900, NULL, '2 actividades, combiná como quieras', 'Pase libre', 'Clases libres'),
    ('pase-libre-total', 5, 'Pase libre total', 84900, 'Más completo', 'Todas las actividades', 'Pase libre', 'Clases libres');

INSERT INTO clases (dia, desde, hasta, disc, nombre) VALUES
    ('lun', '09:30', '10:30', 'muaythai', NULL),
    ('mie', '09:30', '10:30', 'muaythai', NULL),
    ('vie', '09:30', '10:30', 'muaythai', NULL),
    ('sab', '11:00', '12:00', 'sparring', 'Sparring Muay Thai / Boxeo'),
    ('sab', '12:00', '14:00', 'sparring', 'Sparring Jiu-Jitsu'),
    ('lun', '13:00', '14:00', 'boxeo', NULL),
    ('mie', '13:00', '14:00', 'boxeo', NULL),
    ('vie', '13:00', '14:00', 'boxeo', NULL),
    ('mar', '15:00', '16:00', 'boxeo', NULL),
    ('jue', '15:00', '16:00', 'boxeo', NULL),
    ('mar', '16:00', '17:00', 'grappling', NULL),
    ('jue', '16:00', '17:00', 'grappling', NULL),
    ('lun', '16:30', '18:00', 'bjj', NULL),
    ('mie', '16:30', '18:00', 'bjj', NULL),
    ('vie', '16:30', '18:00', 'bjj', NULL),
    ('mar', '17:00', '18:00', 'mma', NULL),
    ('jue', '17:00', '18:00', 'mma', NULL),
    ('lun', '18:00', '19:00', 'boxeo', NULL),
    ('mar', '18:00', '19:00', 'muaythai', NULL),
    ('mie', '18:00', '19:00', 'boxeo', NULL),
    ('jue', '18:00', '19:00', 'muaythai', NULL),
    ('vie', '18:00', '19:00', 'boxeo', NULL),
    ('lun', '19:00', '20:00', 'muaythai', NULL),
    ('mar', '19:00', '20:00', 'boxeo', NULL),
    ('mie', '19:00', '20:00', 'muaythai', NULL),
    ('jue', '19:00', '20:00', 'boxeo', NULL),
    ('vie', '19:00', '20:00', 'muaythai', NULL),
    ('lun', '20:00', '21:00', 'mma', NULL),
    ('mar', '20:00', '21:00', 'muaythai', NULL),
    ('mie', '20:00', '21:00', 'mma', NULL),
    ('jue', '20:00', '21:00', 'muaythai', NULL),
    ('vie', '20:00', '21:00', 'mma', NULL),
    ('lun', '21:00', '22:00', 'boxeo', NULL),
    ('mie', '21:00', '22:00', 'boxeo', NULL),
    ('vie', '21:00', '22:00', 'boxeo', NULL);

INSERT INTO competidores (slug, orden, nombre, disciplina, foto, w, h) VALUES
    ('sebastian-arroyo', 1, 'Sebastián Arroyo', 'Jiu-Jitsu', '/Fotos/competidores/competidor1.webp', 600, 552),
    ('gaston-campos', 2, 'Gaston Campos', 'Kick-Boxing', '/Fotos/competidores/competidor2.webp', 600, 974),
    ('elian-rogelio', 3, 'Elian Rogelio', 'MMA', '/Fotos/competidores/competidor3.webp', 600, 622),
    ('matias', 4, 'Matias', 'Kick-Boxing', '/Fotos/competidores/competidor4.webp', 600, 400);
