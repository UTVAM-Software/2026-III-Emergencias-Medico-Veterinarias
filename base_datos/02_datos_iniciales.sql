-- 02_datos_iniciales.sql
USE utvam_emergencias_vet;

 
INSERT INTO empleados (nombre_completo, rol_sistema, contrasena_hash) VALUES
('Jessica Ramirez', 'Administrador', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe...'),
('DR. Jose Guerrero', 'Veterinario', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe...');

-- 2. Datos iniciales de Espacios Clínicos (Áreas de trabajo)
INSERT INTO espacios_clinicos (nombre_area, estatus_actual) VALUES
('Quirófano 1', 'Disponible'),
('Área de Triaje A', 'Disponible'),
('Consultorio de Urgencias', 'Disponible'),
('Hospitalización 1', 'Disponible');

-- 3. Datos de prueba: Propietario, Paciente e Ingreso inicial
INSERT INTO propietarios (nombre_completo, telefono_contacto) VALUES
('Juan Pérez Gómez', '7711234567');

INSERT INTO pacientes (id_propietario, nombre_mascota, especie, raza) VALUES
(1, 'Firulais', 'Perro', 'Labrador');

INSERT INTO triaje_ingresos (id_paciente, id_empleado, frecuencia_cardiaca, nivel_prioridad, motivo_urgencia) VALUES
(1, 2, 110, 'Alta', 'Presenta dificultad respiratoria severa');