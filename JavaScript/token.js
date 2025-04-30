function checkAuthentication() {
    const token = localStorage.getItem("token");

    if (!token) {
        const currentPath = window.location.pathname;
        window.location.href = "login.html";
        return;
    }

    // Verificar si el token es válido
    try {
        const decodedToken = decodeJWT(token);
        const currentTime = Date.now() / 1000; // Convertir a segundos

        if (decodedToken.exp < currentTime) {
            // Si el token ha expirado, redirigir al login
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error al verificar el token:", error);
        window.location.href = "login.html";
    }
}

// Función para decodificar el token JWT
function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Función para obtener el ID del usuario desde el token
function obtenerIdUsuario() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible");
        return null;
    }

    try {
        const decodedToken = decodeJWT(token);
        // El ID del usuario está en la claim NameIdentifier
        return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}
