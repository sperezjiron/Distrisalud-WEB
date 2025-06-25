// orders.js

async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/orders');
        const orders = await response.json();
        const tbody = document.querySelector('#orders tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.cliente}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.fecha}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${order.total}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">${order.estado}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-primary hover:text-blue-700 mr-3">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-secondary hover:text-yellow-600">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
    }
}

// Llamar a la función al cargar la sección de pedidos
document.addEventListener('DOMContentLoaded', function() {
    showSection('orders');
    fetchOrders(); // Cargar pedidos al iniciar la sección
});

// Función para crear un nuevo pedido
document.getElementById('createOrderButton').addEventListener('click', function() {
    const orderData = {
        cliente: document.getElementById('orderClient').value,
        fecha: document.getElementById('orderDate').value,
        total: document.getElementById('orderTotal').value,
        estado: 'Pendiente', // O el estado que desees
    };
    createOrder(orderData);
});

async function createOrder(orderData) {
    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        const newOrder = await response.json();
        console.log('Nuevo pedido creado:', newOrder);
        fetchOrders(); // Actualiza la lista de pedidos
    } catch (error) {
        console.error('Error al crear el pedido:', error);
    }
}
