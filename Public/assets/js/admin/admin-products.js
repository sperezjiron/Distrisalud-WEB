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
async function cargaCategories() {
  try {
    const response = await fetch('http://localhost:3000/categories'); // Ajusta si es necesario
    if (!response.ok) throw new Error("No se pudieron obtener las categorías");

    realCategories = await response.json();
    console.log("Categorías cargadas:", realCategories);
    populateCategoryFilter(realCategories);
    populateCategorySelect(realCategories);
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}

function getCategoryNameById(id) {
  const category = realCategories.find(cat => cat.id === id);
  return category ? category.name : 'Sin categoría';
}


// Inicialización
document.addEventListener('DOMContentLoaded',async () => {
    await cargaCategories();
    loadProducts();
     

   setupEventListeners();
   document.getElementById('search-product').addEventListener('input', searchProduct);
    const filterCategoryElem = document.getElementById('filter-category');
    if (filterCategoryElem) {
        filterCategoryElem.addEventListener('change', filterProducts);
    } else {
        console.warn("Elemento con id 'filter-category' no encontrado en el DOM.");
    }
});




// Renderizar tabla de productos
function renderProducts(realProducts) {
  const tbody = document.querySelector('#products tbody');
  tbody.innerHTML = '';

  realProducts.forEach(product => {
    const row = document.createElement('tr');
    const category = realCategories.find(c => c.id === product.categoryId);
    const categoryName = category ? category.name : 'Sin categoría';

    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.description}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡${parseFloat(product.price).toFixed(2)}</td>
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


function setupEventListeners() {
  // Modal
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => openProductModal()); // CORREGIDO
  } else {
    console.warn("addProductBtn no encontrado");
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (cancelProductBtn) cancelProductBtn.addEventListener("click", closeModal);

  document.getElementById('product-form').addEventListener('submit', handleFormSubmit);


  // Filtros
  if (applyFiltersBtn) applyFiltersBtn.addEventListener("click", applyFilters);

  // Paginación
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        loadProducts();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(totalProducts / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        loadProducts();
      }
    });
  }

  // Búsqueda en tiempo real con debounce
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentPage = 1;
        loadProducts();
      }, 500);
    });
  }
}


//funcion para ver el producto sin editar
function viewProduct(productId) {
  const product = realProducts.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modal-title').textContent = 'Detalle del Producto';
  fillProductForm(product);
  setFormReadOnly(true);

  // Ocultar input de imagen y botón guardar
  document.getElementById('product-image').classList.add('hidden');
  document.getElementById('save-button').classList.add('hidden');

  // Mostrar la vista previa si existe imagen
  const preview = document.getElementById('image-preview');
  const previewImg = document.getElementById('image-preview-img');
  if (product.imageUrl && preview && previewImg) {
    previewImg.src = product.imageUrl;
    preview.classList.remove('hidden');
  } else if (preview) {
    preview.classList.add('hidden');
  }

  document.getElementById('product-modal').classList.remove('hidden');
}


//funcion para cargar el select en el formulario de productos
function populateCategorySelect(realCategories = []) {
  console.log("Cargando categorías en el select:", realCategories);
  const select = document.getElementById('product-category');
  select.innerHTML = '<option value="">Seleccione una categoría</option>';
  realCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}
function openProductModal(productId) {
  populateCategorySelect(realCategories);

  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('product-form');
  const saveButton = document.getElementById('save-button');
  const preview = document.getElementById('image-preview');
  const previewImg = document.getElementById('image-preview-img'); // Accedemos directamente
  const imageInput = document.getElementById('product-image');

  if (!modal || !form || !modalTitle || !saveButton || !preview || !previewImg || !imageInput) {
    console.error("No se encontraron uno o más elementos del DOM.");
    return;
  }

  modalTitle.textContent = productId ? 'Editar Producto' : 'Nuevo Producto';
  setFormReadOnly(false);
  imageInput.classList.remove('hidden');
  saveButton.classList.remove('hidden');

  if (productId) {
    const product = realProducts.find(p => p.id === productId);
    if (product) {
      form.reset(); // Reinicia primero

      document.getElementById('product-id').value = product.id;
      document.getElementById('product-name').value = product.name || '';
      document.getElementById('product-description').value = product.description || '';
      document.getElementById('product-price').value = product.price || '';
      document.getElementById('product-stock').value = product.stock || '';
      document.getElementById('product-unit').value = product.unit || '';
      document.getElementById('product-entry-date').value = product.entryDate || '';
      document.getElementById('product-category').value = product.categoryId || '';
      if (document.getElementById('product-image-url'))
        document.getElementById('product-image-url').value = product.imageUrl || '';

      if (product.imageUrl) {
        previewImg.src = product.imageUrl;
        preview.classList.remove('hidden');
      } else {
        previewImg.src = '';
        preview.classList.add('hidden');
      }
    }
  } else {
    form.reset();
    previewImg.src = '';
    preview.classList.add('hidden');
  }

  modal.classList.remove('hidden');
}


