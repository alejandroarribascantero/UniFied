// Función para cargar los amigos
async function cargarAmigos() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        const res = await fetch("https://localhost:7134/api/Conexiones/amigos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error al cargar amigos");
        }

        const amigos = await res.json();
        mostrarAmigos(amigos);
    } catch (err) {
        console.error("Error:", err);
    }
}

// Función para mostrar los amigos en el HTML
function mostrarAmigos(amigos) {
    const contenedorAmigos = document.querySelector("#contenedorAmigos");
    contenedorAmigos.innerHTML = ""; // Limpiar contenedor

    if (amigos.length === 0) {
        contenedorAmigos.innerHTML = `
            <div class="text-center py-4">
                <p class="text-muted">No tienes amigos aún. ¡Conecta con otros estudiantes!</p>
            </div>
        `;
        return;
    }

    amigos.forEach(amigo => {
        const card = document.createElement("div");
        card.className = "card cardAmigo";
        card.innerHTML = `
            <div class="card-body text-center">
                <img src="../${amigo.imagenPerfilSolicitante}" class="card-img-top" alt="Foto de perfil">
                <h5 class="card-title mt-3">${amigo.nombreSolicitante} ${amigo.apellidoSolicitante}</h5>
                <p class="card-text">
                    <small class="text-muted">
                        ${amigo.facultad} - ${amigo.curso}
                    </small>
                </p>
                <div class="d-flex justify-content-center gap-2">
                    <button class="btnConectar" onclick="enviarMensaje(${amigo.usuarioId1}, ${amigo.usuarioId2})">
                        <img src="../assets/chat.svg" alt="Mensaje" class="icon"> Mensaje
                    </button>
                    <button class="btnConectar" onclick="verPerfil(${amigo.usuarioId1}, ${amigo.usuarioId2})">
                        <img src="../assets/person.svg" alt="Perfil" class="icon"> Perfil
                    </button>
                </div>
            </div>
        `;
        contenedorAmigos.appendChild(card);
    });
}

// Función para enviar mensaje a un amigo
function enviarMensaje(usuario1Id, usuario2Id) {
    // TODO: Implementar funcionalidad de mensajes
    console.log("Funcionalidad de mensajes en desarrollo");
}

// Función para ver el perfil de un amigo
function verPerfil(usuario1Id, usuario2Id) {
    // TODO: Implementar redirección al perfil del amigo
    console.log("Funcionalidad de perfil en desarrollo");
}

// Cargar amigos cuando el documento esté listo
document.addEventListener("DOMContentLoaded", cargarAmigos);
