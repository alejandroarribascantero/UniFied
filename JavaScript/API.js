// URL base de la API
const API_URL = 'https://localhost:7221/api/';

// ------------------------ FUNCIONES AUXILIARES DE CONVERSIÓN ------------------------ //

const convertirGenero = (genero) => {
    console.log(genero)
    const valor = { 
        "Masculino": 0, 
        "Femenino": 1,
        "masculino": 0,
        "femenino": 1
    }[genero];
    
    if (valor === undefined) {
        console.error("Género no válido:", genero);
        throw new Error("Género no válido");
    }
    return valor;
};

const convertirTipoIdentificacion = (tipo) => {
    const valor = { "DNI": 0, "NIE": 1, "PASAPORTE": 2 }[tipo];
    if (valor === undefined) throw new Error("Tipo de identificación no válido");
    return valor;
};

const convertirEstudios = (estudios) => {
    const valor = { "GRADO": 0, "MASTER": 1, "DOCTORADO": 2 }[estudios];
    if (valor === undefined) throw new Error("Nivel de estudios no válido");
    return valor;
};

const convertirFacultad = (facultad) => {
    const valor = {
        "DERECHO_EMPRESA_GOBIERNO": 0,
        "CIENCIAS_COMUNICACION": 1,
        "EDUCACION_PSICOLOGIA": 2,
        "CIENCIAS_EXPERIMENTALES": 3,
        "CIENCIAS_SALUD": 4,
        "POLITECNICA_SUPERIOR": 5,
        "MEDICINA": 6
    }[facultad];
    if (valor === undefined) throw new Error("Facultad no válida");
    return valor;
};

// ------------------------ GESTIÓN DE USUARIO ------------------------ //

function registrarUsuario(usuario) {
    return $.ajax({
        url: `${API_URL}usuario/registro`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            Usuario: {
                email: usuario.email,
                password: usuario.password,
                rol: 1 // rol profesor por defecto
            },
            Alumno: {
                nombre: usuario.nombre,
                apellido1: usuario.apellido1,
                apellido2: usuario.apellido2,
                fecha_nacimiento: usuario.fechaNacimiento,
                genero: usuario.genero,
                tipo_Identificacion: usuario.tipoIdentificacion,
                identificacion: usuario.identificacion,
                estudios: usuario.estudios,
                facultad: usuario.facultad,
                eneatipo: 1 // valor por defecto
            }
        })
    });
}

function loginUsuario(credenciales) {
    return $.ajax({
        url: `${API_URL}usuario/login`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(credenciales)
    });
}

function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    window.location.href = "../pages/login.html";
}

function getUsuarioActual() {
    const usuario = sessionStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
}

function redirigirPorRol(rol) {
    window.location.href = "../index.html";
}

// ------------------------ FUNCIONES DE AUTENTICACIÓN Y PROTECCIÓN ------------------------ //

function protegerRuta() {
    const usuario = getUsuarioActual();
    const paginaActual = window.location.pathname.split("/").pop();
    const paginasPublicas = ["login.html", "registro.html"];

    // Si no hay usuario y no está en página pública, redirigir a login
    if (!usuario && !paginasPublicas.includes(paginaActual)) {
        window.location.href = "../pages/login.html";
        return; // Importante: salir de la función después de redirigir
    }

    // Si hay usuario
    if (usuario) {
        // Si no tiene eneatipo y no está en el test
        if (!usuario.eneatipo && paginaActual !== "testPersonalidad.html") {
            window.location.href = "../pages/testPersonalidad.html";
            return;
        }
        
        // Si tiene eneatipo y está en el test, redirigir según rol
        if (usuario.eneatipo && paginaActual === "testPersonalidad.html") {
            redirigirPorRol(usuario.rol);
            return;
        }
        
        // Si está en páginas públicas, redirigir según rol
        if (paginasPublicas.includes(paginaActual)) {
            redirigirPorRol(usuario.rol);
            return;
        }
    }
}

function verificarSesion() {
    const usuario = getUsuarioActual();
    const paginaActual = window.location.pathname.split("/").pop();
    const paginasPublicas = ["login.html", "registro.html"];
    
    // Solo redirigir si hay usuario y no está en una página pública
    if (usuario && !paginasPublicas.includes(paginaActual)) {
        redirigirPorRol(usuario.rol);
    }
}

// ------------------------ EVENTOS DE FORMULARIOS ------------------------ //

