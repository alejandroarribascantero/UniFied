// URL base de la API
const API_URL = 'https://localhost:7221/api/';

// ------------------------ FUNCIONES AUXILIARES DE CONVERSIÓN ------------------------ //

const convertirGenero = (genero) => {
    const valor = { "Masculino": 0, "Femenino": 1 }[genero];
    if (valor === undefined) throw new Error("Género no válido");
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
                genero: convertirGenero(usuario.genero),
                tipo_Identificacion: convertirTipoIdentificacion(usuario.tipoIdentificacion),
                identificacion: usuario.identificacion,
                estudios: convertirEstudios(usuario.estudios),
                facultad: convertirFacultad(usuario.facultad),
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
    const rutas = ["../index.html", "../pages/profesor.html", "../pages/admin.html"];
    window.location.href = rutas[rol] ?? "../pages/login.html";
}

// ------------------------ FUNCIONES DE AUTENTICACIÓN Y PROTECCIÓN ------------------------ //

function protegerRuta() {
    const usuario = getUsuarioActual();
    const paginaActual = window.location.pathname.split("/").pop();
    const paginasPublicas = ["login.html", "registro.html"];

    if (!usuario && !paginasPublicas.includes(paginaActual)) {
        window.location.href = "../pages/login.html";
    } else if (usuario && paginasPublicas.includes(paginaActual)) {
        redirigirPorRol(usuario.rol);
    }
}

function verificarSesion() {
    const usuario = getUsuarioActual();
    if (usuario) redirigirPorRol(usuario.rol);
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
                alert("Por favor, complete todos los campos obligatorios");
                return;
            }

            if (usuario.password !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }

            registrarUsuario(usuario)
                .done(() => {
                    alert("Registro exitoso");
                    window.location.href = "login.html";
                })
                .fail((error) => {
                    alert(error.status === 409 ? "El email ya está registrado" : "Error en el registro. Intente nuevamente.");
                });
        } catch (error) {
            alert(error.message);
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
            alert("Por favor, complete todos los campos");
            return;
        }

        loginUsuario(credenciales)
            .done((response) => {
                sessionStorage.setItem("usuario", JSON.stringify(response));
                alert("Inicio de sesión exitoso");
                redirigirPorRol(response.rol);
            })
            .fail((error) => {
                alert(error.status === 401 ? "Email o contraseña incorrectos" : "Error en el inicio de sesión. Intente nuevamente.");
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

    // Mostrar las preguntas de la página actual
    for (let i = inicio; i < fin; i++) {
        const pregunta = preguntasActuales[i];
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'mb-3 p-3 bg-white shadow rounded';
        
        preguntaDiv.innerHTML = `
            <p class="fw-bold">${i + 1}. ${pregunta.pregunta}</p>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" value="A" required>
                <label class="form-check-label">${pregunta.opcionA}</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" value="B" required>
                <label class="form-check-label">${pregunta.opcionB}</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" value="C" required>
                <label class="form-check-label">${pregunta.opcionC}</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="pregunta${pregunta.id}" value="D" required>
                <label class="form-check-label">${pregunta.opcionD}</label>
            </div>
        `;
        
        container.appendChild(preguntaDiv);
    }

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
    // Guardar las respuestas actuales
    const respuestasActuales = {};
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    inputs.forEach(input => {
        respuestasActuales[input.name] = input.value;
    });

    // Cambiar de página
    paginaActual = nuevaPagina;
    mostrarPaginaActual();

    // Restaurar las respuestas
    Object.entries(respuestasActuales).forEach(([name, value]) => {
        const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (input) {
            input.checked = true;
        }
    });
}

function enviarTest() {
    const form = document.getElementById('testForm');
    if (!form) return;
    
    const respuestas = [];
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    
    if (inputs.length !== 20) {
        alert('Por favor, responde todas las preguntas.');
        return;
    }

    inputs.forEach(input => {
        const preguntaId = input.name.replace('pregunta', '');
        respuestas.push({
            PreguntaId: parseInt(preguntaId),
            Respuesta: input.value
        });
    });

    enviarRespuestasTest(respuestas)
        .done(function(resultado) {
            if (resultado.eneatipo) {
                alert(`Tu eneatipo es: ${resultado.eneatipo}`);
                window.location.href = '../index.html';
            }
        })
        .fail(function(error) {
            console.error('Error al enviar las respuestas:', error);
            alert('Error al enviar las respuestas. Por favor, inténtalo de nuevo.');
        });
}

function manejarTestPersonalidad() {
    const form = document.getElementById('testForm');
    if (!form) return;

    // Cargar preguntas al cargar la página
    obtenerPreguntasTest()
        .done(function(preguntas) {
            mostrarPreguntas(preguntas);
        })
        .fail(function(error) {
            console.error('Error al cargar las preguntas:', error);
            alert('Error al cargar las preguntas. Por favor, recarga la página.');
        });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const respuestas = [];
        const inputs = form.querySelectorAll('input[type="radio"]:checked');
        
        if (inputs.length !== 20) {
            alert('Por favor, responde todas las preguntas.');
            return;
        }

        inputs.forEach(input => {
            const preguntaId = input.name.replace('pregunta', '');
            respuestas.push({
                PreguntaId: parseInt(preguntaId),
                Respuesta: input.value
            });
        });

        enviarRespuestasTest(respuestas)
            .done(function(resultado) {
                if (resultado.eneatipo) {
                    alert(`Tu eneatipo es: ${resultado.eneatipo}`);
                    // Redirigir a la página principal o mostrar resultados
                    window.location.href = '../index.html';
                }
            })
            .fail(function(error) {
                console.error('Error al enviar las respuestas:', error);
                alert('Error al enviar las respuestas. Por favor, inténtalo de nuevo.');
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
