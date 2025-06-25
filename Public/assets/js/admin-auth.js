// Validación del formulario
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Reset errores
    resetErrors();
    
    // Obtener valores
    const formData = {
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        terms: document.getElementById('terms').checked,
        role: document.getElementById('role')?.value || 'admin'
    };

    // Validaciones
    let isValid = true;

    // Nombre
    if (formData.fullname.length < 3) {
        showError('fullname', 'Nombre demasiado corto');
        isValid = false;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showError('email', 'Email inválido');
        isValid = false;
    }

    // Contraseña
    if (formData.password.length < 8) {
        showError('password', 'Mínimo 8 caracteres');
        isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
        showError('password', 'Requiere una mayúscula');
        isValid = false;
    } else if (!/\d/.test(formData.password)) {
        showError('password', 'Requiere un número');
        isValid = false;
    }

    // Confirmación
    if (formData.password !== formData.confirmPassword) {
        showError('confirm-password', 'Las contraseñas no coinciden');
        isValid = false;
    }

    // Términos
    if (!formData.terms) {
        showError('terms', 'Debes aceptar los términos');
        isValid = false;
    }

    if (!isValid) return;

    // Mostrar loading
    toggleLoading(true);

    try {
        // Simulación de registro (reemplazar con fetch real)
        const response = await mockRegister(formData);
        
        // Redirigir al dashboard después del registro
        window.location.href = 'dashboard.html?newuser=true';
    } catch (error) {
        document.getElementById('errorMessage').textContent = error.message;
        document.getElementById('errorMessage').classList.remove('hidden');
    } finally {
        toggleLoading(false);
    }
});

// Funciones auxiliares
function resetErrors() {
    document.querySelectorAll('[id$="-error"]').forEach(el => {
        el.classList.add('hidden');
    });
    document.getElementById('errorMessage').classList.add('hidden');
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    input.classList.add('input-error');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function toggleLoading(loading) {
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('btnSpinner');
    
    if (loading) {
        btnText.textContent = 'Registrando...';
        spinner.classList.remove('hidden');
        document.getElementById('registerBtn').disabled = true;
    } else {
        btnText.textContent = 'Registrarse';
        spinner.classList.add('hidden');
        document.getElementById('registerBtn').disabled = false;
    }
}

// Mock de registro (eliminar en producción)
async function mockRegister(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userData.email.includes('exist@test.com')) {
                reject(new Error('El email ya está registrado'));
            } else {
                resolve({
                    success: true,
                    user: {
                        id: Math.floor(Math.random() * 1000),
                        ...userData,
                        password: undefined // Nunca retornar contraseña
                    }
                });
            }
        }, 1500);
    });
}