function manejarRegistro() {
    $("#registroForm").on("submit", function(e) {
        e.preventDefault();
        
        try {
            const usuario = {
                email: $("#email").val(),
                password: $("#password").val(),
                nombre: $("#nombre").val(),
                apellido1: $("#apellido1").val(),
                apellido2: $("#apellido2").val(),
                fechaNacimiento: $("#fechaNacimiento").val(),
                genero: convertirGenero($("#genero").val()),
                tipoIdentificacion: convertirTipoIdentificacion($("#tipoIdentificacion").val()),
                identificacion: $("#identificacion").val(),
                estudios: convertirEstudios($("#estudios").val()),
                facultad: convertirFacultad($("#facultad").val())
            };

            const confirmPassword = $("#confirmPassword").val();

            if (Object.values(usuario).includes("") || confirmPassword === "") {
                console.log("Por favor, complete todos los campos obligatorios");
                return;
            }

            if (usuario.password !== confirmPassword) {
                console.log("Las contraseñas no coinciden");
                return;
            }

            registrarUsuario(usuario)
                .done(() => {
                    console.log("Registro exitoso");
                    window.location.href = "testPersonalidad.html";
                })
                .fail((error) => {
                    console.error('Error en el registro:', error);
                    console.log(error.status === 409 ? "El email ya está registrado" : "Error en el registro. Intente nuevamente.");
                });
        } catch (error) {
            console.error('Error en el registro:', error);
            console.log(error.message);
        }
    });
}

function manejarLogin() {
    $("#loginForm").on("submit", function(e) {
        e.preventDefault();

        const credenciales = {
            email: $("#email").val(),
            password: $("#loginPassword").val()
        };

        if (!credenciales.email || !credenciales.password) {
            console.log("Por favor, complete todos los campos");
            return;
        }

        loginUsuario(credenciales)
            .done((response) => {
                sessionStorage.setItem("usuario", JSON.stringify(response));
                console.log("Inicio de sesión exitoso");
                
                // Verificar si el usuario tiene eneatipo asignado
                if (!response.eneatipo) {
                    // Si no tiene eneatipo, redirigir al test
                    window.location.href = "testPersonalidad.html";
                } else {
                    // Si tiene eneatipo, redirigir según su rol
                    redirigirPorRol(response.rol);
                }
            })
            .fail((error) => {
                console.error('Error al iniciar sesión:', error);
                console.log(error.status === 401 ? "Email o contraseña incorrectos" : "Error en el inicio de sesión. Intente nuevamente.");
            });
    });
}

// ------------------------ TEST DE PERSONALIDAD ------------------------ //

// Función para obtener las preguntas del test
function obtenerPreguntasTest() {
    return $.ajax({
        url: `${API_URL}testpersonalidad/preguntas`,
        type: "GET"
    });
}

let preguntasActuales = [];
let paginaActual = 0;
const preguntasPorPagina = 5;

function mostrarPreguntas(preguntas) {
    preguntasActuales = preguntas;
    paginaActual = 0;
    mostrarPaginaActual();
}

function mostrarPaginaActual() {
    const container = document.getElementById('preguntasContainer');
    container.innerHTML = ''; // Limpiar el contenedor

    // Calcular el rango de preguntas a mostrar
    const inicio = paginaActual * preguntasPorPagina;
    const fin = Math.min(inicio + preguntasPorPagina, preguntasActuales.length);

    // Cargar respuestas guardadas del sessionStorage
    const respuestasGuardadas = JSON.parse(sessionStorage.getItem('respuestasTest') || '{}');

    // Mostrar las preguntas de la página actual
    for (let i = inicio; i < fin; i++) {
        const pregunta = preguntasActuales[i];
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'mb-3 p-3 bg-white shadow rounded';
        
        // Obtener la respuesta guardada para esta pregunta
        const respuestaGuardada = respuestasGuardadas[`pregunta${pregunta.id}`];
        
        preguntaDiv.innerHTML = `
            <p class="fw-bold">${i + 1}. ${pregunta.pregunta}</p>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" id="pregunta${pregunta.id}_A" value="A" required ${respuestaGuardada === 'A' ? 'checked' : ''}>
                <label class="form-check-label" for="pregunta${pregunta.id}_A">${pregunta.opcionA}</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" id="pregunta${pregunta.id}_B" value="B" required ${respuestaGuardada === 'B' ? 'checked' : ''}>
                <label class="form-check-label" for="pregunta${pregunta.id}_B">${pregunta.opcionB}</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" id="pregunta${pregunta.id}_C" value="C" required ${respuestaGuardada === 'C' ? 'checked' : ''}>
                <label class="form-check-label" for="pregunta${pregunta.id}_C">${pregunta.opcionC}</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" id="pregunta${pregunta.id}_D" value="D" required ${respuestaGuardada === 'D' ? 'checked' : ''}>
                <label class="form-check-label" for="pregunta${pregunta.id}_D">${pregunta.opcionD}</label>
            </div>
        `;
        
        container.appendChild(preguntaDiv);
    }

    // Añadir evento de cambio a todos los radio buttons
    const radioButtons = container.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Obtener las respuestas actuales
            const respuestasActuales = {};
            const inputs = document.querySelectorAll('input[type="radio"]:checked');
            inputs.forEach(input => {
                respuestasActuales[input.name] = input.value;
            });

            // Combinar con respuestas existentes
            const respuestasGuardadas = JSON.parse(sessionStorage.getItem('respuestasTest') || '{}');
            const respuestasCombinadas = { ...respuestasGuardadas, ...respuestasActuales };
            sessionStorage.setItem('respuestasTest', JSON.stringify(respuestasCombinadas));
        });
    });

    // Añadir botones de navegación
    const navegacionDiv = document.createElement('div');
    navegacionDiv.className = 'd-flex justify-content-between mt-4';
    
    const esUltimaPagina = fin >= preguntasActuales.length;
    
    navegacionDiv.innerHTML = `
        <button class="btn btn-primary ${paginaActual === 0 ? 'disabled' : ''}" 
                onclick="cambiarPagina(${paginaActual - 1})" 
                ${paginaActual === 0 ? 'disabled' : ''}>
            Anterior
        </button>
        <span class="align-self-center">Página ${paginaActual + 1} de ${Math.ceil(preguntasActuales.length / preguntasPorPagina)}</span>
        ${esUltimaPagina 
            ? '<button class="btn btn-success" onclick="enviarTest()">Enviar</button>'
            : `<button class="btn btn-primary" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</button>`
        }
    `;
    
    container.appendChild(navegacionDiv);
}

