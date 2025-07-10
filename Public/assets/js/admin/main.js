function showSection(sectionId) {
  // Ocultar todas las secciones
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  // Mostrar la sección seleccionada
  document.getElementById(sectionId).classList.add("active");

  // Actualizar el título de la sección
  document.getElementById("section-title").innerText =
    sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

  // Marcar el enlace activo
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach((link) => link.classList.remove("active"));
  document
    .querySelector(`.sidebar-link[onclick*="${sectionId}"]`)
    .classList.add("active");

  // Cargar pedidos si la sección es "orders"
  if (sectionId === "orders") {
    loadOrders();
  }
}
async function loadClients() {
  try {
    const response = await fetch("/api/clients"); // Cambia la URL según tu API
    if (!response.ok) throw new Error("Error al cargar los clientes");

    const clients = await response.json();
    const clientSelect = document.getElementById("client-id");
    clientSelect.innerHTML = '<option value="">Selecciona un cliente</option>'; // Limpiar opciones
    clients.forEach((client) => {
      const option = document.createElement("option");
      option.value = client.id; // Asegúrate de que el ID del cliente esté disponible
      option.textContent = client.name; // Asegúrate de que el nombre del cliente esté disponible
      clientSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
// Función para cargar los registros
async function loadLogEntries() {
  try {
    const response = await fetch("/api/logs/recent?limit=10"); // Cambia la URL según tu API
    if (!response.ok) throw new Error("Error al cargar la bitácora");

    const logs = await response.json();
    renderLogs(logs);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("log-container").innerHTML = `
                    <div class="p-4 text-center text-red-500">
                        <i class="fas fa-exclamation-circle"></i> Error al cargar la bitácora
                    </div>
                `;
  }
}

// Función para renderizar los registros
function renderLogs(logs) {
  const container = document.getElementById("log-container");
  const template = document.getElementById("log-template");

  container.innerHTML = "";

  if (logs.length === 0) {
    container.innerHTML = `
                    <div class="p-4 text-center text-gray-500">
                        No hay actividades recientes
                    </div>
                `;
    return;
  }

  logs.forEach((log) => {
    const clone = template.content.cloneNode(true);
    const entry = clone.querySelector("div");

    // Configuración según el tipo de log
    const typeConfig = getLogTypeConfig(log.type);

    // Rellenar la plantilla
    entry.querySelector(
      ".log-type-icon"
    ).className = `log-type-icon ${typeConfig.icon}`;
    entry.querySelector(".log-icon").classList.add(typeConfig.bgColor);
    entry.querySelector(".log-action").textContent = log.action;
    entry.querySelector(".log-user").textContent = `Usuario: ${
      log.username || "Sistema"
    }`;
    entry.querySelector(".log-details").textContent = `${formatTime(
      log.timestamp
    )} - ${log.details}`;

    const statusEl = entry.querySelector(".log-status");
    statusEl.textContent = log.status;
    statusEl.classList.add(typeConfig.statusColor);

    container.appendChild(clone);
  });
}
let currentOrderId = null; // Para rastrear el ID del pedido actual
//funcion de open order modal esto inicia el modal para agregar o editar un pedido
function openOrderModal(orderId = null) {
  const modal = document.getElementById("order-modal");
  const title = document.getElementById("modal-title");

  if (orderId) {
    // Editar pedido
    title.textContent = "Editar Pedido";
    currentOrderId = orderId;
    const order = getOrderById(orderId); // Implementa esta función para obtener el pedido
    document.getElementById("client-id").value = order.clientId; // Asegúrate de que el ID del cliente esté disponible
    document.getElementById("order-date").value = order.date;
    document.getElementById("total").value = order.total;
    document.getElementById("status").value = order.status;
  } else {
    // Nuevo pedido
    title.textContent = "Nuevo Pedido";
    currentOrderId = null;
    document.getElementById("order-form").reset();
  }

  loadClients(); // Cargar clientes al abrir el modal
  modal.classList.remove("hidden");
}

function closeOrderModal() {
  document.getElementById("order-modal").classList.add("hidden");
}
//funcion para guardar un pedido
function saveOrder() {
  const clientId = document.getElementById("client-id").value;
  const orderDate = document.getElementById("order-date").value;
  const total = document.getElementById("total").value;
  const status = document.getElementById("status").value;

  if (currentOrderId) {
    // Lógica para editar un pedido existente
    updateOrder(currentOrderId, { clientId, orderDate, total, status });
  } else {
    // Lógica para crear un nuevo pedido
    createOrder({ clientId, orderDate, total, status });
  }

  closeOrderModal();
  loadOrders(); // Recargar la lista de pedidos
}

// Función para obtener un pedido por ID (simulada)
let orders = []; // Array para almacenar los pedidos

function loadOrders() {
  // Aquí deberías cargar los pedidos desde tu backend
  // Por ahora, vamos a simular algunos pedidos
  orders = [
    {
      id: 1001,
      clientName: "María González",
      date: "2023-05-15",
      total: 45.99,
      status: "completado",
    },
    // Agrega más pedidos simulados si es necesario
  ];
  renderOrders();
}

function renderOrders() {
  const tbody = document.querySelector("#orders tbody");
  tbody.innerHTML = ""; // Limpiar la tabla

  orders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
                          order.id
                        }</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                          order.clientName
                        }</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                          order.date
                        }</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${
                          order.total
                        }</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs rounded-full ${
                              order.status === "completado"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }">${
      order.status.charAt(0).toUpperCase() + order.status.slice(1)
    }</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button class="text-primary hover:text-blue-700 mr-3" onclick="openOrderModal(${
                              order.id
                            })">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="text-secondary hover:text-yellow-600" onclick="deleteOrder(${
                              order.id
                            })">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
    tbody.appendChild(row);
  });
}

