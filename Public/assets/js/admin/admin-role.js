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
