document.querySelector("#loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = document.querySelector("#email").value;
    const contrasena = document.querySelector("#loginPassword").value;

    try {
        const res = await fetch("https://localhost:7134/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Correo: correo,
                Contrasena: contrasena
            })
        });

        const data = await res.json();

        if (res.ok) {
            console.log("Login correcto");
            localStorage.setItem("token", data.token);
            console.log(data);
            if (data.tipoPersonalidadId == null) {
                window.location.href = "testPersonalidad.html";
            } else {
                window.location.href = "inicio.html";
            }

        } else {
            console.error("Error en login:", data);
        }
    } catch (err) {
        console.error("Error de red:", err);
    }
});