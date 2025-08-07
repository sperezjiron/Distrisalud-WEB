let realUsers = [];
let realCustomers = [];
// Cargar usuarios
async function loadUsers() {
  try {
    const res = await fetch("http://localhost:3000/Users");
    if (!res.ok) throw new Error("Error en la carga de usuarios");
    realUsers = await res.json();
    console.log("RealUsers:", realUsers);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}
// Cargar clientes
async function loadCustomers() {
  try {
    const res = await fetch("http://localhost:3000/customers");
    if (!res.ok) throw new Error("Error en la carga de clientes");
    realCustomers = await res.json();
    console.log("RealCustomers:", realCustomers);
  } catch (error) {
    console.error("Error cargando clientes:", error);
  }
}

// Obtener cliente relacionado
function getCustomerByUserId(userId) {
  return realCustomers.find((c) => c.userId === userId);
}

// Función del login
async function handleLogin(event) {
  event.preventDefault();

  const emailOrUsernameInput = document.getElementById("login-id");
  const passwordInput = document.getElementById("password");

  if (!emailOrUsernameInput || !passwordInput) {
    alert("No se encontraron los campos del formulario.");
    return;
  }

  const loginValue = emailOrUsernameInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    // 1. Autenticar con API
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: loginValue,
        pass: password,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        alert("Usuario no encontrado.");
      } else if (response.status === 401) {
        alert("Contraseña incorrecta.");
      } else {
        alert("Error al iniciar sesión.");
      }
      return;
    }

    const data = await response.json();
    const user = data.user;

    // 2. Buscar el cliente asociado (GET /customers)
    const customersRes = await fetch("http://localhost:3000/customers");
    const customers = await customersRes.json();
    const customer = customers.find((c) => c.userId === user.id);

    if (customer && parseInt(customer.estado) !== 1) {
  await Swal.fire({
    icon: 'warning',
    title: 'Cuenta inactiva',
    text: 'Su cuenta está inactiva. Por favor comuníquese con Distrisalud para más información.',
    confirmButtonColor: '#d33',
    confirmButtonText: 'Entendido'
  });
  return;
}


    // 3. Guardar en localStorage (sin la contraseña)
    const userToStore = { ...user };
    delete userToStore.pass;

    localStorage.setItem("loggedUser", JSON.stringify(userToStore));

    if (customer) {
      localStorage.setItem("loggedCustomer", JSON.stringify(customer));
    }

    // 4. Redirigir
    window.location.href = "/";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Ocurrió un error al intentar iniciar sesión.");
  }
}

// Escuchar el formulario
document.addEventListener("DOMContentLoaded", async () => {
  await loadUsers();
  await loadCustomers();
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", handleLogin);
});
