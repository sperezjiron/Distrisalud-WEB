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
  document.getElementById('whatsapp-button').addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummary = cart.map(item => `${item.name} (${item.quantity}) - ₡${(item.price * item.quantity).toFixed(2)}`).join('%0A');
    const subtotal = document.getElementById('subtotal').textContent;
    const total = document.getElementById('total').textContent;

    const message = `
  *Resumen de mi pedido:*
  ${orderSummary}

  *Detalles del pedido:*
  Subtotal: ${subtotal}
  Envío: ₡5,000.00
  Total: ${total}
`.replace(/\n/g, '%0A');


    const whatsappUrl = `https://wa.me/50672880480?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  });

  // Cargar el carrito al iniciar la página
  document.addEventListener('DOMContentLoaded', loadCart);
document.addEventListener('DOMContentLoaded', loadCart);
