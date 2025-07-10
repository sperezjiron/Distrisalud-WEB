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
