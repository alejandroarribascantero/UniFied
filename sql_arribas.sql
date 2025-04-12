DROP DATABASE IF EXISTS UniFied;
CREATE DATABASE UniFied;
USE UniFied;

CREATE TABLE TIPO_PERSONALIDAD (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(50),
    CODIGO_MBTI CHAR(4),
    ROL VARCHAR(50),
    ESTRATEGIA VARCHAR(50),
    DESCRIPCION TEXT
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
    FACULTAD_ID INT,
    CURSO NUMERIC(2),
    IMAGEN_PERFIL VARCHAR(500) DEFAULT '/assets/default.jpg',
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


INSERT INTO TIPO_PERSONALIDAD (NOMBRE, CODIGO_MBTI, ROL, ESTRATEGIA, DESCRIPCION) VALUES
('Abogado', 'INFJ', 'Diplomático', 'Confianza constante', 'Idealistas callados y misteriosos, pero muy inspiradores e incansables.'),
('Mediador', 'INFP', 'Diplomático', 'Confianza constante', 'Poéticos, amables y altruistas, siempre dispuestos a ayudar a una buena causa.'),
('Protagonista', 'ENFJ', 'Diplomático', 'Confianza constante', 'Líderes carismáticos e inspiradores, capaces de cautivar a quien los escuche.'),
('Activista', 'ENFP', 'Diplomático', 'Social y espontánea', 'Espíritus libres entusiastas, creativos y sociables, que siempre pueden encontrar una razón para sonreír.'),
('Logista', 'ISTJ', 'Centinela', 'Confianza constante', 'Prácticos y centrados en los hechos, cuya fiabilidad no tiene comparación.'),
('Defensor', 'ISFJ', 'Centinela', 'Confianza constante', 'Protectores dedicados y cálidos, siempre listos para defender a sus seres queridos.'),
('Ejecutivo', 'ESTJ', 'Centinela', 'Confianza constante', 'Excelentes administradores, inigualables a la hora de gestionar cosas – o personas.'),
('Cónsul', 'ESFJ', 'Centinela', 'Popularidad social', 'Personas extraordinariamente sociables, comprometidas con el deber y siempre dispuestas a ayudar.'),
('Virtuoso', 'ISTP', 'Explorador', 'Mejora constante', 'Experimentadores prácticos y valientes, maestros en el uso de todo tipo de herramientas.'),
('Aventurero', 'ISFP', 'Explorador', 'Mejora constante', 'Artistas flexibles y encantadores, siempre dispuestos a explorar y a experimentar algo nuevo.'),
('Emprendedor', 'ESTP', 'Explorador', 'Mejora constante', 'Personas inteligentes, enérgicas y muy perceptivas, que realmente disfrutan vivir al límite.'),
('Animador', 'ESFP', 'Explorador', 'Social y espontánea', 'Animadores espontáneos, enérgicos y entusiastas – la vida nunca es aburrida a su lado.'),
('Arquitecto', 'INTJ', 'Analista', 'Mejora constante', 'Pensadores estratégicos e imaginativos con un plan para todo.'),
('Lógico', 'INTP', 'Analista', 'Mejora constante', 'Inventores innovadores con una sed insaciable de conocimiento.'),
('Comandante', 'ENTJ', 'Analista', 'Mejora constante', 'Líderes audaces, imaginativos y de voluntad fuerte, siempre en busca del camino – o creándolo.'),
('Innovador', 'ENTP', 'Analista', 'Social y espontánea', 'Pensadores inteligentes y curiosos que no pueden resistirse a un desafío intelectual.');

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