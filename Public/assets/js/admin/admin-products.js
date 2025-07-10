// Estado global de productos
let products = [];
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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Cargar productos
async function loadProducts() {
    try {
        // Simulación: En producción usar fetch a tu API
        const response = await mockFetchProducts();
        products = response.data;
        totalProducts = response.total;
        renderProducts();
        renderPagination();
        
        // Mostrar resultados
        updateShowingText();
        
    } catch (error) {
        console.error("Error loading products:", error);
        showToast("Error al cargar productos", "error");
    }
}

// Renderizar tabla de productos
function renderProducts() {
    productsTableBody.innerHTML = '';
    
    // Filtrar productos (si hay filtros aplicados)
    const filteredProducts = filterProducts(products);
    
    // Paginar
    const paginatedProducts = paginateProducts(filteredProducts);
    
    // Generar filas
    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded text-blue-600">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img src="${product.image || '/admin/assets/images/default-product.png'}" alt="${product.name}" class="h-full w-full object-cover">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${product.name}</div>
                        <div class="text-sm text-gray-500">${product.sku || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(product.category)}">
                    ${product.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                $${product.price.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${product.stock} uni.
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${product.active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="edit-product text-blue-600 hover:text-blue-900 mr-3" 
                        data-id="${product.id}"
                        aria-label="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-product text-red-600 hover:text-red-900" 
                        data-id="${product.id}"
                        aria-label="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones
    addProductEvents();
}

// Configurar event listeners
function setupEventListeners() {
    // Modal
    addProductBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    cancelProductBtn.addEventListener('click', closeModal);
    
    // Formulario
    productForm.addEventListener('submit', handleFormSubmit);
    
    // Filtros
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    // Paginación
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadProducts();
        }
    });
    
    // Búsqueda en tiempo real con debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
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
        // En producción, usar fetch aquí
        if (productData.id) {
            // Actualizar producto existente
            await mockUpdateProduct(productData);
            showToast("Producto actualizado con éxito", "success");
        } else {
            // Crear nuevo producto
            await mockCreateProduct(productData);
            showToast("Producto creado con éxito", "success");
        }
        
        closeModal();
        loadProducts();
        
    } catch (error) {
        console.error("Error saving product:", error);
        showToast("Error al guardar el producto", "error");
    }
}

// Funciones auxiliares
function openModal(mode, productId = null) {
    if (mode === 'edit' && productId) {
        document.getElementById('modal-title').textContent = 'Editar Producto';
        const product = products.find(p => p.id === productId);
        if (product) {
            // Llenar formulario con datos del producto
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-sku').value = product.sku || '';
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-active').checked = product.active;
            
            // Mostrar imagen si existe
            if (product.image) {
                const preview = document.getElementById('image-preview');
                preview.querySelector('img').src = product.image;
                preview.classList.remove('hidden');
            }
        }
    } else {
        document.getElementById('modal-title').textContent = 'Nuevo Producto';
        productForm.reset();
        document.getElementById('image-preview').classList.add('hidden');
    }
    
    productModal.classList.remove('hidden');
}

function closeModal() {
    productModal.classList.add('hidden');
}

// Aplicar filtros
function applyFilters() {
    currentPage = 1;
    loadProducts();
}

// Funciones de mock para simular API (reemplazar con llamadas reales)
async function mockFetchProducts() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: [
                    {
                        id: 1,
                        name: "Miel Orgánica Pura",
                        category: "Mieles",
                        price: 12.99,
                        stock: 42,
                        sku: "MIEL-001",
                        description: "Miel 100% pura de abeja",
                        image: "/admin/assets/images/products/honey.jpg",
                        active: true
                    },
                    // Más productos de ejemplo...
                ],
                total: 1 // Cambiar según tus datos reales
            });
        }, 500);
    });
}

async function mockCreateProduct(product) {
    return new Promise(resolve => {
        setTimeout(() => {
            product.id = Math.max(...products.map(p => p.id)) + 1;
            resolve(product);
        }, 500);
    });
}

async function mockUpdateProduct(product) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(product);
        }, 500);
    });
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
    const selectedCategory = document.getElementById('filter-category').value;
    // Lógica para filtrar productos por categoría
    console.log(`Filtrando productos por categoría: ${selectedCategory}`);
}
