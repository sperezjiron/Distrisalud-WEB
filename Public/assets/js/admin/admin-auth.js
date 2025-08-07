
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

//iniciar sesión
async function handleLogin(event) {
  event.preventDefault();

  const emailOrUsernameInput = document.getElementById("login-id");
  const passwordInput = document.getElementById("password");

  if (!emailOrUsernameInput || !passwordInput) {
    Swal.fire({
      icon: "warning",
      title: "Campos requeridos",
      text: "No se encontraron los campos del formulario.",
    });
    return;
  }

  const loginValue = emailOrUsernameInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    // Autenticación con API
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: loginValue, pass: password }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "Verifica el nombre de usuario ingresado.",
        });
      } else if (response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
          text: "Verifica la contraseña e intenta de nuevo.",
        });
      } else if (response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "No tienes permisos para ingresar al sistema.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: "Hubo un problema al iniciar sesión.",
        });
      }
      return;
    }

    const data = await response.json();
    const user = data.user;

    // Guardar usuario en localStorage (sin contraseña)
    const userToStore = { ...user };
    delete userToStore.pass;
    localStorage.setItem("loggedUser", JSON.stringify(userToStore));

    // Redirigir al dashboard
    window.location.href = "/admin/";
  } catch (error) {
    console.error("Error en el login:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al intentar iniciar sesión.",
    });
  }
}





