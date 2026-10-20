-- Intentos fallidos de login al panel, para bloquear por IP a quien prueba contraseñas
CREATE TABLE login_fallidos (
    ip TEXT NOT NULL,
    creado INTEGER NOT NULL -- epoch en ms
);

CREATE INDEX login_fallidos_ip ON login_fallidos (ip, creado);