function createOrder(order) {
  const newId = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1001; // Generar un nuevo ID
  orders.push({ id: newId, ...order });
}

function updateOrder(orderId, updatedOrder) {
  const index = orders.findIndex((order) => order.id === orderId);
  if (index !== -1) {
    orders[index] = { id: orderId, ...updatedOrder };
  }
}

function deleteOrder(orderId) {
  orders = orders.filter((order) => order.id !== orderId);
  renderOrders(); // Volver a renderizar la tabla
}
// Función para abrir el modal de productos-----------------------------------------------------
let currentProductId = null; // Para rastrear el ID del producto actual

function openProductModal(productId = null) {
  const modal = document.getElementById("product-modal");
  const title = document.getElementById("modal-title");

  if (productId) {
    // Editar producto
    title.textContent = "Editar Producto";
    currentProductId = productId;
    const product = getProductById(productId); // Implementa esta función para obtener el producto
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-unit").value = product.unit;
    document.getElementById("product-stock").value = product.stock;
    document.getElementById("product-image-url").value = product.imageUrl;
  } else {
    // Nuevo producto
    title.textContent = "Nuevo Producto";
    currentProductId = null;
    document.getElementById("product-form").reset();
  }

  modal.classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("product-modal").classList.add("hidden");
}

function saveProduct() {
  const name = document.getElementById("product-name").value;
  const description = document.getElementById("product-description").value;
  const price = document.getElementById("product-price").value;
  const unit = document.getElementById("product-unit").value;
  const stock = document.getElementById("product-stock").value;
  const imageUrl = document.getElementById("product-image-url").value;

  if (currentProductId) {
    // Lógica para editar un producto existente
    updateProduct(currentProductId, {
      name,
      description,
      price,
      unit,
      stock,
      imageUrl,
    });
  } else {
    // Lógica para crear un nuevo producto
    createProduct({ name, description, price, unit, stock, imageUrl });
  }

  closeProductModal();
  loadProducts(); // Recargar la lista de productos
}
function viewProduct(productId) {
  const product = getProductById(productId); // Implementa esta función para obtener el producto
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-description").value = product.description;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-unit").value = product.unit;
  document.getElementById("product-stock").value = product.stock;
  document.getElementById("product-image-url").value = product.imageUrl;

  // Cambiar el título del modal
  document.getElementById("modal-title").textContent = "Ver Producto";

  // Ocultar el botón de guardar
  document.getElementById("save-button").classList.add("hidden");

  // Hacer los campos de entrada de solo lectura
  const inputs = document.querySelectorAll(
    "#product-form input, #product-form textarea"
  );
  inputs.forEach((input) => input.setAttribute("readonly", true));

  // Mostrar el modal
  document.getElementById("product-modal").classList.remove("hidden");
}
let products = []; // Array para almacenar los productos

function loadProducts() {
  // Aquí deberías cargar los productos desde tu backend
  // Por ahora, vamos a simular algunos productos
  products = [
    {
      id: 1,
      name: "Miel Orgánica",
      description: "Miel pura y natural.",
      price: 10.0,
      unit: "Botella",
      stock: 50,
      imageUrl: "https://example.com/miel.jpg",
    },
    // Agrega más productos simulados si es necesario
  ];
  renderProducts();
}
// funcion de render de los productos
function renderProducts() {
  const tbody = document.querySelector("#products tbody");
  tbody.innerHTML = ""; // Limpiar la tabla

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.description}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${product.price}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.unit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.stock}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-primary hover:text-blue-700 mr-3" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="text-secondary hover:text-yellow-600" onclick="openProductModal(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-danger hover:text-red-600" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function getProductById(productId) {
  return products.find((product) => product.id === productId);
}

