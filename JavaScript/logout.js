function logout() {
    // Eliminar el token del localStorage
    localStorage.removeItem("token");
    
    // Redirigir al usuario a la página de login
    window.location.href = "login.html";
} 