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
  return realCustomers.find(c => c.userId === userId);
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
  // Cargar usuarios y clientes si no están cargados
  if (!realUsers.length || !realCustomers.length) {
    await loadUsers();
    await loadCustomers();
  }
  // Buscar usuario
  const user = realUsers.find(
   u => (u.name === loginValue) && u.pass === password 
  );
  if (!user) {
    alert("Correo o contraseña incorrectos.");
    return;
  }
  const customer = getCustomerByUserId(user.id);
  // Guardar en localStorage
  localStorage.setItem("loggedUser ", JSON.stringify(user));
  if (customer) {
    localStorage.setItem("loggedCustomer", JSON.stringify(customer));
    
  }
  // Redirigir a la página del cliente
  window.location.href = "/client/index.html";
}

// Escuchar el formulario
document.addEventListener("DOMContentLoaded", async () => {
  await loadUsers();
  await loadCustomers();
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", handleLogin);
});

