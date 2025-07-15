let realProducts = [];
let realCategory = []; // Variable para almacenar las categorías cargadas
let categoryMap = {}; // Mapear id -> nombre
// Variables globales
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null;


document.addEventListener("DOMContentLoaded", function () {
  // Estado de la aplicación
  const state = {
    cart: [],
    products: [],
  };

  // Elementos del DOM
  const featuredProducts = document.getElementById("featured-products");
  const categoryButtons = document.querySelectorAll(".category-btn");

  // Configurar eventos
  setupEventListeners();

  function addToCart(event) {
    const button = event.currentTarget;
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
      quantity: 1,
    };

    // Verificar si ya está en el carrito
    const existingItem = state.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push(product);
    }

    updateCartCount();
    showAddedToCartFeedback(product.name);
  }

  function updateCartCount() {
    const count = state.cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = count;

    // Guardar en localStorage
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }

  function showAddedToCartFeedback(productName) {
    const feedback = document.createElement("div");
    feedback.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-lg flex items-center";
    feedback.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i> ${productName} añadido al carrito
        `;
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }

  function setupEventListeners() {
    // Menú móvil
    document
      .getElementById("mobile-menu-button")
      .addEventListener("click", () => {
        document.getElementById("mobile-menu").classList.toggle("hidden");
      });

    // Filtros por categoría
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        categoryButtons.forEach((btn) =>
          btn.classList.remove("active", "bg-primary", "text-white")
        );
        button.classList.add("active", "bg-primary", "text-white");

        const categoryId = button.dataset.id;;
        filterProductsByCategory(categoryId);
      });
    });
  }


  // Simulación de API
  async function mockFetchProducts() {
    return [
      {
        id: 1,
        name: "Miel Orgánica Pura",
        description: "250g - Directa de los apicultores locales",
        price: 12.99,
        category: "Mieles",
        image:
          "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        isNew: true,
      },
      // Más productos...
    ];
  }
});


//esta función filtra los productos según el término de búsqueda y la categoría seleccionada
function filterProducts() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const selectedCategory = document.getElementById("category-filter").value;

  const filteredProducts = realProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "" ? true : product.categoryId == selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}
//aqui termina la función de filtrado
// Función para filtrar productos por categoría

function filterProductsByCategory(categoryId) {
   if (!categoryId) {
    renderProducts(realProducts); // Mostrar todos si no se seleccionó nada
  } else {
    const filtered = realProducts.filter(
      (product) => product.categoryId == categoryId
    );
    renderProducts(filtered);
  }
}


// Función para cargar productos al iniciar

// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  await loadCategory(); // Cargar categorías;
  await loadFeaturedCategoryButtons(); // Cargar botones de categorías destacadas
  const products = await loadProducts();
  renderFeaturedProducts(products); // Mostramos solo 4 productos destacados
  renderProducts(products);

  updateCartCount();

  // Eventos de búsqueda y filtrado
  document
    .getElementById("search-input")
    .addEventListener("input", filterProducts);
  document
    .getElementById("category-filter")
    .addEventListener("change", filterProducts);

  document
    .getElementById("category-filter")
    .addEventListener("change", (e) => {
      filterProductsByCategory(e.target.value);
    });

  // Eventos del modal
  document
    .getElementById("close-modal")
    .addEventListener("click", closeProductModal);
  // Eventos de cantidad
  document.getElementById("increase-qty").addEventListener("click", () => {
    const qtyInput = document.getElementById("product-qty");
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });

  document.getElementById("decrease-qty").addEventListener("click", () => {
    const qtyInput = document.getElementById("product-qty");
    if (parseInt(qtyInput.value) > 1) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
    }
  });
  // Evento para añadir al carrito desde el modal
  document
    .getElementById("add-to-cart-modal")
    .addEventListener("click", addToCartFromModal);
});
// Función para renderizar productos
function renderProducts(productsToRender) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  console.log("Renderizando productos:", productsToRender);
  document.getElementById("results-count").textContent =
    productsToRender.length;

  productsToRender.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className =
      "product-card bg-white p-6 rounded-lg shadow-md transition duration-300";

    productCard.innerHTML = `
      <div class="relative mb-4">
        <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover rounded" />
        <span class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Nuevo</span>
      </div>
      <h3 class="text-xl font-bold text-primary mb-2">${product.name}</h3>
      <p class="text-gray-600 text-sm mb-3">${product.description}</p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold text-primary">₡${product.price}</span>
        <button class="add-to-cart bg-gray-100 text-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition" 
                data-id="${product.id}" 
                data-name="${product.name}" 
                data-price="${product.price}">
          <i class="fas fa-plus"></i> Añadir
        </button>
      </div>
    `;
    // Agregar evento de clic para abrir el detalle del producto
    productCard.addEventListener("click", () => openProductModal(product));
    productList.appendChild(productCard);
  });
}

// Función para abrir el modal de producto
function openProductModal(product) {
  const categoryName = categoryMap[product.categoryId] || "Sin categoría";
  currentProduct = product;
  document.getElementById("modal-product-name").textContent = product.name;
  document.getElementById("modal-product-image").src = product.imageUrl;
  document.getElementById(
    "modal-product-price"
  ).textContent = `₡${product.price}`;
  document.getElementById("modal-product-unit").textContent = product.unit;
  document.getElementById("modal-product-category").textContent = categoryName;
  document.getElementById("modal-product-description").textContent =
    product.description;
  document.getElementById(
    "modal-product-stock"
  ).textContent = `En stock (${product.stock} unidades)`;
  document.getElementById("product-detail-modal").classList.remove("hidden");
}
// Función para cerrar el modal
function closeProductModal() {
  document.getElementById("product-detail-modal").classList.add("hidden");
}
// Función para añadir al carrito desde el modal
function addToCartFromModal() {
  const qty = parseInt(document.getElementById("product-qty").value);
  const productToAdd = { ...currentProduct, quantity: qty };
  cart.push(productToAdd);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  closeProductModal();
}
// Función para actualizar el contador del carrito
function updateCartCount() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}


//función para cargar los datos de productosdel backend
async function loadProducts() {
  try {
    const response = await fetch("http://localhost:3000/Products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    realProducts = data; // Guardar los productos cargados
    console.log("RealProducts:", realProducts);
    return data;
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

//función para cargar los datos de categorias del backend
async function loadCategory() {
  try {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();

    const categoryFilter = document.getElementById("category-filter");

    // Limpiar si ya tenía opciones previas
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';

    data.forEach((cat) => {
      // Crear mapa id => nombre
      categoryMap[cat.id] = cat.name;

      // Agregar opción
      const option = document.createElement("option");
      option.value = cat.id; //   usa el ID real
      option.textContent = cat.name;
      categoryFilter.appendChild(option);
    });
     
    return data;
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
}

// Función para cargar categorías destacadas desde el backend
async function loadFeaturedCategoryButtons() {
  try {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();

    renderFeaturedCategoryButtons(data); // Usa tu función con los datos cargados
  } catch (error) {
    console.error("Error cargando categorías destacadas:", error);
  }
}
// Función para renderizar productos destacados
function renderFeaturedProducts(products) {
  const featured = products.slice(0, 4); // Solo los primeros 4 productos
  renderProducts(featured);
}

// Función para renderizar botones de categorías destacadas
function renderFeaturedCategoryButtons(categories) {
  const container = document.getElementById("featured-category-buttons");
  if (!container) {
    console.warn("No se encontró el contenedor #featured-category-buttons");
    return;
  }

  container.innerHTML = ""; // Limpiar botones anteriores

  // Botón "Todos"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Todos";
  allBtn.className =
    "category-btn active px-4 py-2 rounded-full border border-primary text-primary";
  allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    renderProducts(realProducts);
  });
  container.appendChild(allBtn);

  // Botones por cada categoría
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    btn.className =
      "category-btn px-4 py-2 rounded-full border border-primary text-primary";
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      const filtered = realProducts.filter((p) => p.categoryId == cat.id);
      renderProducts(filtered);
    });
    container.appendChild(btn);
  });
}

function setActiveButton(selectedBtn) {
  document
    .querySelectorAll(".category-btn")
    .forEach((btn) =>
      btn.classList.remove("active", "bg-primary", "text-white")
    );
  selectedBtn.classList.add("active", "bg-primary", "text-white");
}
