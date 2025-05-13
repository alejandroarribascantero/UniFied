let preguntas = [];
let grupoActual = 0;
const preguntasPorGrupo = 5;

// Función para guardar respuestas en localStorage
function guardarRespuesta(preguntaId, opcionElegida) {
    let respuestas = JSON.parse(localStorage.getItem('respuestasTest') || '{}');
    respuestas[preguntaId] = opcionElegida;
    localStorage.setItem('respuestasTest', JSON.stringify(respuestas));
}

// Función para obtener respuestas guardadas
function obtenerRespuestasGuardadas() {
    return JSON.parse(localStorage.getItem('respuestasTest') || '{}');
}

// Función para limpiar respuestas guardadas
function limpiarRespuestasGuardadas() {
    localStorage.removeItem('respuestasTest');
}

// Función para verificar si el test ya fue completado
function verificarTestCompletado() {
    return localStorage.getItem('testCompletado') === 'true';
}

// Función para marcar el test como completado
function marcarTestCompletado() {
    localStorage.setItem('testCompletado', 'true');
}

// Función para verificar si el usuario ya tiene personalidad
async function verificarPersonalidadAsignada() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return false;
    }

    try {
        const res = await fetch("https://localhost:7134/api/TestPersonalidad/verificar", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error al verificar personalidad");
        }

        const resultado = await res.json();
        return resultado.tienePersonalidad;
    } catch (err) {
        console.error("Error:", err);
        return false;
    }
}

async function cargarPreguntas() {
    // Verificar si el usuario ya tiene personalidad
    const tienePersonalidad = await verificarPersonalidadAsignada();
    if (tienePersonalidad) {
        window.location.href = 'inicio.html';
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        const res = await fetch("https://localhost:7134/api/TestPersonalidad/preguntas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error("Error al cargar preguntas");
        }

        preguntas = await res.json();
        mostrarGrupoPreguntas(0);
        actualizarBarraProgreso();
    } catch (err) {
        console.error("Error:", err);
    }
}

function mostrarGrupoPreguntas(grupo) {
    const contenedor = document.querySelector("#testContainer");
    contenedor.innerHTML = "";

    const formulario = document.createElement("form");
    formulario.id = "testForm";

    const inicio = grupo * preguntasPorGrupo;
    const fin = Math.min(inicio + preguntasPorGrupo, preguntas.length);
    const preguntasGrupo = preguntas.slice(inicio, fin);
    const respuestasGuardadas = obtenerRespuestasGuardadas();

    preguntasGrupo.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement("div");
        preguntaDiv.className = "pregunta card mb-4";
        
        const preguntaTexto = document.createElement("h3");
        preguntaTexto.className = "card-title p-3";
        preguntaTexto.textContent = `${inicio + index + 1}. ${pregunta.pregunta}`;
        preguntaDiv.appendChild(preguntaTexto);

        const opcionesDiv = document.createElement("div");
        opcionesDiv.className = "card-body";

        pregunta.opciones.forEach((opcion, opcionIndex) => {
            const opcionDiv = document.createElement("div");
            opcionDiv.className = "opcion form-check mb-2";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.className = "form-check-input";
            radio.name = `pregunta_${pregunta.id}`;
            radio.value = String.fromCharCode(65 + opcionIndex);
            radio.id = `pregunta_${pregunta.id}_opcion_${opcionIndex}`;
            
            // Marcar la opción si ya fue respondida
            if (respuestasGuardadas[pregunta.id] === String.fromCharCode(65 + opcionIndex)) {
                radio.checked = true;
            }

            // Agregar evento para guardar la respuesta
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    guardarRespuesta(pregunta.id, radio.value);
                }
            });

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = `pregunta_${pregunta.id}_opcion_${opcionIndex}`;
            label.textContent = opcion;

            opcionDiv.appendChild(radio);
            opcionDiv.appendChild(label);
            opcionesDiv.appendChild(opcionDiv);
        });

        preguntaDiv.appendChild(opcionesDiv);
        formulario.appendChild(preguntaDiv);
    });

    // Botones de navegación
    const navegacionDiv = document.createElement("div");
    navegacionDiv.className = "d-flex justify-content-between mt-4";

    if (grupo > 0) {
        const btnAnterior = document.createElement("button");
        btnAnterior.type = "button";
        btnAnterior.className = "btn btn-secondary";
        btnAnterior.textContent = "Anterior";
        btnAnterior.onclick = () => {
            grupoActual--;
            mostrarGrupoPreguntas(grupoActual);
            actualizarBarraProgreso();
        };
        navegacionDiv.appendChild(btnAnterior);
    }

    if (fin < preguntas.length) {
        const btnSiguiente = document.createElement("button");
        btnSiguiente.type = "button";
        btnSiguiente.className = "btn btn-primary";
        btnSiguiente.textContent = "Siguiente";
        btnSiguiente.onclick = () => {
            grupoActual++;
            mostrarGrupoPreguntas(grupoActual);
            actualizarBarraProgreso();
        };
        navegacionDiv.appendChild(btnSiguiente);
    } else {
        const btnEnviar = document.createElement("button");
        btnEnviar.type = "submit";
        btnEnviar.className = "btn btn-success";
        btnEnviar.textContent = "Enviar Test";
        navegacionDiv.appendChild(btnEnviar);
    }

    formulario.appendChild(navegacionDiv);
    contenedor.appendChild(formulario);

    // Evento para enviar respuestas
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        await enviarRespuestas();
    });
}

function actualizarBarraProgreso() {
    const progressBar = document.querySelector(".progress-bar");
    const totalGrupos = Math.ceil(preguntas.length / preguntasPorGrupo);
    const porcentaje = ((grupoActual + 1) / totalGrupos) * 100;
    progressBar.style.width = `${porcentaje}%`;
    progressBar.setAttribute("aria-valuenow", porcentaje);
}

async function enviarRespuestas() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    const userId = obtenerIdUsuario();
    if (!userId) {
        console.error("No se pudo obtener el ID del usuario del token");
        return;
    }

    const respuestasGuardadas = obtenerRespuestasGuardadas();
    const respuestas = {
        usuarioId: parseInt(userId),
        respuestas: []
    };

    // Verificar que todas las preguntas tengan respuesta
    const preguntasSinResponder = preguntas.filter(pregunta => !respuestasGuardadas[pregunta.id]);
    if (preguntasSinResponder.length > 0) {
        console.log(`Por favor, responde todas las preguntas. Faltan ${preguntasSinResponder.length} preguntas por responder.`);
        return;
    }

    // Convertir las respuestas al formato correcto
    preguntas.forEach(pregunta => {
        if (respuestasGuardadas[pregunta.id]) {
            respuestas.respuestas.push({
                preguntaId: parseInt(pregunta.id),
                opcionElegida: respuestasGuardadas[pregunta.id]
            });
        }
    });

    try {
        console.log('Enviando respuestas:', respuestas); // Para debugging
        const res = await fetch("https://localhost:7134/api/TestPersonalidad/responder", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respuestas)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.mensaje || `Error al enviar respuestas: ${res.status}`);
        }

        const resultado = await res.json();
        limpiarRespuestasGuardadas(); // Limpiar respuestas después de enviar exitosamente
        console.log("Test completado exitosamente");
        window.location.href = 'inicio.html'; // Redirigir a inicio
    } catch (err) {
        console.error("Error:", err);
        console.log("Error al enviar el test: " + err.message);
    }
}

// Iniciar el test cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarPreguntas);