API_URL = 'https://localhost:7221/api/';

// Función para registrar un nuevo usuario
function registrarUsuario(usuario) {
    // Función para convertir género a número
    const convertirGenero = (genero) => {
        switch(genero) {
            case "Masculino": return 0;
            case "Femenino": return 1;
            default: return 0;
        }
    };

    // Función para convertir tipo de identificación a número
    const convertirTipoIdentificacion = (tipo) => {
        switch(tipo) {
            case "DNI": return 0;
            case "NIE": return 1;
            case "PASAPORTE": return 2;
            default: return 0;
        }
    };

    // Función para convertir estudios a número
    const convertirEstudios = (estudios) => {
        switch(estudios) {
            case "GRADO": return 0;
            case "MASTER": return 1;
            case "DOCTORADO": return 2;
            default: return 0;
        }
    };

    // Función para convertir facultad a número
    const convertirFacultad = (facultad) => {
        switch(facultad) {
            case "DERECHO_EMPRESA_GOBIERNO": return 0;
            case "CIENCIAS_COMUNICACION": return 1;
            case "EDUCACION_PSICOLOGIA": return 2;
            case "CIENCIAS_EXPERIMENTALES": return 3;
            case "CIENCIAS_SALUD": return 4;
            case "POLITECNICA_SUPERIOR": return 5;
            case "MEDICINA": return 6;
            default: return 0;
        }
    };

    return $.ajax({
        url: API_URL + "usuario/registro",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            Usuario: {
                email: usuario.email,
                password: usuario.password,
                rol: 1 // Rol por defecto
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
                eneatipo: 1 // Valor por defecto
            }
        })
    });
}

// Manejar el envío del formulario de registro
$(document).ready(function() {
    $("#registroForm").on("submit", function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const email = $("#email").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();
        const nombre = $("#nombre").val();
        const apellido1 = $("#apellido1").val();
        const apellido2 = $("#apellido2").val();
        const fechaNacimiento = $("#fechaNacimiento").val();
        const genero = $("#genero").val();
        const tipoIdentificacion = $("#tipoIdentificacion").val();
        const identificacion = $("#identificacion").val();
        const estudios = $("#estudios").val();
        const facultad = $("#facultad").val();

        // Validaciones básicas
        if (!email || !password || !confirmPassword || !nombre || !apellido1 || !fechaNacimiento || 
            !genero || !tipoIdentificacion || !identificacion || !estudios || !facultad) {
            alert("Por favor, complete todos los campos obligatorios");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Crear objeto usuario
        const nuevoUsuario = {
            email: email,
            password: password,
            nombre: nombre,
            apellido1: apellido1,
            apellido2: apellido2,
            fechaNacimiento: fechaNacimiento,
            genero: genero,
            tipoIdentificacion: tipoIdentificacion,
            identificacion: identificacion,
            estudios: estudios,
            facultad: facultad
        };

        // Enviar registro
        registrarUsuario(nuevoUsuario)
            .done(function(response) {
                alert("Registro exitoso");
                window.location.href = "login.html";
            })
            .fail(function(error) {
                if (error.status === 409) {
                    alert("El email ya está registrado");
                } else {
                    alert("Error en el registro. Por favor, intente nuevamente.");
                }
            });
    });
});

// Ejemplo de uso:
// const nuevoUsuario = {
//     nombre: "Juan",
//     apellidos: "Pérez García",
//     email: "juan@ejemplo.com",
//     dni: "12345678A",
//     carrera: "Ingeniería Informática",
//     contrasena: "contraseña123"
// };
// 
// registrarUsuario(nuevoUsuario)
//     .done(function(response) {
//         console.log("Usuario registrado exitosamente:", response);
//     })
//     .fail(function(error) {
//         console.error("Error en el registro:", error);
//     });

$.get(API_URL + "usuario", function (response) {
    console.log(response);
    $("#resultado").text(JSON.stringify(response));
}).fail(function (error) {
    console.error("Error en la petición:", error);
});


