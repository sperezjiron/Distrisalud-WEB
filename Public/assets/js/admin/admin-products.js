// Estado global de productos
let realProducts = [];
let realCategories = [];
let currentPage = 1;
const itemsPerPage = 10;
let totalProducts = 0;

// Elementos del DOM
const productsTableBody = document.getElementById('products-table-body');
const productForm = document.getElementById('product-form');
const productModal = document.getElementById('product-modal');
const addProductBtn = document.getElementById('add-product-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelProductBtn = document.getElementById('cancel-product');
const searchInput = document.getElementById('search-products');
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');
const applyFiltersBtn = document.getElementById('apply-filters');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumbersContainer = document.getElementById('page-numbers');

// Cargar productos
async function loadProducts() {
   try {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) throw new Error("Error al cargar productos");

    const data = await response.json();
    realProducts = data;
    renderProducts(realProducts);
    console.log("Productos cargados:", realProducts);
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// Cargar categorías
async function loadCategories() {
  try {
    const response = await fetch('http://localhost:3000/categories'); // Ajusta si es necesario
    if (!response.ok) throw new Error("No se pudieron obtener las categorías");

    realCategories = await response.json();
    populateCategoryFilter(realCategories);
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}

function getCategoryNameById(id) {
  const category = realCategories.find(cat => cat.id === id);
  return category ? category.name : 'Sin categoría';
}


// Inicialización
document.addEventListener('DOMContentLoaded',() => {
     loadCategories();
     loadProducts();
    
     console.log("RealCategories:", realCategories);
     console.log("RealProducts:", realProducts);    

    const filterCategoryElem = document.getElementById('filter-category');
    if (filterCategoryElem) {
        filterCategoryElem.addEventListener('change', filterProducts);
    } else {
        console.warn("Elemento con id 'filter-category' no encontrado en el DOM.");
    }
});




// Renderizar tabla de productos
function renderProducts(products) {
  const tbody = document.querySelector('#products tbody');
  tbody.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('tr');
    const category = realCategories.find(c => c.id === product.categoryId);
    const categoryName = category ? category.name : 'Sin categoría';

    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.description}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${parseFloat(product.price).toFixed(2)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.unit}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <img src="${product.imageUrl || '/admin/assets/images/default-product.png'}" 
             alt="Imagen de ${product.name}" 
             class="w-12 h-12 object-cover rounded">
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.stock}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(product.entryDate)}</td>
     <td class="px-6 py-4 whitespace-nowrap">
  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
    ${getCategoryNameById(product.categoryId)}
  </span>
</td>

      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button class="text-primary hover:text-blue-700 mr-3" onclick="viewProduct(${product.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-secondary hover:text-yellow-600 mr-3" onclick="openProductModal(${product.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-danger hover:text-red-600" onclick="deleteProduct(${product.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}


// Configurar event listeners
function setupEventListeners() {
  // Modal
  addProductBtn.addEventListener("click", () => openModal("add"));
  closeModalBtn.addEventListener("click", closeModal);
  cancelProductBtn.addEventListener("click", closeModal);

  // Formulario
  productForm.addEventListener("submit", handleFormSubmit);

  // Filtros
  applyFiltersBtn.addEventListener("click", applyFilters);
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => openModal("add"));
  } else {
    console.warn("addProductBtn no encontrado");
  }

  // Paginación
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadProducts();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      loadProducts();
    }
  });

  // Búsqueda en tiempo real con debounce
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 1;
      loadProducts();
    }, 500);
  });
}

// Función para manejar el envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const productData = {
        id: document.getElementById('product-id').value,
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        sku: document.getElementById('product-sku').value,
        description: document.getElementById('product-description').value,
        active: document.getElementById('product-active').checked,
        image: document.getElementById('image-preview')?.querySelector('img')?.src || null
    };
    
    try {
      if (productData.id) {
        await updateProduct(productData);
        showToast("Producto actualizado con éxito", "success");
      } else {
        await createProduct(productData);
        showToast("Producto creado con éxito", "success");
      }

      closeModal();
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      showToast("Error al guardar el producto", "error");
    }
}

