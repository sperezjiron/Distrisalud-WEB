// Cargar productos del carrito desde localStorage
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  //imprimir carrito
  console.log("Carrito:", cart);
  if (cart.length === 0) {
    emptyCartMessage.classList.remove("hidden");
    cartItemsContainer.classList.add("hidden");
    subtotalElement.textContent = "₡0.00";
    totalElement.textContent = "₡5.00"; // Envío fijo
    
    return;

  }

  // Actualizar cantidad de productos en el carrito
  emptyCartMessage.classList.add("hidden");
  cartItemsContainer.classList.remove("hidden");
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className =
      "cart-item bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition";
    cartItem.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
              <img src="${item.imageUrl}" alt="${
      item.name
    }" class="w-full md:w-24 h-24 object-cover rounded" />
              <div class="flex-1">
                <h3 class="font-bold text-lg text-primary">${item.name}</h3>
                <p class="text-gray-600 text-sm">${item.unit}</p>
                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center">
                    <button class="text-gray-500 hover:text-primary" onclick="updateQuantity(${
                      item.id
                    }, -1)">
                      <i class="fas fa-minus"></i>
                    </button>
                     <span class="mx-2">${item.quantity}</span>
                    <button class="text-gray-500 hover:text-primary" onclick="updateQuantity(${
                      item.id
                    }, 1)">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <span class="font-bold text-primary">₡${(
                    item.price * item.quantity
                  ).toFixed(2)}</span>
                </div>
              </div>
              <button class="text-red-500 hover:text-red-700 self-start" onclick="removeFromCart(${
                item.id
              })">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
                      `;

   
    cartItemsContainer.appendChild(cartItem);
    subtotal += item.price * item.quantity;

    
  });
  subtotalElement.textContent = `₡${subtotal.toFixed(2)}`;
  totalElement.textContent = `₡${(subtotal + 5.0).toFixed(2)}`; // Agregar costo de envío
}

// Eliminar producto del carrito
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}
// Cargar el carrito al iniciar la página
document.addEventListener("DOMContentLoaded", loadCart);


//Función para verificar login
function verificarLoginCheckout() {
  const user = localStorage.getItem("loggedUser");
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'No puedes confirmar un pedido sin productos en el carrito.',
      confirmButtonColor: '#facc15' // color amarillo
    });
    return;
  }


  if (!user) {
    Swal.fire({
      icon: 'info',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para confirmar tu pedido.',
      confirmButtonColor: '#3b82f6' // color azul
    }).then(() => {
      window.location.href = "/client/login.html"; // o tu ruta de login
    });
  } else {
    window.location.href = "/client/checkout.html";
  }
}

function updateQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productIndex = cart.findIndex((item) => item.id === productId);

  if (productIndex > -1) {
    cart[productIndex].quantity += change;
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1); // Eliminar si la cantidad es 0 o menos
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}