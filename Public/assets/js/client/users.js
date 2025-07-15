let realUsers = []; // Variable para almacenar los usuarios cargados
let realCustomers = []; // Variable para almacenar los clientes cargados
let realOrders = [];

//función para cargar los datos del backend
async function loadUsers() {
  try {
    const response = await fetch("http://localhost:3000/Users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    realUsers = data; // Guardar los productos cargados
    console.log("RealUsers:", realUsers);
    return data;
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

//función para cargar los datos del backend
async function loadCustomers() {
  try {
    const response = await fetch("http://localhost:3000/customers");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    realCustomers = data; // Guardar los productos cargados
    console.log("RealCustomers:", realCustomers);
    return data;
  } catch (error) {
    console.error("Error loading customers:", error);
  }
}

// Al iniciar sesión exitosamente
localStorage.setItem("loggedUser", JSON.stringify(user));

// Obtener el usuario conectado 
function getLoggedUser() {
  const userData = localStorage.getItem("loggedUser");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error("Error parsing logged user data:", e);
      return null;
    }
  }
  return null;
}

// Cargar pedidos desde el backend
// Esta función se puede llamar en cualquier parte del código donde necesite los pedidos
async function loadOrders() {
  try {
    const response = await fetch("http://localhost:3000/orders");
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    realOrders = data;
    console.log("RealOrders:", realOrders);
    return data;
  } catch (error) {
    console.error("Error loading orders:", error);
  }
}

// Cargar pedidos al iniciar la página
function getOrdersForLoggedCustomer() {
  const customer = getCustomerForLoggedUser(); // función que te pasé antes
  if (!customer) return [];
  
  return realOrders.filter(order => order.customerId === customer.id);
}

// Obtener el cliente relacionado con el usuario conectado
// Asumiendo que cada cliente tiene un campo userId que corresponde al id del usuario 
function getCustomerForLoggedUser() {
  const user = getLoggedUser();
  if (!user) return null;
  return realCustomers.find((customer) => customer.userId === user.id);
}

// Inicializar la carga de usuarios y clientes al cargar el documento
// Esto asegura que los datos estén disponibles antes de cualquier otra operación
document.addEventListener("DOMContentLoaded", async () => {
  await loadUsers();
  await loadCustomers();
  await loadOrders();

  const user = getLoggedUser();
  const customer = getCustomerForLoggedUser();

  if (user) {
    console.log("Usuario conectado:", user);
  }

  if (customer) {
    console.log("Cliente relacionado:", customer);
    fillCustomerProfile(customer);

    const customerOrders = getOrdersForLoggedCustomer();
    console.log("Pedidos del cliente:", customerOrders);
    renderOrders(customerOrders);
  }
});

// Verificar si el usuario está autenticado
function verificarLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/login.html";
  }
}

// Renderizar los pedidos en la interfaz
// Esta función puede ser llamada después de cargar los pedidos 
function renderOrders(orders) {
  const container = document.getElementById("orders-container");
  container.innerHTML = ""; // Limpiar

  if (orders.length === 0) {
    container.textContent = "No hay pedidos para mostrar.";
    return;
  }

  orders.forEach(order => {
    const div = document.createElement("div");
    div.className = "order-card p-4 mb-4 border rounded shadow";

    div.innerHTML = `
      <h3>Pedido #${order.id}</h3>
      <p>Fecha: ${new Date(order.date).toLocaleDateString()}</p>
      <p>Total: ₡${order.totalAmount}</p>
      <p>Estado: ${order.status}</p>
    `;

    container.appendChild(div);
  });
}

// Función para renderizar los clientes en la interfaz
function renderAccountSidebar(user) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  document.querySelector(
    ".account-tab ~ .flex.items-center span"
  ).textContent = user.name;

  document.querySelector(
    ".account-tab ~ .flex.items-center .w-10"
  ).textContent = initials;
}

// Cargar la sección de perfil del usuario
function fillProfileForm(user) {
  const cliente = realCustomers.find((c) => c.userId === user.id);
  if (!cliente) return;

  const nameParts = cliente.name.split(" ");
  const nombre = nameParts.slice(0, -1).join(" ");
  const apellido = nameParts.slice(-1).join(" ");

  document.getElementById("nombre").value = nombre || "";
  document.getElementById("apellido").value = apellido || "";
  document.getElementById("email").value = cliente.email || "";
  document.getElementById("telefono").value = cliente.telefono || "";
  document.getElementById("cedula").value = cliente.cedula || "";
  document.getElementById("tipoCedula").value = cliente.tipoCedula || "";
  document.getElementById("codigoPostal").value = cliente.codigoPostal || "";
  document.getElementById("nombreNegocio").value = cliente.nombreNegocio || "";
  document.getElementById("tipoCliente").value = cliente.tipoCliente || "";
  document.getElementById("direccion").value = cliente.direccion || "";
}

async function saveCustomerData(userId) {
  const cliente = realCustomers.find((c) => c.userId === userId);
  if (!cliente) return;

  const updatedData = {
    id: cliente.id,
    userId: cliente.userId,
    name: `${document.getElementById("nombre").value} ${document.getElementById("apellido").value}`,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    cedula: document.getElementById("cedula").value,
    tipoCedula: document.getElementById("tipoCedula").value,
    codigoPostal: document.getElementById("codigoPostal").value,
    nombreNegocio: document.getElementById("nombreNegocio").value,
    tipoCliente: document.getElementById("tipoCliente").value,
    direccion: document.getElementById("direccion").value,
    estado: cliente.estado,
    fechaCreacion: cliente.fechaCreacion,
    fechaUltimoIngreso: cliente.fechaUltimoIngreso,
  };

  try {
    const response = await fetch(`http://localhost:3000/customers/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Error al guardar los cambios");

    alert("Cambios guardados exitosamente");
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    alert("Ocurrió un error al guardar los cambios");
  }
}