function cambiarPagina(nuevaPagina) {
    // Cambiar de página
    paginaActual = nuevaPagina;
    mostrarPaginaActual();
}

function enviarRespuestasTest(respuestas) {
    const usuario = getUsuarioActual();
    if (!usuario) {
        return Promise.reject(new Error("Usuario no autenticado"));
    }

    return $.ajax({
        url: `${API_URL}testpersonalidad/respuestas`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            Email: usuario.email,
            Respuestas: respuestas
        })
    });
}

function enviarTest() {
    const form = document.getElementById('testForm');
    if (!form) return;
    
    // Obtener todas las respuestas del sessionStorage
    const respuestasGuardadas = JSON.parse(sessionStorage.getItem('respuestasTest') || '{}');
    const respuestas = [];
    
    // Verificar que todas las preguntas tengan respuesta
    let todasRespondidas = true;
    for (let i = 0; i < preguntasActuales.length; i++) {
        const pregunta = preguntasActuales[i];
        const respuesta = respuestasGuardadas[`pregunta${pregunta.id}`];
        
        if (!respuesta) {
            todasRespondidas = false;
            break;
        }
        
        respuestas.push({
            PreguntaId: pregunta.id,
            _Respuesta: respuesta
        });
    }

    if (!todasRespondidas) {
        console.log('Por favor, responde todas las preguntas.');
        return;
    }

    // Limpiar el sessionStorage después de enviar el test
    sessionStorage.removeItem('respuestasTest');

    enviarRespuestasTest(respuestas)
        .done(function(resultado) {
            if (resultado.eneatipo) {
                // Actualizar el eneatipo en el usuario actual
                const usuario = getUsuarioActual();
                usuario.eneatipo = resultado.eneatipo;
                sessionStorage.setItem("usuario", JSON.stringify(usuario));
                
                console.log(`Tu eneatipo es: ${resultado.eneatipo}`);
                window.location.href = '../index.html';
            }
        })
        .fail(function(error) {
            console.error('Error al enviar las respuestas:', error);
            console.log('Error al enviar las respuestas. Por favor, inténtalo de nuevo.');
        });
}

function manejarTestPersonalidad() {
    const form = document.getElementById('testForm');
    if (!form) return;

    // Verificar si el usuario ya tiene eneatipo
    const usuario = getUsuarioActual();
    if (usuario && usuario.eneatipo) {
        // Solo redirigir si tiene eneatipo
        redirigirPorRol(usuario.rol);
        return;
    }

    // Si no tiene eneatipo, cargar el test
    obtenerPreguntasTest()
        .done(function(preguntas) {
            mostrarPreguntas(preguntas);
        })
        .fail(function(error) {
            console.error('Error al cargar las preguntas:', error);
            console.log('Error al cargar las preguntas. Por favor, recarga la página.');
        });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const respuestas = [];
        const inputs = form.querySelectorAll('input[type="radio"]:checked');
        
        if (inputs.length !== 20) {
            console.log('Por favor, responde todas las preguntas.');
            return;
        }

        inputs.forEach(input => {
            const preguntaId = input.name.replace('pregunta', '');
            respuestas.push({
                PreguntaId: parseInt(preguntaId),
                _Respuesta: input.value
            });
        });

        enviarRespuestasTest(respuestas)
            .done(function(resultado) {
                if (resultado.eneatipo) {
                    console.log(`Tu eneatipo es: ${resultado.eneatipo}`);
                    window.location.href = '../index.html';
                }
            })
            .fail(function(error) {
                console.error('Error al enviar las respuestas:', error);
                console.log('Error al enviar las respuestas. Por favor, inténtalo de nuevo.');
            });
    });
}

// ------------------------ INICIALIZACIÓN DE EVENTOS ------------------------ //

$(document).ready(function() {
    protegerRuta();

    if (window.location.pathname.includes("login.html")) {
        verificarSesion();
        manejarLogin();
    }

    if (window.location.pathname.includes("registro.html")) {
        manejarRegistro();
    }

    if (window.location.pathname.includes("testPersonalidad.html")) {
        manejarTestPersonalidad();
    }
});
