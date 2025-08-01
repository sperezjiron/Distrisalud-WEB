let realOrders = [];
// Obtener el usuario conectado 
function getLoggedCustomer() {
  const userData = localStorage.getItem("loggedCustomer");
  if (userData) {
    try {
      return JSON.parse(userData);
      console.log("Usuario conectado:", userData);
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
async function getOrdersForLoggedCustomer(customer) {
  const RelatedOrders = await loadOrders();
  if (!customer) return [];
  console.log("Obteniendo pedidos para el cliente:", customer);
  console.log("RealOrders:", RelatedOrders);
  const customerOrders = realOrders.filter((order) => Number(order.clientId) === Number(customer.id));
  return customerOrders || [];
}


// Inicializar la carga de usuarios y clientes al cargar el documento
// Esto asegura que los datos estén disponibles antes de cualquier otra operación
function loadProfile() {
  const customer = getLoggedCustomer();
  if (customer) {
    console.log("Cliente relacionado:", customer);
    fillCustomerProfile(customer);
    loadUsername();
  }
};

async function loadCustomerOrders() {
  await loadOrders();
  const customer = getLoggedCustomer();
  if (customer) {
    const customerOrders = await getOrdersForLoggedCustomer(customer);
    console.log("Pedidos del cliente:", customerOrders);
    renderOrders(customerOrders);
    loadUsername();
  }
};

// Inicializar la carga de usuarios y clientes al cargar el documento
// Esto asegura que los datos estén disponibles antes de cualquier otra operación
function loadUsername() {
  const customer = getLoggedCustomer();
  const username = document.getElementById("user-name");
  const initials = document.getElementById("user-initials");
  
  if (customer) {
    console.log("Cliente relacionado:", customer);
    const nameParts = customer.name.split(" ");
    username.textContent = customer.name;
    initials.textContent = nameParts.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
};

// Renderizar los pedidos en la interfaz
// Esta función puede ser llamada después de cargar los pedidos 
function renderOrders(orders) {
  const container = document.getElementById("orders-container");
  container.innerHTML = ""; // Limpiar anterior

  if (orders.length === 0) {
    container.textContent = "No hay pedidos para mostrar.";
    return;
  }

  orders.forEach((order) => {
    const div = document.createElement("div");
    div.className =
      "order-card bg-white p-4 rounded-lg shadow-sm border border-gray-200";

    // Crear lista de productos en formato HTML
    //const productosHTML = order.items
      // .map(
      //   (item) =>
      //     `<li>${item.name} - ${item.quantity} x ₡${(item.price / 100).toFixed(
      //       2
      //     )}</li>`
      // )
      // .join("");

    // Insertar contenido
    div.innerHTML = `
      <h4 class="font-bold text-lg">Pedido #${order.id}</h4>
      <p class="text-gray-600">Fecha: ${new Date(order.date).toLocaleDateString()}</p>
      <p class="text-gray-600">Total: ₡${(order.totalAmount).toFixed(2)}</p>
      <p class="text-gray-600">Estado: ${order.status}</p>
      <a href="order-detail.html?id=${order.id}" class="mt-4 inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
        Ver Detalles
      </a>
    `;

    container.appendChild(div);
  });
}


// Cargar la sección de perfil del usuario
function fillCustomerProfile(customer) {
  console.log("Llenando formulario de perfil con:", customer);  
  if (!customer) return;

  const nameParts = customer.name.split(" ");
  const nombre = nameParts.slice(0, -1).join(" ");
  const apellido = nameParts.slice(-1).join(" ");

  document.getElementById("nombre").value = nombre || "";
  document.getElementById("apellido").value = apellido || "";
  document.getElementById("email").value = customer.email || "";
  document.getElementById("telefono").value = customer.telefono || "";
  document.getElementById("cedula").value = customer.cedula || "";
  document.getElementById("tipoCedula").value = customer.tipoCedula || "";
  document.getElementById("codigoPostal").value = customer.codigoPostal || "";
  document.getElementById("nombreNegocio").value = customer.nombreNegocio || "";
  document.getElementById("tipoCliente").value = customer.tipoCliente || "";
  document.getElementById("direccion").value = customer.direccion || "";
}

async function saveCustomerData(userId) {
  const customer = realCustomers.find((c) => c.userId === userId);
  if (!customer) return;

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

// Obtener el detalle de un pedido por ID
// Esta función puede ser llamada para mostrar detalles específicos de un pedido
async function getOrderDetail(orderId) {
  try {
    const response = await fetch(`http://localhost:3000/orders/${orderId}`);
    if (!response.ok) throw new Error("Pedido no encontrado");

    const order = await response.json();
    return order;
  } catch (error) {
    console.error("Error al cargar el detalle del pedido:", error);
    return null;
  }
}


function renderOrderDetails(order) {
  document.querySelector("h2").textContent = `Detalle del Pedido #${order.id}`;
  
  document.querySelector("#pedido-fecha").textContent = new Date(order.date).toLocaleDateString();
  document.querySelector("#pedido-metodo-pago").textContent = order.paymentMethod;
  document.querySelector("#pedido-envio").textContent = order.shippingMethod;
  document.querySelector("#pedido-estado").textContent = order.status;

  // Renderizar productos
  const container = document.getElementById("productos-pedido");
  container.innerHTML = ""; // Limpiar
  order.items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "py-4 flex flex-col md:flex-row";
    div.innerHTML = `
      <div class="flex-1">
        <h4 class="font-bold text-primary">${item.name}</h4>
        <div class="mt-2 flex justify-between items-center">
          <span class="text-gray-600">Cantidad: ${item.quantity}</span>
          <span class="font-bold text-primary">₡${(item.price / 100).toFixed(2)}</span>
        </div>
      </div>`;
    container.appendChild(div);
  });

  // Dirección de envío
  document.getElementById("pedido-nombre").textContent = order.customerName;
  document.getElementById("pedido-telefono").textContent = order.telefono;
  document.getElementById("pedido-direccion").textContent = order.direccion;

  // Resumen de pago
  document.getElementById("pedido-subtotal").textContent = `₡${(order.totalAmount / 100).toFixed(2)}`;
  document.getElementById("pedido-envio-pago").textContent = "₡0.00"; // si aplica
  document.getElementById("pedido-total").textContent = `₡${(order.totalAmount / 100).toFixed(2)}`;
}


document.getElementById('profile-section').addEventListener('submit', async (e) => {
    e.preventDefault();

    //recuperar el cliente actual
      const cliente = getLoggedCustomer();

    // Obtener valores del formulario
    const clienteData = {
      name: document.getElementById('nombre').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      cedula: document.getElementById('cedula').value.trim(),
      tipoCedula: document.getElementById('tipoCedula').value.trim(),
      codigoPostal: document.getElementById('codigoPostal').value.trim(),
      nombreNegocio: document.getElementById('nombreNegocio').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      // Nota: no se incluye email y tipoCliente porque están deshabilitados
    };

    try {
      const res = await fetch(`http://localhost:3000/customers/${cliente.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });

      if (!res.ok) throw new Error('No se pudo actualizar el cliente');

      alert('Datos actualizados con éxito');
      // Opcional: refrescar datos o redirigir
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la información del cliente');
    }
  });