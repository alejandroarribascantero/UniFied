DROP DATABASE IF EXISTS UniFied;
CREATE DATABASE UniFied;
USE UniFied;

CREATE TABLE TIPO_PERSONALIDAD (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(50),
    CODIGO_MBTI CHAR(4),
    ROL VARCHAR(50),
    ESTRATEGIA VARCHAR(50),
    DESCRIPCION TEXT,
    FOTO VARCHAR(500) DEFAULT 'assets/personalidad/default.jpg'
);

CREATE TABLE FACULTAD (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE USUARIO(
	ID INT AUTO_INCREMENT PRIMARY KEY,
    CORREO VARCHAR(255) NOT NULL,
    CONTRASENA VARCHAR(255) NOT NULL,
    NOMBRE VARCHAR(255) NOT NULL,
    APELLIDO1 VARCHAR(255) NOT NULL,
    APELLIDO2 VARCHAR(255),
    FACULTAD_ID INT  NOT NULL,
    CURSO NUMERIC(2)  NOT NULL,
    FECHA_NACIMIENTO DATE NOT NULL,
    IMAGEN_PERFIL VARCHAR(500) DEFAULT 'assets/perfiles/default.jpg',
    TIPO_PERSONALIDAD_ID INT,
    FOREIGN KEY (TIPO_PERSONALIDAD_ID) REFERENCES TIPO_PERSONALIDAD(ID),
    FOREIGN KEY (FACULTAD_ID) REFERENCES FACULTAD(ID)
);

CREATE TABLE PREGUNTAS (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PREGUNTA VARCHAR(200) NOT NULL,
    OPCION_A VARCHAR(200) NOT NULL,
    OPCION_B VARCHAR(200) NOT NULL,
    OPCION_C VARCHAR(200) NOT NULL,
    OPCION_D VARCHAR(200) NOT NULL,
    PERSONALIDAD_A INT NOT NULL,
    PERSONALIDAD_B INT NOT NULL,
    PERSONALIDAD_C INT NOT NULL,
    PERSONALIDAD_D INT NOT NULL,
    FOREIGN KEY (PERSONALIDAD_A) REFERENCES TIPO_PERSONALIDAD(ID),
    FOREIGN KEY (PERSONALIDAD_B) REFERENCES TIPO_PERSONALIDAD(ID),
    FOREIGN KEY (PERSONALIDAD_C) REFERENCES TIPO_PERSONALIDAD(ID),
    FOREIGN KEY (PERSONALIDAD_D) REFERENCES TIPO_PERSONALIDAD(ID)
);
CREATE TABLE RESPUESTAS_TEST (
    ID INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único de cada respuesta
    USUARIO_ID INT NOT NULL,           -- Referencia al usuario que respondió
    PREGUNTA_ID INT NOT NULL,          -- Referencia a la pregunta respondida
    OPCION_ELEGIDA CHAR(1) NOT NULL,   -- Opción elegida: 'A', 'B', 'C' o 'D'
    FECHA_RESPUESTA DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de la respuesta

    -- Claves foráneas para mantener integridad referencial
    FOREIGN KEY (USUARIO_ID) REFERENCES USUARIO(ID),
    FOREIGN KEY (PREGUNTA_ID) REFERENCES PREGUNTAS(ID),

    -- Restricción para asegurar que la opción sea válida
    CHECK (OPCION_ELEGIDA IN ('A', 'B', 'C', 'D'))
);
CREATE TABLE CONEXIONES_USUARIO (
    ID INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único
    USUARIO_ID_1 INT NOT NULL,         -- ID menor (por convención)
    USUARIO_ID_2 INT NOT NULL,         -- ID mayor (por convención)
    ESTADO ENUM('pendiente', 'aceptada', 'rechazada', 'bloqueada') DEFAULT 'pendiente', -- Estado de la conexión
    FECHA_SOLICITUD DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Claves foráneas
    FOREIGN KEY (USUARIO_ID_1) REFERENCES USUARIO(ID),
    FOREIGN KEY (USUARIO_ID_2) REFERENCES USUARIO(ID),

    -- Restringir duplicados (ej: A-B o B-A, pero no ambos)
    UNIQUE (USUARIO_ID_1, USUARIO_ID_2),

    -- Evitar que un usuario se conecte consigo mismo
    CHECK (USUARIO_ID_1 < USUARIO_ID_2)
);


INSERT INTO TIPO_PERSONALIDAD (NOMBRE, CODIGO_MBTI, ROL, ESTRATEGIA, DESCRIPCION, FOTO) VALUES
('Abogado', 'INFJ', 'Diplomático', 'Confianza constante', 'Idealistas callados y misteriosos, pero muy inspiradores e incansables.', 'abogado.svg'),
('Mediador', 'INFP', 'Diplomático', 'Confianza constante', 'Poéticos, amables y altruistas, siempre dispuestos a ayudar a una buena causa.', 'mediador.svg'),
('Protagonista', 'ENFJ', 'Diplomático', 'Confianza constante', 'Líderes carismáticos e inspiradores, capaces de cautivar a quien los escuche.', 'protagonista.svg'),
('Activista', 'ENFP', 'Diplomático', 'Social y espontánea', 'Espíritus libres entusiastas, creativos y sociables, que siempre pueden encontrar una razón para sonreír.', 'activista.svg'),
('Logista', 'ISTJ', 'Centinela', 'Confianza constante', 'Prácticos y centrados en los hechos, cuya fiabilidad no tiene comparación.', 'logista.svg'),
('Defensor', 'ISFJ', 'Centinela', 'Confianza constante', 'Protectores dedicados y cálidos, siempre listos para defender a sus seres queridos.', 'defensor.svg'),
('Ejecutivo', 'ESTJ', 'Centinela', 'Confianza constante', 'Excelentes administradores, inigualables a la hora de gestionar cosas – o personas.', 'ejecutivo.svg'),
('Consul', 'ESFJ', 'Centinela', 'Popularidad social', 'Personas extraordinariamente sociables, comprometidas con el deber y siempre dispuestas a ayudar.', 'consul.svg'),
('Virtuoso', 'ISTP', 'Explorador', 'Mejora constante', 'Experimentadores prácticos y valientes, maestros en el uso de todo tipo de herramientas.', 'virtuoso.svg'),
('Aventurero', 'ISFP', 'Explorador', 'Mejora constante', 'Artistas flexibles y encantadores, siempre dispuestos a explorar y a experimentar algo nuevo.', 'aventurero.svg'),
('Emprendedor', 'ESTP', 'Explorador', 'Mejora constante', 'Personas inteligentes, enérgicas y muy perceptivas, que realmente disfrutan vivir al límite.', 'emprendedor.svg'),
('Animador', 'ESFP', 'Explorador', 'Social y espontánea', 'Animadores espontáneos, enérgicos y entusiastas – la vida nunca es aburrida a su lado.', 'animador.svg'),
('Arquitecto', 'INTJ', 'Analista', 'Mejora constante', 'Pensadores estratégicos e imaginativos con un plan para todo.', 'arquitecto.svg'),
('Logico', 'INTP', 'Analista', 'Mejora constante', 'Inventores innovadores con una sed insaciable de conocimiento.', 'logico.svg'),
('Comandante', 'ENTJ', 'Analista', 'Mejora constante', 'Líderes audaces, imaginativos y de voluntad fuerte, siempre en busca del camino – o creándolo.', 'comandante.svg'),
('Innovador', 'ENTP', 'Analista', 'Social y espontánea', 'Pensadores inteligentes y curiosos que no pueden resistirse a un desafío intelectual.', 'innovador.svg');


INSERT INTO PREGUNTAS (
    PREGUNTA, OPCION_A, OPCION_B, OPCION_C, OPCION_D,
    PERSONALIDAD_A, PERSONALIDAD_B, PERSONALIDAD_C, PERSONALIDAD_D
) VALUES
('¿Cómo prefieres pasar un fin de semana?', 'Reflexionando o leyendo en casa', 'Escuchar y dar apoyo emocional', 'Buscar soluciones creativas', 'Organizar y ejecutar planes', 9, 15, 3, 10),
('¿Qué valoras más en una amistad?', 'Lealtad y confianza', 'Empatía y comprensión', 'Diversión y aventura', 'Apoyo práctico constante', 4, 10, 3, 14),
('¿Cómo manejas un conflicto?', 'Dialogando con calma', 'Evito el conflicto', 'Lo enfrento directamente', 'Analizo pros y contras antes de actuar', 4, 1, 9, 3),
('¿Qué te motiva en el trabajo?', 'Lograr resultados concretos', 'Ayudar a otros', 'Explorar nuevas ideas', 'Resolver problemas complejos', 1, 3, 4, 12),
('¿Cuál es tu enfoque al resolver problemas?', 'Paso a paso con lógica', 'Con intuición y empatía', 'Probando cosas diferentes', 'Siguiendo un plan estructurado', 8, 15, 16, 5),
('¿Cómo prefieres comunicarte?', 'Directamente y con firmeza', 'De forma emocional y cercana', 'Con humor y ligereza', 'De manera analítica', 11, 6, 12, 13),
('¿Qué te hace sentir realizado?', 'Lograr metas personales', 'Inspirar a otros', 'Tener paz interior', 'Crear cosas nuevas', 5, 2, 1, 16),
('¿Qué harías en una reunión social?', 'Observar primero, hablar luego', 'Romper el hielo con bromas', 'Ayudar si alguien lo necesita', 'Hablar solo si es necesario', 7, 12, 6, 14),
('¿Cómo te preparas para un proyecto?', 'Organizo y planifico todo', 'Improviso según lo que surja', 'Analizo profundamente', 'Trabajo en equipo desde el inicio', 10, 4, 14, 7),
('¿Cuál es tu debilidad más común?', 'Evitar conflictos', 'Ser muy perfeccionista', 'Tomar decisiones impulsivas', 'Ser demasiado crítico', 2, 13, 3, 14),
('¿Qué estilo de liderazgo prefieres?', 'Inspirador y motivador', 'Estructurado y claro', 'Flexible y empático', 'Intelectual y visionario', 3, 10, 2, 13),
('¿Qué te molesta más?', 'La falta de lógica', 'La injusticia', 'El desorden', 'La rutina', 13, 1, 10, 8),
('¿Cómo sueles tomar decisiones?', 'Con base en hechos', 'Siguiendo tu intuición', 'Analizando emociones propias y ajenas', 'Buscando equilibrio', 5, 15, 2, 16),
('¿Qué disfrutas más?', 'Estudiar y aprender', 'Ayudar a resolver conflictos', 'Conocer gente nueva', 'Organizar actividades', 13, 1, 12, 7),
('¿Qué rol sueles tener en grupo?', 'Coordinador lógico', 'Motivador emocional', 'Observador estratégico', 'Actor principal', 5, 2, 9, 11),
('¿Qué prefieres en una discusión?', 'Escuchar antes de opinar', 'Expresar tu punto claro', 'Evitarla si es posible', 'Buscar puntos en común', 15, 4, 6, 10),
('¿Qué te relaja después de un día difícil?', 'Leer o escribir', 'Hablar con alguien cercano', 'Ver una película divertida', 'Organizar tu espacio', 1, 6, 12, 10),
('¿Qué opinas sobre los cambios?', 'Me emocionan', 'Me adaptan pero con esfuerzo', 'Me asustan al principio', 'Depende del contexto', 4, 6, 2, 14),
('¿Qué frase te representa mejor?', 'La lógica lo es todo', 'El corazón guía mis actos', 'El mundo es un escenario', 'Todo tiene solución', 13, 1, 12, 11),
('¿Cómo describes tu infancia?', 'Soñador y creativo', 'Introvertido y sensible', 'Curioso e independiente', 'Líder natural', 16, 2, 9, 14);

INSERT INTO FACULTAD (NOMBRE) VALUES
('Derecho, Empresa y Gobierno'),
('Ciencias de la Comunicación'),
('Educación y Psicología'),
('Ciencias Experimentales'),
('Ciencias de la Salud'),
('Escuela Politécnica Superior'),
('Medicina');

INSERT INTO USUARIO (
    CORREO, CONTRASENA, NOMBRE, APELLIDO1, APELLIDO2, FACULTAD_ID,
    CURSO, FECHA_NACIMIENTO, IMAGEN_PERFIL, TIPO_PERSONALIDAD_ID
) VALUES
('marta.gomez@example.com', 'hashedpassword1', 'Marta', 'Gómez', 'López', 1, 2, '2002-06-15', 'assets/perfiles/default.jpg', 1),
('carlos.perez@example.com', 'hashedpassword2', 'Carlos', 'Pérez', NULL, 2, 1, '2003-09-20', 'assets/perfiles/default.jpg', 5),
('lucia.martin@example.com', 'hashedpassword3', 'Lucía', 'Martín', 'Rodríguez', 3, 3, '2001-12-01', 'assets/perfiles/default.jpg', 4),
('jose.garcia@example.com', 'hashedpassword4', 'José', 'García', 'Sánchez', 4, 2, '2002-11-10', 'assets/perfiles/default.jpg', 13),
('laura.diaz@example.com', 'hashedpassword5', 'Laura', 'Díaz', NULL, 5, 4, '2000-05-23', 'assets/perfiles/default.jpg', 3),
('alvaro.ruiz@example.com', 'hashedpassword6', 'Álvaro', 'Ruiz', 'Morales', 6, 2, '2002-08-18', 'assets/perfiles/default.jpg', 9),
('patricia.santos@example.com', 'hashedpassword7', 'Patricia', 'Santos', 'Romero', 7, 1, '2004-01-29', 'assets/perfiles/default.jpg', 2),
('daniel.lopez@example.com', 'hashedpassword8', 'Daniel', 'López', NULL, 6, 3, '2001-03-11', 'assets/perfiles/default.jpg', 16),
('ana.torres@example.com', 'hashedpassword9', 'Ana', 'Torres', 'Gil', 2, 2, '2002-07-08', 'assets/perfiles/default.jpg', 8),
('miguel.navarro@example.com', 'hashedpassword10', 'Miguel', 'Navarro', 'Herrera', 4, 1, '2003-02-05', 'assets/perfiles/default.jpg', 11),
('ines.martinez@unified.edu', 'pass123', 'Inés', 'Martínez', 'Serrano', 3, 2, '2002-08-11', 'assets/perfiles/default.jpg', 2),
('carlos.ruiz@unified.edu', 'pass123', 'Carlos', 'Ruiz', NULL, 6, 4, '1999-12-03', 'assets/perfiles/default.jpg', 5),
('paula.garcia@unified.edu', 'pass123', 'Paula', 'García', 'Domínguez', 4, 1, '2004-06-27', 'assets/perfiles/default.jpg', 10),
('david.moreno@unified.edu', 'pass123', 'David', 'Moreno', 'Navarro', 5, 3, '2001-10-05', 'assets/perfiles/default.jpg', 13),
('sara.luna@unified.edu', 'pass123', 'Sara', 'Luna', NULL, 2, 2, '2003-02-18', 'assets/perfiles/default.jpg', 6),
('mario.torres@unified.edu', 'pass123', 'Mario', 'Torres', 'Vega', 1, 1, '2004-04-04', 'assets/perfiles/default.jpg', 15),
('julia.diaz@unified.edu', 'pass123', 'Julia', 'Díaz', 'Ramos', 6, 3, '2001-07-30', 'assets/perfiles/default.jpg', 14),
('andres.sanchez@unified.edu', 'pass123', 'Andrés', 'Sánchez', NULL, 7, 2, '2002-03-22', 'assets/perfiles/default.jpg', 1),
('lucia.rodriguez@unified.edu', 'pass123', 'Lucía', 'Rodríguez', 'Gil', 3, 4, '2000-01-19', 'assets/perfiles/default.jpg', 11),
('jorge.castillo@unified.edu', 'pass123', 'Jorge', 'Castillo', 'Ibáñez', 4, 2, '2002-09-08', 'assets/perfiles/default.jpg', 8),
('ana.benitez@unified.edu', 'pass123', 'Ana', 'Benítez', 'Herrera', 2, 1, '2004-11-15', 'assets/perfiles/default.jpg', 7),
('ricardo.mendez@unified.edu', 'pass123', 'Ricardo', 'Méndez', NULL, 1, 4, '1999-05-09', 'assets/perfiles/default.jpg', 4),
('clara.ortega@unified.edu', 'pass123', 'Clara', 'Ortega', 'Campos', 3, 3, '2001-06-01', 'assets/perfiles/default.jpg', 16),
('alberto.lopez@unified.edu', 'pass123', 'Alberto', 'López', 'Cano', 5, 2, '2003-01-28', 'assets/perfiles/default.jpg', 9),
('marta.vicente@unified.edu', 'pass123', 'Marta', 'Vicente', NULL, 6, 2, '2002-12-13', 'assets/perfiles/default.jpg', 12),
('daniel.perez@unified.edu', 'pass123', 'Daniel', 'Pérez', 'Rubio', 4, 1, '2004-10-19', 'assets/perfiles/default.jpg', 3),
('alba.santos@unified.edu', 'pass123', 'Alba', 'Santos', 'Morales', 7, 4, '1999-03-06', 'assets/perfiles/default.jpg', 6),
('sergio.navarro@unified.edu', 'pass123', 'Sergio', 'Navarro', NULL, 2, 3, '2001-09-17', 'assets/perfiles/default.jpg', 10),
('irene.molina@unified.edu', 'pass123', 'Irene', 'Molina', 'Carrillo', 1, 2, '2003-05-25', 'assets/perfiles/default.jpg', 13),
('victor.fuentes@unified.edu', 'pass123', 'Víctor', 'Fuentes', 'Rojas', 3, 1, '2004-08-31', 'assets/perfiles/default.jpg', 15),
('paula.crespo@unified.edu', 'pass123', 'Paula', 'Crespo', 'Martínez', 2, 2, '2002-07-14', 'assets/perfiles/default.jpg', 11),
('javier.rodriguez@unified.edu', 'pass123', 'Javier', 'Rodríguez', 'Sanz', 4, 3, '2001-11-02', 'assets/perfiles/default.jpg', 1),
('laura.gonzalez@unified.edu', 'pass123', 'Laura', 'González', NULL, 6, 1, '2004-03-23', 'assets/perfiles/default.jpg', 5),
('david.martin@unified.edu', 'pass123', 'David', 'Martín', 'Reyes', 3, 4, '2000-10-12', 'assets/perfiles/default.jpg', 8),
('lucia.sierra@unified.edu', 'pass123', 'Lucía', 'Sierra', 'Ortega', 7, 2, '2002-01-09', 'assets/perfiles/default.jpg', 14),
('miguel.ruiz@unified.edu', 'pass123', 'Miguel', 'Ruiz', 'Domínguez', 1, 1, '2004-06-27', 'assets/perfiles/default.jpg', 2),
('ines.lozano@unified.edu', 'pass123', 'Inés', 'Lozano', NULL, 5, 3, '2001-04-05', 'assets/perfiles/default.jpg', 12),
('alejandro.campos@unified.edu', 'pass123', 'Alejandro', 'Campos', 'Gil', 3, 2, '2003-09-30', 'assets/perfiles/default.jpg', 9),
('patricia.blanco@unified.edu', 'pass123', 'Patricia', 'Blanco', 'Muñoz', 2, 4, '2000-02-18', 'assets/perfiles/default.jpg', 6),
('oscar.moreno@unified.edu', 'pass123', 'Óscar', 'Moreno', 'Navarro', 6, 1, '2004-12-21', 'assets/perfiles/default.jpg', 15),
('prueba@prueba.com', '$2a$11$ILJBCWk2wSUHjr7ZCfaISu2dk8iry7pbg84gFrafFMaRPhhYrREmW', 'prueba', 'prueba', 'prueba', 6, 2, '2000-01-01', 'assets/perfiles/prueba@prueba.com.png', 15);