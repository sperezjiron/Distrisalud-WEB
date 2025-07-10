let realProducts = [];

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

        const category = button.textContent.trim();
        filterProductsByCategory(category);
      });
    });
  }

  function filterProductsByCategory(category) {
    if (category === "Todos") {
      renderProducts(state.products);
    } else {
      const filtered = state.products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      renderProducts(filtered);
    }
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

// Datos de ejemplo (simulando productos de diferentes categorías)
const products = [
  {
    id: 1,
    name: "Miel Orgánica Pura",
    description: "250g - Directa de los apicultores locales",
    price: 3000,
    unit: "Frasco 250g",
    category: "mieles",
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    stock: 15,
  },
  {
    id: 2,
    name: "Electrolit Naranja-Mandarina",
    description:
      "625mL - Electrolit- suero hidratante sabor naranja-mandarina.",
    price: 4500,
    unit: "Botella 625mL",
    category: "jugos",
    image: "../assets/images/electrolit_naranja_mandarina.png",
    stock: 8,
  },
  {
    id: 3,
    name: "Aceite de Coco Virgen",
    description: "210ml - Ideal para cocina y cuidado personal.",
    price: 5000,
    unit: "Frasco 210ml",
    category: "suplementos",
    image: "../assets/images/aceite_coco_210.png",
    stock: 20,
  },
  {
    id: 4,
    name: "Jarabe de Propóleo",
    description: "355ml - Fortalece el sistema inmunológico.",
    price: 3500,
    unit: "Frasco 355ml",
    category: "mieles",
    image: "../assets/images/miel_355.png",
    stock: 12,
  },
  {
    id: 5,
    name: "Jabón Corporal de Avena y Miel",
    description: "450ml - Hidratante para pieles secas.",
    price: 4800,
    unit: "Tarro 450ml",
    category: "cosmetica",
    image: "../assets/images/grisi_jabón_corporal_avena.png",
    stock: 5,
  },
];
// Variables globales
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null;
// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  const products = await loadProducts();
  renderProducts(products);
  updateCartCount();

  // Eventos de búsqueda y filtrado
  document
    .getElementById("search-input")
    .addEventListener("input", filterProducts);
  document
    .getElementById("category-filter")
    .addEventListener("change", filterProducts);

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

const productCategory = {
  1: "Suplementos Alimenticios",
};

// Función para abrir el modal de producto
function openProductModal(product) {
  const category = productCategory[product.categoryId] || "Sin categoría";

  currentProduct = product;
  document.getElementById("modal-product-name").textContent = product.name;
  document.getElementById("modal-product-image").src = product.imageUrl;
  document.getElementById(
    "modal-product-price"
  ).textContent = `₡${product.price}`;
  document.getElementById("modal-product-unit").textContent = product.unit;
  document.getElementById("modal-product-category").textContent =
    category;
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
// Función para filtrar productos
function filterProducts() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const selectedCategory = document.getElementById("category-filter").value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

//función para cargar los datos del backend
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
