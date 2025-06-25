document.addEventListener('DOMContentLoaded', function() {
    // Estado de la aplicación
    const state = {
        cart: [],
        products: []
    };

    // Elementos del DOM
    const featuredProducts = document.getElementById('featured-products');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Cargar productos
    loadProducts();
    
    // Configurar eventos
    setupEventListeners();

    async function loadProducts() {
        try {
            // Simulación: Reemplazar con fetch a tu API
            const response = await mockFetchProducts();
            state.products = response;
            renderProducts(state.products);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

    function renderProducts(products) {
        featuredProducts.innerHTML = '';
        
        products.slice(0, 8).forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card bg-white p-6 rounded-lg shadow-md transition duration-300';
            productCard.innerHTML = `
                <div class="relative mb-4">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded">
                    ${product.isNew ? '<span class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Nuevo</span>' : ''}
                </div>
                <h3 class="text-xl font-bold text-primary mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-primary">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart bg-gray-100 text-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition"
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}">
                        <i class="fas fa-plus"></i> Añadir
                    </button>
                </div>
            `;
            featuredProducts.appendChild(productCard);
        });
        
        // Actualizar eventos de los botones
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
        const button = event.currentTarget;
        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: parseFloat(button.dataset.price),
            quantity: 1
        };
        
        // Verificar si ya está en el carrito
        const existingItem = state.cart.find(item => item.id === product.id);
        
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
        document.getElementById('cart-count').textContent = count;
        
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }

    function showAddedToCartFeedback(productName) {
        const feedback = document.createElement('div');
        feedback.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-lg flex items-center';
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
        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
        
        // Filtros por categoría
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active', 'bg-primary', 'text-white'));
                button.classList.add('active', 'bg-primary', 'text-white');
                
                const category = button.textContent.trim();
                filterProductsByCategory(category);
            });
        });
    }

    function filterProductsByCategory(category) {
        if (category === 'Todos') {
            renderProducts(state.products);
        } else {
            const filtered = state.products.filter(product => 
                product.category.toLowerCase() === category.toLowerCase()
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
                image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                isNew: true
            },
            // Más productos...
        ];
    }
});
