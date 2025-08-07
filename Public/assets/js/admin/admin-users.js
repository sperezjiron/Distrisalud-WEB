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

function getUserNameById(userId) {
  const user = realUsers.find(u => u.id === userId);
  return user ? user.name : "Usuario no encontrado";
}

function searchAdmin() {
  const search = document.getElementById("search-admin").value.toLowerCase();
  const filtered = realAdmins.filter(admin => admin.nombre.toLowerCase().includes(search));
  renderAdmins(filtered);
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
    renderAdmins(realAdmins);
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

// 2. Renderizar administradores en la tabla
function renderAdmins(admins) {
  const tbody = document.getElementById("admins-table-body");
  tbody.innerHTML = "";

  admins.forEach(admin => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${admin.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${admin.nombre}</td>
     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${getUserNameById(admin.userId)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${admin.estado?.data[0] === 1 ? 'Activo' : 'Inactivo'}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button class="text-primary hover:text-blue-700 mr-3" onclick="viewAdmin(${admin.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-secondary hover:text-yellow-600" onclick="openAdminModal(${admin.id})">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 4. Abrir modal para crear/editar
async function openAdminModal(id = null) {
  const modalTitle = document.getElementById("admin-modal-title");
  const userIdContainer = document.getElementById("admin-user-id-container");
  const userIdSelect = document.getElementById("admin-user-id");

  // Mostrar modal y resetear
  document.getElementById("admin-save-button-container").classList.remove("hidden");
  document.getElementById("admin-form").reset();
  document.getElementById("admin-id").value = "";
  setAdminFormReadOnly(false);

  if (id) {
    // Editar administrador
    const admin = realAdmins.find(a => a.id === id);
    if (!admin) return;

    document.getElementById("admin-id").value = admin.id;
    document.getElementById("admin-name").value = admin.nombre;
    document.getElementById("admin-status").value = admin.estado?.data[0] === 1 ? "1" : "0";

    // Ocultar selección de usuario
    userIdContainer.classList.add("hidden");
    userIdSelect.required = false;

    modalTitle.textContent = "Editar Administrador";
  } else {
    // Crear nuevo administrador
    modalTitle.textContent = "Nuevo Administrador";

    // Mostrar selección de usuario y cargar usuarios disponibles
    userIdContainer.classList.remove("hidden");
    userIdSelect.required = true;

    await loadAvailableUsers();
  }

  document.getElementById("admin-modal").classList.remove("hidden");
}


// 5. Ver detalle en modo solo lectura
function viewAdmin(id) {
  const admin = realAdmins.find(a => a.id === id);
  if (!admin) return;

  document.getElementById("admin-id").value = admin.id;
  document.getElementById("admin-name").value = admin.nombre;
  document.getElementById("admin-user-id").value = admin.userId;
  document.getElementById("admin-status").value = admin.estado?.data[0] === 1 ? "1" : "0";
  document.getElementById("admin-modal-title").textContent = "Detalle del Administrador";

    // Ocultar botón Guardar
  document.getElementById("admin-save-button-container").classList.add("hidden");
  setAdminFormReadOnly(true);
  document.getElementById("admin-modal").classList.remove("hidden");
}
// 7. Cerrar modal
function closeAdminModal() {
  document.getElementById("admin-modal").classList.add("hidden");
}

// 8. Activar/desactivar solo lectura en formulario
function setAdminFormReadOnly(readonly) {
  const inputs = document.querySelectorAll("#admin-form input, #admin-form select");
  inputs.forEach(el => el.disabled = readonly);
}


async function saveAdmin() {
  const id = document.getElementById("admin-id").value;
  const name = document.getElementById("admin-name").value;
  const userId = document.getElementById("admin-user-id")?.value;
  let estado;

  if (id) {
    // Si está editando, toma el valor seleccionado
    estado = document.getElementById("admin-status").value === "1" ? 1 : 0;
  } else {
    // Si está creando, se asigna activo por defecto
    estado = 1;
  }

  const adminData = {
    nombre: name,
    estado: estado
  };

  if (!id && userId) {
    adminData.userId = parseInt(userId);
  }

  try {
    let response;

    if (id) {
      // PATCH (actualizar)
      response = await fetch(`http://localhost:3000/admins/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });
    } else {
      // POST (crear nuevo)
      response = await fetch(`http://localhost:3000/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });
    }

    if (!response.ok) throw new Error("Error al guardar administrador");

    closeAdminModal();
    await loadAdmins();
  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo guardar el administrador.");
  }
}



// 10. Cargar usuarios disponibles para asignar
async function loadAvailableUsers() {
  try {
    const res = await fetch("http://localhost:3000/users?rol=2");
    if (!res.ok) throw new Error("No se pudieron cargar los usuarios");

    const users = await res.json();
    const select = document.getElementById("admin-user-id");

    select.innerHTML = `<option value="">Seleccione un usuario</option>`;

    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `${user.id} (${user.name})`;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}

async function saveClient() {
  const clientId = document.getElementById("client-id").value;
  const name = document.getElementById("client-name").value;
  const cedula = document.getElementById("client-cedula").value;
  const tipoCedula = document.getElementById("client-tipo-cedula").value;
  const telefono = document.getElementById("client-telefono").value;
  const direccion = document.getElementById("client-direccion").value;
  const codigoPostal = document.getElementById("client-codigo-postal").value;
  const nombreNegocio = document.getElementById("client-nombre-negocio").value;
  const tipoCliente = document.getElementById("client-tipo-cliente").value;
  const estado = document.getElementById("client-status").value;
  const fechaCreacion = document.getElementById("client-fecha-creacion").value;
  const fechaUltimoIngreso = document.getElementById("client-fecha-ultimo-ingreso").value;

  if (!clientId) {
    alert("No se encontró el ID del cliente para actualizar.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/customers/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        cedula,
        tipoCedula,
        telefono,
        direccion,
        codigoPostal,
        nombreNegocio,
        tipoCliente,
        estado: parseInt(estado),
        fechaCreacion,
        fechaUltimoIngreso,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar cliente.");
    }

    await swal.fire({
      icon: "success",
      title: "Cliente actualizado",
      text: "El cliente se ha actualizado correctamente.",
    });
    
    closeClientModal();
    cargaCustomers(); // Asegurate de tener esta función para refrescar la lista
    // Recargar la tabla de clientes
    renderClients(allCustomers);
    //refresca la pagina
    window.location.reload();
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    alert("Error: " + error.message);
  }
}
