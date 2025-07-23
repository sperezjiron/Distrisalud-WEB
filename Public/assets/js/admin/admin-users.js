let realUsers = [];
let allCustomers = [];
let realAdmins = [];
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

function searchAdmin() {
    const searchTerm = document.getElementById('search-admin').value.toLowerCase();
    // Lógica para buscar administradores en la tabla
    console.log(`Buscando administradores que contengan: ${searchTerm}`);
}

function openAdminModal(adminId) {
    if (adminId) {
        // Lógica para abrir el modal y cargar los datos del administrador para editar
        console.log(`Editando administrador con ID: ${adminId}`);
    } else {
        // Lógica para abrir el modal para agregar un nuevo administrador
        console.log('Agregando nuevo administrador');
    }
}


// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
    await loadAdmins();
    await cargaCustomers();

    renderClients(allCustomers);


});

// Renderiza los clientes en la tabla
function renderClients(clients) {
  const tbody = document.getElementById('clients-table-body');
  tbody.innerHTML = '';

  console.log("Rendering clients:", clients);

  clients.forEach(client => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
        client.id
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.name
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.cedula
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.tipoCedula
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.email
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.telefono
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.direccion
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.nombreNegocio
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
        client.tipoCliente
      }</td>
    <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                client.estado === "1" || client.estado === 1
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }">
                ${client.estado === "1" || client.estado === 1 ? "Activo" : "Inactivo"}
            </span>
            </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <button class="text-primary hover:text-blue-700 mr-3" onclick="viewClient(${
          client.id
        })">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-secondary hover:text-yellow-600" onclick="openClientModal(${
          client.id
        })">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Cargar clientes
async function cargaCustomers() {
  try {
    const res = await fetch("http://localhost:3000/customers");
    if (!res.ok) throw new Error("Error en la carga de clientes");
    allCustomers = await res.json();


    console.log("Clientes cargados desde users:", allCustomers);
  } catch (error) {
    console.error("Error cargando clientes:", error);
  }
}

async function loadAdmins() {
  try {
    const res = await fetch("http://localhost:3000/admins");
    if (!res.ok) throw new Error("Error en la carga de administradores");
    realAdmins = await res.json();
    console.log("RealAdmins:", realAdmins);
  } catch (error) {
    console.error("Error cargando administradores:", error);
  }
}   

// Abre el modal para editar o agregar un cliente
function openClientModal(clientId = null) {
 const modalTitle = document.getElementById('client-modal-title');
  const form = document.getElementById('client-form');
  const saveButton = document.getElementById('client-save-button');

  modalTitle.textContent = clientId ? 'Editar Cliente' : 'Nuevo Cliente';

  if (clientId) {
    const client = allCustomers.find(c => c.id === clientId);
    if (client) fillClientForm(client);
  } else {
    form.reset();
  }

  setClientFormReadOnly(false); // Habilita los campos
  document.getElementById('client-modal').classList.remove('hidden');
  saveButton.classList.remove('hidden');
}   

function fillClientForm(client) {
  document.getElementById('client-id').value = client.id;
  document.getElementById('client-name').value = client.name;
  document.getElementById('client-cedula').value = client.cedula;
  document.getElementById('client-tipo-cedula').value = client.tipoCedula;
  document.getElementById('client-email').value = client.email;
  document.getElementById('client-telefono').value = client.telefono;
  document.getElementById('client-direccion').value = client.direccion;
  document.getElementById('client-codigo-postal').value = client.codigoPostal;
  document.getElementById('client-nombre-negocio').value = client.nombreNegocio;
  document.getElementById('client-tipo-cliente').value = client.tipoCliente;
    const statusInput = document.getElementById('client-status');
    if (statusInput) {
    statusInput.value = client.estado.toString();
    }
  document.getElementById('client-fecha-creacion').value = client.fechaCreacion?.split('T')[0] || '';
  document.getElementById('client-fecha-ultimo-ingreso').value = client.fechaUltimoIngreso?.split('T')[0] || '';
}

function setClientFormReadOnly(readOnly = true) {
  const fields = document.querySelectorAll('#client-form input, #client-form textarea');
  fields.forEach(field => {
    field.readOnly = readOnly;
  });
}

function viewClient(clientId) {
  const client = allCustomers.find(c => c.id === clientId);
  if (!client) return;

  // Título del modal
  document.getElementById('client-modal-title').textContent = 'Detalle del Cliente';

  // Rellenar campos del formulario
  document.getElementById('client-id').value = client.id;
  document.getElementById('client-name').value = client.name || '';
  document.getElementById('client-cedula').value = client.cedula || '';
  document.getElementById('client-tipo-cedula').value = client.tipoCedula || '';
  document.getElementById('client-email').value = client.email || '';
  document.getElementById('client-telefono').value = client.telefono || '';
  document.getElementById('client-direccion').value = client.direccion || '';
  document.getElementById('client-codigo-postal').value = client.codigoPostal || '';
  document.getElementById('client-nombre-negocio').value = client.nombreNegocio || '';
  document.getElementById('client-tipo-cliente').value = client.tipoCliente || '';
  document.getElementById('client-status').value = client.estado || '';
  document.getElementById('client-fecha-creacion').value = client.fechaCreacion?.substring(0, 10) || '';
  document.getElementById('client-fecha-ultimo-ingreso').value = client.fechaUltimoIngreso?.substring(0, 10) || '';

  // Deshabilitar edición
  setClientFormReadOnly(true);

  // Ocultar botón Guardar
  document.getElementById('client-save-button').classList.add('hidden');

  // Mostrar modal
  document.getElementById('client-modal').classList.remove('hidden');
}

function closeClientModal() {
  const modal = document.getElementById('client-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function searchClient() {
  const searchTerm = document.getElementById('search-client').value.trim().toLowerCase();

  if (!searchTerm) {
    renderClients(allCustomers); // Si el input está vacío, muestra todos
    return;
  }

  const filtered = allCustomers.filter(client =>
    client.name.toLowerCase().includes(searchTerm) ||
    client.cedula.toLowerCase().includes(searchTerm)
  );

  renderClients(filtered);
}

//funcion para aplicar filtros en clientes
function applyClientFilters() {
  const nameFilter = document.getElementById('search-client-filter').value.toLowerCase();
  const tipoFilter = document.getElementById('filter-tipo-cliente').value;
  const estadoFilter = document.getElementById('filter-estado').value;

  const filteredClients = allCustomers.filter(client => {
    const matchName = nameFilter ? client.name.toLowerCase().includes(nameFilter) : true;
    const matchTipo = tipoFilter ? client.tipoCliente === tipoFilter : true;
    const matchEstado = estadoFilter !== '' ? client.estado == estadoFilter : true;
    return matchName && matchTipo && matchEstado;
  });

  renderClients(filteredClients);
}

