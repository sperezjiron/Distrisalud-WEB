// Funcionalidades exclusivas del frontend cliente
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos
    fetchProducts();
    
    // Configurar carrito
    setupCart();
    
    // Menú móvil
    document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
});

function fetchProducts() {
    // Lógica para cargar productos desde la API
    console.log("Cargando productos para el cliente...");
}

function setupCart() {
    // Inicializar carrito
    console.log("Carrito configurado");
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const address = document.getElementById('new-address').value;
    const phone = document.getElementById('new-phone').value;

    // Aquí harías una llamada a tu API para agregar la nueva dirección
    fetch('/api/addresses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, phone }),
    })
    .then(response => response.json())
    .then(data => {
        // Manejar la respuesta, actualizar la UI, etc.
        console.log('Dirección agregada:', data);
    })
    .catch(error => console.error('Error:', error));
});
