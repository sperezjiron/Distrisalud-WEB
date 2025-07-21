let realUsers = [];
let allCustomers = [];
let realAdmins = [];

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
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadUsers();
    loadAdmins();
});

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
    allCustomers = await res.json();
    console.log("AllCustomers:", allCustomers);
  } catch (error) {
    console.error("Error cargando clientes:", error);
  }
}

// Cargar administradores
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