function previewImage() {
  const fileInput = document.getElementById('product-image');
  const previewContainer = document.getElementById('image-preview');
  const previewImage = document.getElementById('image-preview-img');

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    previewContainer.classList.add('hidden');
    previewImage.src = '';
  }
}





function closeModal() {
    productModal.classList.add('hidden');
}
function setFormReadOnly(isReadOnly) {
 const fields = [
    'product-name', 'product-description', 'product-price',
    'product-unit', 'product-stock', 'product-entry-date',
    'product-category'
  ];

  fields.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      if (isReadOnly) {
        field.setAttribute('readonly', true);
        field.setAttribute('disabled', true);
      } else {
        field.removeAttribute('readonly');
        field.removeAttribute('disabled');
      }
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
  document.getElementById('product-entry-date').value = product.entryDate?.split("T")[0] || '';
  document.getElementById('product-category').value = product.categoryId;

  // Mostrar la imagen si hay preview
  const preview = document.getElementById('image-preview');
  const previewImg = document.getElementById('image-preview-img');
  if (preview && previewImg && product.imageUrl) {
    previewImg.src = product.imageUrl;
    preview.classList.remove('hidden');
  }
}

async function deleteProduct(productId) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el producto permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (result.isConfirmed) {
    try {
      await fetch(`http://localhost:3000/products/${productId}`, {
        method: "DELETE"
      });

      await Swal.fire({
        title: "¡Eliminado!",
        text: "El producto fue eliminado con éxito.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      loadProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al eliminar el producto.",
        icon: "error"
      });
    }
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

//función que busca productos por nombre o descripción
function searchProduct() {
    const searchTerm = document.getElementById('search-product').value.toLowerCase().trim();
  
  if (!searchTerm) {
    renderProducts(realProducts);
    return;
  }

  const filtered = realProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );

  renderProducts(filtered);
}

// Función para filtrar productos por categoría
function filterProducts() {
    const selectedCategoryId = document.getElementById('filter-category').value;

  if (!selectedCategoryId) {
    renderProducts(realProducts); // Mostrar todos
    return;
  }

  const filtered = realProducts.filter(product => product.categoryId.toString() === selectedCategoryId);
  renderProducts(filtered);
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

// En admin-products.js o donde manejes la lógica de creación
async function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById('product-id').value;
  const name = document.getElementById('product-name').value;
  const description = document.getElementById('product-description').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const unit = document.getElementById('product-unit').value;
  const stock = parseInt(document.getElementById('product-stock').value);
  const entryDate = document.getElementById('product-entry-date').value;
  const categoryId = parseInt(document.getElementById('product-category').value);
  const imageFile = document.getElementById('product-image').files[0];

  let imageUrl = '';

  // 1. Subir la imagen si hay una seleccionada
  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    console.log("Subiendo imagen:", imageFile.name);
    try {
      const uploadResponse = await fetch('http://localhost:3000/upload/product-image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }

      const result = await uploadResponse.json();
      imageUrl = result.imageUrl;
    } catch (err) {
      console.error('Error al subir imagen:', err);
      alert('Error al subir la imagen');
      return;
    }
  }

  // 2. Construir el producto
  const product = {
    name,
    description,
    price,
    unit,
    stock,
    entryDate,
    categoryId,
    imageUrl, // si no se cargó imagen, quedará string vacío
  };

  console.log("Datos del producto:", product);
  
  const method = id ? 'PATCH' : 'POST';
  const url = id
    ? `http://localhost:3000/products/${id}`
    : `http://localhost:3000/products`;

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Error al guardar el producto');
    }

    Swal.fire({
  icon: 'success',
  title: '¡Producto guardado!',
  text: 'Producto guardado correctamente',
  confirmButtonColor: '#3085d6'
});

    closeModal();
    await loadProducts(); // Recargar lista
  } catch (err) {
    console.error('Error al guardar:', err);
    alert('Error al guardar el producto');
  }
}



