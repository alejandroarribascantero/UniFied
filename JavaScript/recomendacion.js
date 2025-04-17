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
            alert("Solicitud de amistad enviada");
            // Recargar las recomendaciones para actualizar la vista
            cargarRecomendaciones();
        } else {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || "Error al enviar solicitud");
        }
    } catch (err) {
        console.error("Error:", err);
        alert(err.message || "Error al enviar la solicitud de amistad");
    }
}

// Cargar recomendaciones cuando el documento esté listo
document.addEventListener("DOMContentLoaded", cargarRecomendaciones);