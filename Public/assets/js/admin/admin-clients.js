function searchClient() {
    const searchTerm = document.getElementById('search-client').value.toLowerCase();
    // Lógica para buscar clientes en la tabla
    console.log(`Buscando clientes que contengan: ${searchTerm}`);
}

function openClientModal(clientId) {
    if (clientId) {
        // Lógica para abrir el modal y cargar los datos del cliente para editar
        console.log(`Editando cliente con ID: ${clientId}`);
    } else {
        // Lógica para abrir el modal para agregar un nuevo cliente
        console.log('Agregando nuevo cliente');
    }
}
