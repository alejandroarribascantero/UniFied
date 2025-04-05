-- 1usuario. Crear la base de datos
DROP DATABASE ejemplo_diagrama;

CREATE DATABASE IF NOT EXISTS ejemplo_diagrama;
USE ejemplo_diagrama;

-- 2. Tabla USUARIO (clase base)
CREATE TABLE Usuario (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    rol              ENUM('ADMIN','ALUMNO') NOT NULL,
    password         VARCHAR(255) NOT NULL,
    email            VARCHAR(100) NOT NULL
);

-- 3. Tabla ALUMNO (subclase de USUARIO)
--    Aquí van los campos específicos de la clase Alumno;
--    cada registro en ALUMNO apunta a un registro en USUARIO
--    cuyo rol sea ALUMNO.
CREATE TABLE Alumno (
    id_alumno            INT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario           INT NOT NULL,
    
    -- Campos propios del Alumno:
    nombre               VARCHAR(50) NOT NULL,
    apellido1            VARCHAR(50) NOT NULL,
    apellido2            VARCHAR(50),
    fecha_nacimiento     DATE,
    genero               ENUM('HOMBRE','MUJER'),
    tipo_identificacion  ENUM('DNI','PASAPORTE','NIE'),
    identificacion  	 VARCHAR(20),
    eneatipo             ENUM(
                           'REFORMADOR',
                           'AYUDADOR',
                           'TRIUNFADOR',
                           'INDIVIDUALISTA',
                           'INVESTIGADOR',
                           'LEAL',
                           'ENTUSIASTA',
                           'DESAFIADOR',
                           'PACIFICADOR'
                         ),
    estudios             ENUM('GRADO','CETIS','MASTER'),
    facultad             ENUM(
                           'DERECHO_EMPRESA_GOBIERNO',
                           'CIENCIAS_COMUNICACION',
                           'EDUCACION_PSICOLOGIA',
                           'CIENCIAS_EXPERIMENTALES',
                           'CIENCIAS_SALUD',
                           'POLITECNICA_SUPERIOR',
                           'MEDICINA'
                         ),
    
    CONSTRAINT fk_alumno_usuario
        FOREIGN KEY (fk_usuario)
        REFERENCES Usuario (id)
        -- Opcionalmente:
        -- ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

-- 4. Tabla intermedia para lista de seguidores
--    (relación muchos-a-muchos entre alumnos).
CREATE TABLE Seguidores (
    id_alumno    INT NOT NULL,
    id_seguidor  INT NOT NULL,
    
    PRIMARY KEY (id_alumno, id_seguidor),
    
    CONSTRAINT fk_seguido_alumno
        FOREIGN KEY (id_alumno)
        REFERENCES Alumno(id_alumno),
    CONSTRAINT fk_seguidor_alumno
        FOREIGN KEY (id_seguidor)
        REFERENCES Alumno(id_alumno)
);

-- 5. Tabla PETICION
--    Un alumno emite una petición hacia otro alumno.
CREATE TABLE Peticion (
    id_peticion        INT AUTO_INCREMENT PRIMARY KEY,
    fk_alumno_emisor   INT NOT NULL,
    fk_alumno_receptor INT NOT NULL,

    CONSTRAINT fk_peticion_emisor
        FOREIGN KEY (fk_alumno_emisor)
        REFERENCES Alumno (id_alumno),

    CONSTRAINT fk_peticion_receptor
        FOREIGN KEY (fk_alumno_receptor)
        REFERENCES Alumno (id_alumno)
);

-- 6. Tabla CONTESTACION
--    Para guardar las contestaciones a una petición.
--    'contestaciones' se define como TEXT para poder
--    almacenar una lista/array serializada, o texto libre.
CREATE TABLE Contestacion (
    id_contestacion INT AUTO_INCREMENT PRIMARY KEY,
    fk_peticion INT NOT NULL,
    contestaciones TEXT,
    CONSTRAINT fk_contestacion_peticion FOREIGN KEY (fk_peticion)
        REFERENCES Peticion (id_peticion)
);


-- (Asumiendo que ya estamos en la BD ejemplo_diagrama)
USE ejemplo_diagrama;

-- 6. Tabla PREGUNTAS
CREATE TABLE Preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta    VARCHAR(200) NOT NULL,
    opcion_a    VARCHAR(200) NOT NULL,
    opcion_b    VARCHAR(200) NOT NULL,
    opcion_c    VARCHAR(200) NOT NULL,
    opcion_d    VARCHAR(200) NOT NULL,
    eneatipo_a  INT NOT NULL,  -- Eneatipo asociado a la opción A
    eneatipo_b  INT NOT NULL,  -- Eneatipo asociado a la opción B
    eneatipo_c  INT NOT NULL,  -- Eneatipo asociado a la opción C
    eneatipo_d  INT NOT NULL   -- Eneatipo asociado a la opción D
);

-- 7. Tabla RESPUESTAS
CREATE TABLE Respuestas (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario      INT NOT NULL,
    fk_pregunta     INT NOT NULL,
    respuesta       ENUM('A', 'B', 'C', 'D') NOT NULL,
    fecha_respuesta DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_respuesta_usuario
        FOREIGN KEY (fk_usuario)
        REFERENCES Usuario(id),

    CONSTRAINT fk_respuesta_pregunta
        FOREIGN KEY (fk_pregunta)
        REFERENCES Preguntas(id)
);

-- 8. Tabla USUARIO_PREGUNTAS
--    Relaciona a un usuario con una pregunta y 
--    registra la "opción" o "respuesta" elegida.
CREATE TABLE Usuario_Preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opcion_respuesta     INT,               -- por ej. un índice de respuesta
    fk_pregunta          INT NOT NULL,      -- la pregunta asociada
    fk_usuario           INT NOT NULL,      -- el usuario que responde

    CONSTRAINT fk_usuario_pregunta_preg
      FOREIGN KEY (fk_pregunta)
      REFERENCES Preguntas(id),

    CONSTRAINT fk_usuario_pregunta_usr
      FOREIGN KEY (fk_usuario)
      REFERENCES Usuario(id)
);
