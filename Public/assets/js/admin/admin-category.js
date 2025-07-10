function searchCategory() {
    const searchTerm = document.getElementById('search-category').value.toLowerCase();
    // Lógica para buscar categorías en la tabla
    console.log(`Buscando categorías que contengan: ${searchTerm}`);
}

function openCategoryModal(categoryId) {
    if (categoryId) {
        // Lógica para abrir el modal y cargar los datos de la categoría para editar
        console.log(`Editando categoría con ID: ${categoryId}`);
    } else {
        // Lógica para abrir el modal para agregar una nueva categoría
        console.log('Agregando nueva categoría');
    }
}
