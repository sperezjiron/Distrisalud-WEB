let allCategories = [];
// Cargar categorías
async function loadCategories() {
  try { 
    const res = await fetch("http://localhost:3000/categories");
    if (!res.ok) throw new Error("Error en la carga de categorías");        
    allCategories = await res.json();
    console.log("Categorías cargadas:", allCategories);
    }
    catch (error) {
    console.error("Error cargando categorías:", error);
    }
}


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
