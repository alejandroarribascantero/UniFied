API_URL = 'https://localhost:7221/api/';

// Función para registrar un nuevo usuario
function registrarUsuario(usuario) {
    return $.ajax({
        url: API_URL + "usuario/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            dni: usuario.dni,
            carrera: usuario.carrera,
            contrasena: usuario.contrasena
        })
    });
}

// Manejar el envío del formulario de registro
$(document).ready(function() {
    $("#registroForm").on("submit", function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const nombre = $("#Nombre").val();
        const apellidos = $("#Apellidos").val();
        const email = $("#Emaiil").val(); // Nota: hay un typo en el ID del HTML
        const dni = $("#DNI").val();
        const carrera = $("#Carrera").val();
        const contrasena = $("#Contrasena").val();
        const repiteContrasena = $("#RepiteContrasena").val();

        // Validaciones básicas
        if (!nombre || !apellidos || !email || !dni || !carrera || !contrasena || !repiteContrasena) {
            alert("Por favor, complete todos los campos");
            return;
        }

        if (contrasena !== repiteContrasena) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Crear objeto usuario
        const nuevoUsuario = {
            nombre: nombre,
            apellidos: apellidos,
            email: email,
            dni: dni,
            carrera: carrera,
            contrasena: contrasena
        };

        // Enviar registro
        registrarUsuario(nuevoUsuario)
            .done(function(response) {
                alert("Registro exitoso");
                // Redirigir a la página de test de personalidad
                window.location.href = "test.html";
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


