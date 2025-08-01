
//variables globales
let realOrders = [];
let realCustomers = [];

document.addEventListener('DOMContentLoaded', async function () {
  await loadCustomers();
  await loadOrders();
  
  renderOrders(realOrders);

  document.getElementById('filter-status').addEventListener('change', filterOrders);
  document.getElementById('search-order').addEventListener('input', searchOrder);
});

// Cargar pedidos y clientes desde el backend
async function loadCustomers() {
  try {
    const res = await fetch("http://localhost:3000/customers");
    if (!res.ok) throw new Error("Error en la carga de clientes");
    realCustomers = await res.json();
    console.log("Clientes cargados:", realCustomers);
  } catch (error) {
    console.error("Error cargando clientes:", error);
  }
}

// Cargar pedidos desde el backend
async function loadOrders() {
  try {
    const res = await fetch("http://localhost:3000/orders");
    if (!res.ok) throw new Error("Error en la carga de pedidos");
    realOrders = await res.json();
    console.log("Pedidos cargados:", realOrders);
  } catch (error) {
    console.error("Error cargando pedidos:", error);
  }
}

function renderOrders(realOrders = []) {

  const tbody = document.querySelector('#orders tbody');
  tbody.innerHTML = '';

  if (!realOrders || realOrders.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
        No hay pedidos para mostrar.
      </td>
    `;
    tbody.appendChild(row);
    return;
  }

  realOrders.forEach(order => {
    const customer = realCustomers.find(c => c.id === order.clientId);
    const customerName = customer ? customer.name : 'Desconocido';

    const estado = order.status?.toLowerCase() || 'desconocido';
    const estadoColor = {
      completado: 'green',
      pendiente: 'yellow',
      cancelado: 'red',
    }[estado] || 'gray';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${order.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customerName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(order.date)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡${parseFloat(order.totalAmount).toFixed(2)}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 py-1 text-xs rounded-full bg-${estadoColor}-100 text-${estadoColor}-800">
          ${capitalize(order.status)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button class="text-primary hover:text-blue-700 mr-3" onclick="viewOrder(${order.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-secondary hover:text-yellow-600" onclick="editOrder(${order.id})">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
    
  });
}
function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CR'); // O ajustalo al formato que necesites
}


// Función para buscar por texto
function searchOrder() {
  const query = document.getElementById('search-order').value.trim().toLowerCase();
  if (!query) {
    renderOrders(realOrders); // Si está vacío, mostrar todos
    return;
  }

  if (!realOrders.length || !realCustomers.length) {
    console.warn("No hay datos cargados aún");
    return;
  }

  const filteredOrders = realOrders.filter(order => {
    const customer = realCustomers.find(c => c.id === order.clientId);
    const customerName = customer ? customer.name.toLowerCase() : '';
    return (
      order.id.toString().includes(query) ||
      customerName.includes(query)
    );
  });

  console.log("Resultado búsqueda:", filteredOrders);
    renderOrders(filteredOrders);
}

// Función para filtrar por estado
function filterOrders() {
  const status = document.getElementById('filter-status').value.toLowerCase();

  if (!realOrders.length) {
    console.warn("No hay pedidos cargados");
    return;
  }

  if (!status) {
    renderOrders(realOrders);
    return;
  }

  const filtered = realOrders.filter(order => {
    return order.status && order.status.toLowerCase() === status;
  });

  console.log("Filtrado por estado:", filtered);
    renderOrders(filtered);
}


// Función para ver el detalle del pedido
function viewOrder(orderId) {
  const order = realOrders.find(o => o.id === orderId);
  if (!order) {
    console.error("Pedido no encontrado:", orderId);
    return;
  }

  const customer = realCustomers.find(c => c.id === order.clientId);
  const customerName = customer ? customer.name : 'Desconocido';
  const formattedDate = formatDate(order.date);
  const formattedTotal = `$${parseFloat(order.totalAmount).toFixed(2)}`;
  const formattedStatus = capitalize(order.status);

  const detailHTML = `
    <p><strong>ID:</strong> #${order.id}</p>
    <p><strong>Cliente:</strong> ${customerName}</p>
    <p><strong>Fecha:</strong> ${formattedDate}</p>
    <p><strong>Total:</strong> ${formattedTotal}</p>
    <p><strong>Estado:</strong> ${formattedStatus}</p>
  `;

  document.getElementById('order-detail-content').innerHTML = detailHTML;
  document.getElementById('order-detail-modal').classList.remove('hidden');
}


// Función para cerrar el modal
function closeOrderDetailModal() {
  document.getElementById('order-detail-modal').classList.add('hidden');
}

// Opcional: función placeholder para editar
// Función placeholder para editar un pedido
function editOrder(orderId) {
  const order = realOrders.find(o => o.id === orderId);
  if (!order) {
    alert(`No se encontró el pedido #${orderId}`);
    return;
  }

  // Rellenar los campos del formulario
  document.getElementById("edit-order-id").value = order.id;
  document.getElementById("edit-order-date").value = order.date;
  document.getElementById("edit-order-total").value = order.totalAmount;
  document.getElementById("edit-order-status").value = order.status.toLowerCase();

  // Mostrar el modal
  document.getElementById("edit-order-modal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("edit-order-modal").classList.add("hidden");
}

async function updateOrderStatus() {
  const orderId = document.getElementById("edit-order-id").value;
  const status = document.getElementById("edit-order-status").value;

  try {
    const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Error al actualizar:", err);
      throw new Error(err.message || "Error al actualizar el pedido");
    }

    alert("Estado del pedido actualizado correctamente.");
    closeEditModal();
    await loadOrders();
    renderOrders(realOrders);
  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo actualizar el pedido. Revisa los datos o el servidor.");
  }
}





