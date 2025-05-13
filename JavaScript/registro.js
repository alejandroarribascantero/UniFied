document.querySelector("#registroForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Iniciando registro");

    const correo = document.querySelector("#email").value;
    const contrasena = document.querySelector("#password").value;
    const nombre = document.querySelector("#nombre").value;
    const apellido1 = document.querySelector("#apellido1").value;
    const apellido2 = document.querySelector("#apellido2").value;
    const fechaNacimiento = document.querySelector("#fechaNacimiento").value;
    const facultad = document.querySelector("#facultad").value;
    const curso = document.querySelector("#curso").value;
    const fotoPerfil = document.querySelector("#fotoPerfil").files[0];

    console.log("Datos recogidos");

    // Crear FormData para enviar los datos
    const formData = new FormData();
    formData.append("Correo", correo);
    formData.append("Contrasena", contrasena);
    formData.append("Nombre", nombre);
    formData.append("Apellido1", apellido1);
    formData.append("Apellido2", apellido2);
    formData.append("FechaNacimiento", new Date(fechaNacimiento).toISOString());
    formData.append("FacultadId", parseInt(facultad));
    formData.append("Curso", curso);
    formData.append("fotoPerfil", fotoPerfil);

    console.log("FormData creado");

    try {
        console.log("Intentando hacer fetch");
        console.log("URL:", "https://localhost:7134/api/auth/registro");
        console.log("Datos del formulario:", {
            correo,
            nombre,
            apellido1,
            apellido2,
            fechaNacimiento,
            facultad,
            curso,
            fotoPerfil: fotoPerfil ? fotoPerfil.name : "No hay imagen"
        });

        const res = await fetch("https://localhost:7134/api/auth/registro", {
            method: "POST",
            body: formData
        });
        
        console.log("Status:", res.status);
        console.log("Status Text:", res.statusText);
        
        const responseText = await res.text();
        console.log("Response Text:", responseText);

        if (res.ok) {
            console.log("Registro exitoso");
            window.location.href = "inicio.html";
        } else {
            console.log("Error en el registro: " + responseText);
            window.location.href = "inicio.html";
        }
    } catch (error) {
        window.location.href = "inicio.html";
        console.error("Error completo:", error);
        console.log("Error en la petición: " + error.message);
    }
});