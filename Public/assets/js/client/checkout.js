// Cargar productos del carrito desde localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    let subtotal = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-gray-500">No hay productos en el carrito.</p>';
      subtotalElement.textContent = '₡0.00';
      totalElement.textContent = '₡0.00';
      return;
    }

    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = "flex justify-between items-center border-b border-gray-200 py-2";
      cartItem.innerHTML = `
        <span>${item.name} (${item.quantity})</span>
        <span>₡${(item.price * item.quantity).toFixed(2)}</span>
      `;
      cartItemsContainer.appendChild(cartItem);
      subtotal += item.price * item.quantity;
    });

    subtotalElement.textContent = `₡${subtotal.toFixed(2)}`;
    totalElement.textContent = `₡${(subtotal + 5000).toFixed(2)}`; // Agregando costo de envío
  }

  // Enviar resumen del pedido por correo
  document.getElementById('confirm-order').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummary = cart.map(item => `${item.name} (${item.quantity}) - ₡${(item.price * item.quantity).toFixed(2)}`).join('\n');
    const subtotal = document.getElementById('subtotal').textContent;
    const total = document.getElementById('total').textContent;

    const emailBody = `
      Resumen de su pedido:
      ${orderSummary}
      
      Subtotal: ${subtotal}
      Envío: ₡5,000.00
      Total: ${total}
    `;

    // Pendiente servicio de envío de correos o una API para enviar el correo
    alert(`Resumen del pedido enviado a ${email}:\n${emailBody}`);
  });

// Enviar pedido por WhatsApp
document.getElementById('whatsapp-button').addEventListener('click', function () {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderSummary = cart
    .map(item => `${item.name} (${item.quantity}) - ₡${(item.price * item.quantity).toFixed(2)}`)
    .join('%0A');

  const subtotal = document.getElementById('subtotal').textContent;
  const total = document.getElementById('total').textContent;

  // 📍 Dirección de envío
  const provincia = document.getElementById('province').value;
  const canton = document.getElementById('canton').value;
  const distrito = document.getElementById('district').value;
  const direccion = document.getElementById('address').value;
  const notas = document.getElementById('notes').value || 'Ninguna';

  // 🧍 Datos del cliente
  const clienteString = localStorage.getItem('loggedCustomer');
  const cliente = clienteString ? JSON.parse(clienteString) : {};
  const nameParts = cliente.name ? cliente.name.split(' ') : ['Cliente'];
  const nombre = nameParts.slice(0, -1).join(' ') || nameParts[0];
  const apellido = nameParts.slice(-1).join(' ') || '';

  // 💳 Método de pago
  let metodoPago = "No especificado";
  if (document.getElementById("sinpe").checked) {
    metodoPago = "SINPE Móvil";
  } else if (document.getElementById("transfer").checked) {
    metodoPago = "Transferencia Bancaria";
  } else if (document.getElementById("credit").checked) {
    const plazo = document.getElementById("credit-terms").value;
    metodoPago = `Crédito (${plazo} días)`;
  }

  // 📝 Armar mensaje completo
  const message = `
*Resumen de mi pedido:*
${orderSummary}

*Detalles del pedido:*
Subtotal: ${subtotal}
Envío: ₡5,000.00
Total: ${total}

*Datos del cliente:*
Nombre: ${nombre} ${apellido}
Correo: ${cliente.email || ''}
Teléfono: ${cliente.telefono || ''}

*Dirección de envío:*
Provincia: ${provincia}
Cantón: ${canton}
Distrito: ${distrito}
Dirección exacta: ${direccion}
Notas: ${notas}

*Método de pago:* ${metodoPago}
`.replace(/\n/g, '%0A');

  const whatsappUrl = `https://wa.me/50672880480?text=${message}`;
  window.open(whatsappUrl, '_blank');
});



document.addEventListener("DOMContentLoaded", async () => {
  loadCart();
  try {
    // Obtener el cliente conectado desde localStorage y convertirlo a objeto
    const clienteString = localStorage.getItem("loggedCustomer");
    if (!clienteString) throw new Error("Cliente no encontrado en localStorage");

    const cliente = JSON.parse(clienteString);

    const nameParts = cliente.name.split(" ");
    const nombre = nameParts.slice(0, -1).join(" ");
    const apellido = nameParts.slice(-1).join(" ");

    // Asignar los datos a los campos del formulario
    document.getElementById("first-name").value = nombre || "";
    document.getElementById("last-name").value = apellido || "";
    document.getElementById("email").value = cliente.email || "";
    document.getElementById("phone").value = cliente.telefono || "";
    document.getElementById("id-number").value = cliente.cedula || "";

  } catch (error) {
    console.error("Error al cargar la información del cliente:", error);
  }
});

//funcion para guardar el pedido
document.getElementById('confirm-order').addEventListener('click', async () => {
  try {
    // Obtener cliente
    const clienteString = localStorage.getItem('loggedCustomer');
    if (!clienteString) throw new Error('No hay cliente logueado');
    const cliente = JSON.parse(clienteString);
    const clienteId = cliente.id; // O la propiedad que uses para id

    // Obtener carrito
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) throw new Error('El carrito está vacío');

    // Obtener dirección
    const direccionEnvio = {
      provincia: document.getElementById('province').value,
      canton: document.getElementById('canton').value,
      distrito: document.getElementById('district').value,
      direccionExacta: document.getElementById('address').value,
      notas: document.getElementById('notes').value || '',
    };

    // Obtener método de pago
    let metodoPago = "SINPE Móvil"; // default
    if (document.getElementById("sinpe").checked) {
      metodoPago = "SINPE Móvil";
    } else if (document.getElementById("transfer").checked) {
      metodoPago = "Transferencia Bancaria";
    } else if (document.getElementById("credit").checked) {
      const plazo = document.getElementById("credit-terms").value;
      metodoPago = `Crédito (${plazo} días)`;
    }

    // Calcular total (puedes ajustarlo)
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const envio = 5000;
    const total = subtotal + envio;

    // Crear payload para API
    const pedidoPayload = {
      clienteId,
      productos: cart.map(item => ({
        productoId: item.id,
        cantidad: item.quantity,
        precioUnitario: item.price
      })),
      direccionEnvio,
      metodoPago,
      subtotal,
      envio,
      total,
      fechaPedido: new Date().toISOString()
    };

    // Enviar pedido al backend
    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el pedido');
    }

    const nuevoPedido = await response.json();

    // Actualizar pedidos del cliente (puede ser recargar o actualizar UI)
    // Ejemplo simple: recargar página o llamar función para actualizar pedidos
    alert('Pedido creado con éxito. ¡Gracias por su compra!');
    // Aquí podrías limpiar el carrito y/o redirigir al historial de pedidos
    localStorage.removeItem('cart');

    // Opcional: abrir WhatsApp para notificar (usando el código anterior)
    // openWhatsAppNotification(nuevoPedido); // función que armes para eso

  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  }
});
