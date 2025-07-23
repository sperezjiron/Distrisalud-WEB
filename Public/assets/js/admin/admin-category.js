let allCategories = [];

// Cargar categorías
async function loadCategories() {
  try { 
    const res = await fetch("http://localhost:3000/categories");
    if (!res.ok) throw new Error("Error en la carga de categorías");        
    allCategories = await res.json();
    console.log("Categorías cargadas:", allCategories);
    renderCategories(allCategories);
    }
    catch (error) {
    console.error("Error cargando categorías:", error);
    }
}

// Función para renderizar categorías en la tabla
function renderCategories(categories) {
  const tbody = document.querySelector('#categories tbody');
  tbody.innerHTML = ''; // limpiar tabla

  categories.forEach(cat => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${cat.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cat.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button class="text-primary hover:text-blue-700 mr-3" onclick="viewCategory(${cat.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-secondary hover:text-yellow-600" onclick="openCategoryModal(${cat.id})">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}



function searchCategory() {
   const term = document.getElementById('search-category').value.toLowerCase();
  const filtered = allCategories.filter(cat => cat.name.toLowerCase().includes(term));
  renderCategories(filtered);
}

/* Removed duplicate openCategoryModal definition */

// Inicializar
 document.addEventListener('DOMContentLoaded', () => {
    loadCategories(); // o loadClients(), loadProducts(), etc.
    renderCategories(allCategories);
  });

function openCategoryModal(categoryId = null) {
  const modalTitle = document.getElementById('category-modal-title');
  const nameInput = document.getElementById('category-name');
  const idInput = document.getElementById('category-id');

  if (!nameInput || !idInput) {
    console.error('Elementos del formulario no encontrados');
    return;
  }

  if (categoryId) {
    const cat = realCategories.find(c => c.id === categoryId);
    if (cat) {
      modalTitle.textContent = 'Editar Categoría';
      idInput.value = cat.id;
      nameInput.value = cat.name;
    }
  } else {
    modalTitle.textContent = 'Nueva Categoría';
    idInput.value = '';
    nameInput.value = '';
  }

  document.getElementById('category-modal').classList.remove('hidden');
}

function closeCategoryModal() {
  document.getElementById('category-modal').classList.add('hidden');
}

document.getElementById('category-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('category-id').value;
  const name = document.getElementById('category-name').value.trim();

  if (id) {
    // Editar
    const index = allCategories.findIndex(c => c.id == id);
    if (index !== -1) {
      allCategories[index].name = name;
    }
  } else {
    // Nuevo
    const newId = allCategories.length ? Math.max(...allCategories.map(c => c.id)) + 1 : 1;
    allCategories.push({ id: newId, name });
  }

  closeCategoryModal();
  renderCategories(allCategories);
});

// Función para mostrar detalles categoría
function viewCategory(categoryId) {
  const cat = allCategories.find(c => c.id === categoryId);
  if (!cat) return;

  openCategoryModal(categoryId);

}
