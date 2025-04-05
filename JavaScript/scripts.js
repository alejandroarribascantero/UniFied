document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario de registro
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordMatch = document.getElementById('passwordMatch');

    // Elementos del formulario de login
    const loginPassword = document.getElementById('loginPassword');
    const loginTogglePassword = document.getElementById('loginTogglePassword');

    // Función para mostrar/ocultar contraseña
    function togglePasswordVisibility(input, button) {
        if (!input || !button) return;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        button.querySelector('i').classList.toggle('bi-eye');
        button.querySelector('i').classList.toggle('bi-eye-slash');
    }

    // Eventos para los botones de ojo en registro
    if (togglePassword) {
        togglePassword.addEventListener('click', () => togglePasswordVisibility(password, togglePassword));
    }
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPassword, toggleConfirmPassword));
    }

    // Eventos para los botones de ojo en login
    if (loginTogglePassword) {
        loginTogglePassword.addEventListener('click', () => togglePasswordVisibility(loginPassword, loginTogglePassword));
    }

    // Validación de coincidencia de contraseñas (solo para registro)
    if (password && confirmPassword && passwordMatch) {
        function validatePasswords() {
            if (confirmPassword.value === '') {
                passwordMatch.textContent = '';
                return;
            }
            if (password.value === confirmPassword.value) {
                passwordMatch.textContent = 'Las contraseñas coinciden';
                passwordMatch.style.color = 'green';
            } else {
                passwordMatch.textContent = 'Las contraseñas no coinciden';
                passwordMatch.style.color = 'red';
            }
        }

        password.addEventListener('input', validatePasswords);
        confirmPassword.addEventListener('input', validatePasswords);
    }
});