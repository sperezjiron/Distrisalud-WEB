function searchPromotion() {
    const searchTerm = document.getElementById('search-promotion').value.toLowerCase();
    // Lógica para buscar promociones en la tabla
    console.log(`Buscando promociones que contengan: ${searchTerm}`);
}

function openPromotionModal(promotionId) {
    if (promotionId) {
        // Lógica para abrir el modal y cargar los datos de la promoción para editar
        console.log(`Editando promoción con ID: ${promotionId}`);
    } else {
        // Lógica para abrir el modal para agregar una nueva promoción
        console.log('Agregando nueva promoción');
    }
}
