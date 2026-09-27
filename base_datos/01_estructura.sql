-- 01_estructura.sql
CREATE DATABASE IF NOT EXISTS utvam_emergencias_vet
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE utvam_emergencias_vet;

 
CREATE TABLE IF NOT EXISTS propietarios (
    id_propietario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    telefono_contacto VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

 
CREATE TABLE IF NOT EXISTS empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    rol_sistema VARCHAR(30) NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

 
CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    id_propietario INT NOT NULL,
    nombre_mascota VARCHAR(50) NOT NULL,
    especie VARCHAR(30) NOT NULL,
    raza VARCHAR(30),
    CONSTRAINT fk_pacientes_propietarios FOREIGN KEY (id_propietario)
        REFERENCES propietarios(id_propietario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

 
CREATE TABLE IF NOT EXISTS triaje_ingresos (
    id_ingreso INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_empleado INT NOT NULL,
    fecha_hora_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    frecuencia_cardiaca INT,
    nivel_prioridad VARCHAR(15) NOT NULL,
    motivo_urgencia TEXT NOT NULL,
    CONSTRAINT fk_triaje_pacientes FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_triaje_empleados FOREIGN KEY (id_empleado)
        REFERENCES empleados(id_empleado)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

 
CREATE TABLE IF NOT EXISTS espacios_clinicos (
    id_espacio INT AUTO_INCREMENT PRIMARY KEY,
    id_ingreso_actual INT,
    nombre_area VARCHAR(50) NOT NULL,
    estatus_actual VARCHAR(20) NOT NULL DEFAULT 'Disponible',
    CONSTRAINT fk_espacios_triaje FOREIGN KEY (id_ingreso_actual)
        REFERENCES triaje_ingresos(id_ingreso)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;