let realRoles = [];

async function loadRoles() {
  try {
    const res = await fetch("http://localhost:3000/roles");
    if (!res.ok) throw new Error("Error en la carga de roles");
    realRoles = await res.json();
    console.log("Roles cargados:", realRoles);
    }   
    catch (error) {
    console.error("Error cargando roles:", error);
    }
}


function searchRole() {
    const searchTerm = document.getElementById('search-role').value.toLowerCase();
    // Lógica para buscar roles en la tabla
    console.log(`Buscando roles que contengan: ${searchTerm}`);
}

function openRoleModal(roleId) {
    if (roleId) {
        // Lógica para abrir el modal y cargar los datos del rol para editar
        console.log(`Editando rol con ID: ${roleId}`);
    } else {
        // Lógica para abrir el modal para agregar un nuevo rol
        console.log('Agregando nuevo rol');
    }
}
