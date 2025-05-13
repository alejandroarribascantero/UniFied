//Cargar las recomendaciones y generar las cards de estos.

// Función para cargar las recomendaciones
async function cargarRecomendaciones() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        const res = await fetch("https://localhost:7134/api/recomendacion/usuarios", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error al cargar recomendaciones");
        }

        const recomendaciones = await res.json();
        mostrarRecomendaciones(recomendaciones);
    } catch (err) {
        console.error("Error:", err);
    }
}

// Función para mostrar las recomendaciones en el HTML
function mostrarRecomendaciones(recomendaciones) {
    const contenedorSugerencias = document.querySelector("#contenedorSugerenciasUsers");
    contenedorSugerencias.innerHTML = ""; // Limpiar contenedor

    recomendaciones.forEach(recomendacion => {
        console.log(recomendacion);
        const card = document.createElement("div");
        card.className = "card cardSugerencia";
        card.innerHTML = `
            <div class="card-title">${recomendacion.nombre}</div>
            <img src="../${recomendacion.imagenPerfil}" class="card-img-top" />
            <button class="btnConectar" data-usuario-id="${recomendacion.id}">Conectar</button>
        `;
        
        // Agregar el event listener al botón
        const botonConectar = card.querySelector('.btnConectar');
        botonConectar.addEventListener('click', () => conectarUsuario(botonConectar.dataset.usuarioId));
        
        contenedorSugerencias.appendChild(card);
    });
}

// Función para conectar con un usuario
async function conectarUsuario(usuarioId) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        // Obtener el ID del usuario actual usando la función obtenerIdUsuario
        const usuarioActualId = obtenerIdUsuario();
        if (!usuarioActualId) {
            throw new Error("No se pudo obtener el ID del usuario actual");
        }

        const res = await fetch("https://localhost:7134/api/Conexiones/enviar", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Usuario1Id: parseInt(usuarioActualId),
                Usuario2Id: parseInt(usuarioId)
            })
        });

        if (res.ok) {
            console.log("Solicitud de amistad enviada");
            // Recargar las recomendaciones para actualizar la vista
            cargarRecomendaciones();
        } else {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || "Error al enviar solicitud");
        }
    } catch (err) {
        console.error("Error:", err);
        console.log(err.message || "Error al enviar la solicitud de amistad");
    }
}

// Cargar recomendaciones cuando el documento esté listo
document.addEventListener("DOMContentLoaded", cargarRecomendaciones);

// Función para cargar las solicitudes pendientes
async function cargarSolicitudesPendientes() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        const res = await fetch("https://localhost:7134/api/Conexiones/pendientes", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error al cargar solicitudes pendientes");
        }

        const solicitudes = await res.json();
        mostrarSolicitudesPendientes(solicitudes);
    } catch (err) {
        console.error("Error:", err);
    }
}

// Función para mostrar las solicitudes pendientes en el HTML
function mostrarSolicitudesPendientes(solicitudes) {
    const contenedorSolicitudes = document.querySelector("#contenedorSolicitudes");
    contenedorSolicitudes.innerHTML = ""; // Limpiar contenedor

    solicitudes.forEach(solicitud => {
        const card = document.createElement("div");
        card.className = "card cardSugerencia";
        card.innerHTML = `
            <div class="card-title">${solicitud.nombreSolicitante} ${solicitud.apellidoSolicitante}</div>
            <img src="../${solicitud.imagenPerfilSolicitante}" class="card-img-top" />
            <div class="d-flex justify-content-center gap-2">
                <button class="btnConectar" onclick="aceptarSolicitud(${solicitud.usuarioId1}, ${solicitud.usuarioId2})">Aceptar</button>
                <button class="btnConectar" onclick="rechazarSolicitud(${solicitud.usuarioId1}, ${solicitud.usuarioId2})">Rechazar</button>
            </div>
        `;
        contenedorSolicitudes.appendChild(card);
    });
}

// Función para aceptar una solicitud
async function aceptarSolicitud(usuario1Id, usuario2Id) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        const res = await fetch("https://localhost:7134/api/Conexiones/aceptar", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Usuario1Id: usuario1Id,
                Usuario2Id: usuario2Id
            })
        });

        if (res.ok) {
            console.log("Solicitud aceptada correctamente");
            cargarSolicitudesPendientes(); // Recargar las solicitudes
        } else {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || "Error al aceptar solicitud");
        }
    } catch (err) {
        console.error("Error:", err);
        console.log(err.message || "Error al aceptar la solicitud");
    }
}

// Función para rechazar una solicitud
async function rechazarSolicitud(usuario1Id, usuario2Id) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        const res = await fetch("https://localhost:7134/api/Conexiones/rechazar", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Usuario1Id: usuario1Id,
                Usuario2Id: usuario2Id
            })
        });

        if (res.ok) {
            console.log("Solicitud rechazada correctamente");
            cargarSolicitudesPendientes(); // Recargar las solicitudes
        } else {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || "Error al rechazar solicitud");
        }
    } catch (err) {
        console.error("Error:", err);
        console.log(err.message || "Error al rechazar la solicitud");
    }
}

// Cargar solicitudes pendientes cuando el documento esté listo
document.addEventListener("DOMContentLoaded", cargarSolicitudesPendientes);