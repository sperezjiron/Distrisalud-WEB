// Función para cargar secciones
function loadSection(sectionId) {
    if (sectionId === 'products') {
        loadProducts();
    }else if (sectionId === 'clients') {
        loadClients();
    } else if (sectionId === 'orders') {
        loadOrders();
    } else if (sectionId === 'reports') {
        loadReports();
    }
}

// Cargar productos
function loadProducts() {
    fetch('partials/products.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('products').innerHTML = html;
            document.getElementById('products').classList.add('active');
        })
        .catch(error => console.error('Error:', error));
}

// Cargar clientes
function loadClients() {
    fetch('partials/clients.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('products').innerHTML = html; // Cambia 'products' a 'clients'
            document.getElementById('clients').classList.add('active');
        })
        .catch(error => console.error('Error:', error));
}
// Funciones del modal
function openModal(action, type = 'product', id = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    
    if (type === 'client' && action === 'edit') {
        title.textContent = 'Editar Cliente';
        // Cargar datos del cliente con id
    } else if (type === 'client') {
        title.textContent = 'Nuevo Cliente';
        document.getElementById('product-form').reset();
    } else if (action === 'edit') {
        title.textContent = 'Editar Producto';
        // Cargar datos del producto con id
    } else {
        title.textContent = 'Nuevo Producto';
        document.getElementById('product-form').reset();
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
}
// Función para eliminar cliente
function deleteClient(clientId) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        console.log('Eliminar cliente:', clientId);
        // Aquí iría la lógica para eliminar el cliente
    }
}
// Inicialización 
document.addEventListener('DOMContentLoaded', () => {
    // Asignar eventos al formulario del modal
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado');
        // Aquí iría la lógica para guardar el cliente
        closeModal();
    });
});
// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Asignar eventos al formulario del modal
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado');
        // Aquí iría la lógica para guardar el producto
        closeModal();
    });
});
