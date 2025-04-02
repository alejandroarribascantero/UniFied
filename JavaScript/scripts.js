document.addEventListener('DOMContentLoaded', function() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordMatch = document.getElementById('passwordMatch');

    // Función para mostrar/ocultar contraseña
    function togglePasswordVisibility(input, button) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        button.querySelector('i').classList.toggle('bi-eye');
        button.querySelector('i').classList.toggle('bi-eye-slash');
    }

    // Eventos para los botones de ojo
    togglePassword.addEventListener('click', () => togglePasswordVisibility(password, togglePassword));
    toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPassword, toggleConfirmPassword));

    // Validación de coincidencia de contraseñas
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
});