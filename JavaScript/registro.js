document.querySelector("#registroForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = document.querySelector("#email").value;
    const contrasena = document.querySelector("#password").value;
    const nombre = document.querySelector("#nombre").value;
    const apellido1 = document.querySelector("#apellido1").value;
    const apellido2 = document.querySelector("#apellido2").value;
    const fechaNacimiento = document.querySelector("#fechaNacimiento").value;
    const facultad = document.querySelector("#facultad").value;
    const curso = document.querySelector("#curso").value;
    const fotoPerfil = document.querySelector("#fotoPerfil").files[0];

    // Crear la ruta de la imagen
    const rutaImagen = `assets/perfiles/${correo}.jpg`;

    try {
        const res = await fetch("https://localhost:7134/api/auth/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Correo: correo,
                Contrasena: contrasena,
                Nombre: nombre,
                Apellido1: apellido1,
                Apellido2: apellido2,
                FechaNacimiento: new Date(fechaNacimiento).toISOString(),
                FacultadId: parseInt(facultad),
                Curso: curso,
                FotoPerfil: rutaImagen
            })
        });

        const data = await res.json();

        if (res.ok) {
            // Si el registro es exitoso, subir la imagen
            const formData = new FormData();
            formData.append('file', fotoPerfil);
            
            await fetch("https://localhost:7134/api/auth/subir-foto", {
                method: "POST",
                body: formData
            });

            console.log("Registro correcto");
            window.location.href = "testPersonalidad.html";
        } else {
            console.error("Error en registro:", data);
        }
    } catch (err) {
        console.error("Error de red:", err);
    }
});