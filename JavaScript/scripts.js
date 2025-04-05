// Script que se ejecuta al cargar completamente el DOM
document.addEventListener('DOMContentLoaded', function () {

    // ------------------ ELEMENTOS DEL DOM ------------------ //

    // Registro
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordMatch = document.getElementById('passwordMatch');

    // Login
    const loginPassword = document.getElementById('loginPassword');
    const loginTogglePassword = document.getElementById('loginTogglePassword');

    // ------------------ FUNCIONES ------------------ //

    /**
     * Alterna la visibilidad de la contraseña (texto/oculto)
     * @param {HTMLElement} input - El input de contraseña
     * @param {HTMLElement} button - El botón que contiene el icono
     */
    function togglePasswordVisibility(input, button) {
        if (!input || !button) return;

        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');

        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.toggle('bi-eye', !isPassword);
            icon.classList.toggle('bi-eye-slash', isPassword);
        }
    }

    /**
     * Valida si las contraseñas ingresadas coinciden y muestra un mensaje
     */
    function validarCoincidenciaPasswords() {
        if (!confirmPassword.value) {
            passwordMatch.textContent = '';
            return;
        }

        const coinciden = password.value === confirmPassword.value;
        passwordMatch.textContent = coinciden ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden';
        passwordMatch.style.color = coinciden ? 'green' : 'red';
    }

    // ------------------ EVENTOS ------------------ //

    // Ojos de visibilidad en formulario de registro
    if (togglePassword) togglePassword.addEventListener('click', () => togglePasswordVisibility(password, togglePassword));
    if (toggleConfirmPassword) toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPassword, toggleConfirmPassword));

    // Ojo de visibilidad en login
    if (loginTogglePassword) loginTogglePassword.addEventListener('click', () => togglePasswordVisibility(loginPassword, loginTogglePassword));

    // Validación de coincidencia de contraseñas en el registro
    if (password && confirmPassword && passwordMatch) {
        password.addEventListener('input', validarCoincidenciaPasswords);
        confirmPassword.addEventListener('input', validarCoincidenciaPasswords);
    }
});