//funcion para ver el producto sin editar
function viewProduct(productId) {
  const product = realProducts.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modal-title').textContent = 'Detalle del Producto';
  fillProductForm(product);
  setFormReadOnly(true);
  document.getElementById('product-modal').classList.remove('hidden');
  document.getElementById('save-button').classList.add('hidden');

  // Mostrar vista previa de imagen
  const preview = document.getElementById('image-preview');
  if (product.imageUrl && preview?.querySelector('img')) {
    preview.querySelector('img').src = product.imageUrl;
    preview.classList.remove('hidden');
  } else if (preview) {
    preview.classList.add('hidden');
  }
}




// Funciones auxiliares
function openProductModal(productId = null) {
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('product-form');
  const saveButton = document.getElementById('save-button');
  const preview = document.getElementById('image-preview');
  const previewImg = preview.querySelector('img');

  modalTitle.textContent = productId ? 'Editar Producto' : 'Nuevo Producto';

  if (productId) {
    const product = realProducts.find(p => p.id === productId);
    if (product) {
      document.getElementById('product-id').value = product.id;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-description').value = product.description;
      document.getElementById('product-price').value = product.price;
      document.getElementById('product-stock').value = product.stock;
      document.getElementById('product-unit').value = product.unit;
      document.getElementById('product-image-url').value = product.imageUrl;

      const category = realCategories.find(c => c.id === product.categoryId);
      if (category) {
        document.getElementById('product-category').value = category.id;
      }

      if (product.imageUrl) {
        previewImg.src = product.imageUrl;
        preview.classList.remove('hidden');
      } else {
        preview.classList.add('hidden');
        previewImg.src = '';
      }
    }
  } else {
    form.reset();
    preview.classList.add('hidden');
    previewImg.src = '';
  }

  setFormReadOnly(false);
  document.getElementById('product-modal').classList.remove('hidden');
  saveButton.classList.remove('hidden');
}


function closeModal() {
    productModal.classList.add('hidden');
}
function setFormReadOnly(isReadOnly) {
  const fields = [
    'product-name', 'product-description', 'product-price',
    'product-unit', 'product-stock', 'product-image-url',
    'product-entry-date', 'product-category'
  ];
  fields.forEach(id => {
    const field = document.getElementById(id);
    if (isReadOnly) {
      field.setAttribute('readonly', true);
      field.setAttribute('disabled', true);
    } else {
      field.removeAttribute('readonly');
      field.removeAttribute('disabled');
    }
  });
}
function fillProductForm(product) {
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-unit').value = product.unit;
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-image-url').value = product.imageUrl || '';
  document.getElementById('product-entry-date').value = product.entryDate;
  document.getElementById('product-category').value = product.categoryId;
}
async function deleteProduct(productId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
  try {
    await fetch(`http://localhost:3000/products/${productId}`, {
      method: "DELETE"
    });
    showToast("Producto eliminado con éxito", "success");
    loadProducts();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    showToast("Error al eliminar el producto", "error");
  }
}

// Aplicar filtros
function applyFilters() {
    currentPage = 1;
    loadProducts();
}

// Funciones adicionales
function getCategoryColor(category) {
    const colors = {
        'Mieles': 'bg-yellow-100 text-yellow-800',
        'Tés e Infusiones': 'bg-green-100 text-green-800',
        'Semillas': 'bg-blue-100 text-blue-800',
        'Aceites Esenciales': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
}

function showToast(message, type = 'success') {
    // Implementar tu sistema de notificaciones
    console.log(`${type.toUpperCase()}: ${message}`);
}

function searchProduct() {
    const searchTerm = document.getElementById('search-product').value.toLowerCase();
    // Lógica para buscar productos en la tabla
    console.log(`Buscando productos que contengan: ${searchTerm}`);
}

function filterProducts() {
    const selectedCategoryId = document.getElementById('filter-category').value;

  if (!selectedCategoryId) {
    renderProducts(realProducts); // Mostrar todos
    return;
  }

  const filtered = realProducts.filter(product => product.categoryId.toString() === selectedCategoryId);
  renderProducts(filtered);
}

async function createProduct(product) {
  const response = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Error al crear producto");
  return await response.json();
}

async function updateProduct(product) {
  const response = await fetch(`http://localhost:3000/products/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Error al actualizar producto");
  return await response.json();
}

function populateCategoryFilter(categories) {
  const select = document.getElementById('filter-category');
  select.innerHTML = '<option value="">Filtrar por categoría</option>'; // opción por defecto

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}