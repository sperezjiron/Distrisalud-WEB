let realRoles = [];

async function loadRoles() {
  try {
    const res = await fetch("http://localhost:3000/roles");
    if (!res.ok) throw new Error("Error en la carga de roles");
    realRoles = await res.json();
    console.log("Roles cargados:", realRoles);
    renderRoles(realRoles);
    }   
    catch (error) {
    console.error("Error cargando roles:", error);
    }
}

// Inicializar la carga de roles al cargar el documento
document.addEventListener('DOMContentLoaded', async function () {
  await loadRoles();
});

function searchRole() {
  const query = document.getElementById("search-role").value.toLowerCase();
  const filtered = realRoles.filter(r => r.nombre.toLowerCase().includes(query));
  renderRoles(filtered);
}

  //abre el modal para crear o editar un rol
function openRoleModal(id = null) {
  document.getElementById("role-modal-title").textContent = id ? "Editar Rol" : "Nuevo Rol";
  document.getElementById("role-id").value = id || "";
  document.getElementById("role-name").value = id ? (realRoles.find(r => r.id === id)?.nombre || "") : "";

  document.getElementById("role-name").removeAttribute("readonly");
  document.querySelector("#role-form button[type='submit']").classList.remove("hidden");

  document.getElementById("role-modal").classList.remove("hidden");
}

//cierra el modal y limpia el formulario
function closeRoleModal() {
  document.getElementById("role-form").reset();
  document.getElementById("role-modal").classList.add("hidden");
}



// Función para llenar el formulario de rol
function renderRoles(roles) {
    const tbody = document.querySelector("#roles tbody");
    tbody.innerHTML = "";

    roles.forEach(role => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${role.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${role.nombre}</td>
        
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <button class="text-primary hover:text-blue-700 mr-3" onclick="viewRole(${role.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="text-secondary hover:text-yellow-600" onclick="openRoleModal(${role.id})">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

//funcion para ver el rol
function viewRole(id) {
  const role = realRoles.find(r => r.id === id);
  if (!role) return;

  document.getElementById("role-modal-title").textContent = "Detalle del Rol";
  document.getElementById("role-id").value = role.id;
  document.getElementById("role-name").value = role.nombre;
  document.getElementById("role-name").setAttribute("readonly", "true");

  document.querySelector("#role-form button[type='submit']").classList.add("hidden");
  document.getElementById("role-modal").classList.remove("hidden");
}

async function saveRole() {
  const id = document.getElementById("role-id").value;
  const nombre = document.getElementById("role-name").value;

  if (!nombre.trim()) {
    alert("El nombre del rol no puede estar vacío.");
    return;
  }

  const data = { nombre };

  try {
    const url = id ? `http://localhost:3000/roles/${id}` : `http://localhost:3000/roles`;
    const method = id ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Error en respuesta:", errData);
      throw new Error(errData.message || "Error al guardar el rol");
    }

    alert(id ? "Rol actualizado correctamente." : "Rol creado correctamente.");
    closeRoleModal();
    await loadRoles(); // Recargar tabla
  } catch (err) {
    console.error("Error:", err);
    alert("Guardado ");
  }
}
