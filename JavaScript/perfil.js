document.addEventListener('DOMContentLoaded', function() {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Función para obtener los datos del usuario
    async function obtenerDatosUsuario() {
        try {
            const response = await fetch('https://localhost:7134/api/UserProfile/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }

            const data = await response.json();
            
            // Actualizar la información en el HTML
            document.querySelector('.rounded-circle').src = '../' + data.fotoPerfil || '../assets/logo.png';
            document.querySelector('h4 + p').textContent = data.nombreCompleto || 'No disponible';
            document.querySelector('h4:last-of-type + p').textContent = data.carrera || 'No disponible';
            document.querySelector('.resultadoPersonalidad').textContent = data.personalidad || 'No disponible';
            document.querySelector('.cajaBlanca:nth-child(2) img').src = '../' + data.imagenPersonalidad || '../assets/logo.png';

        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los datos del perfil');
        }
    }

    // Llamar a la función cuando la página cargue
    obtenerDatosUsuario();
});
