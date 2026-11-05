ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitacoras_atencion ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_medico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso libre a clientes" ON clientes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acceso libre a pacientes" ON pacientes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acceso libre a bitacoras" ON bitacoras_atencion
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acceso libre a personal medico" ON personal_medico
    FOR ALL USING (true) WITH CHECK (true);

DROP TABLE IF EXISTS bitacoras_atencion CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT
);

CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    sexo VARCHAR(20),
    peso_edad VARCHAR(50)
);

CREATE TABLE bitacoras_atencion (
    id SERIAL PRIMARY KEY,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'America/Mexico_City'),
    medico_id VARCHAR(64) REFERENCES personal_medico(id),
    paciente_id INTEGER REFERENCES pacientes(id) ON DELETE CASCADE,
    motivo_consulta TEXT NOT NULL,
    temperatura VARCHAR(20),
    frecuencia_cardiaca VARCHAR(20),
    frecuencia_respiratoria VARCHAR(20),
    farmacos TEXT,
    notas TEXT
);

CREATE TABLE personal_medico (
    id VARCHAR(64) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL
);