document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");

  if (!orderId) {
    alert("ID de pedido no proporcionado");
    return;
  }

  try {
    // 1. Obtener orden general
    const orderRes = await fetch(`http://localhost:3000/orders/${orderId}`);
    if (!orderRes.ok) throw new Error("No se pudo cargar la orden");
    const order = await orderRes.json();
    console.log("Orden:", order);


    // 2. Obtener detalles del pedido (productos)
    const detallesRes = await fetch(`http://localhost:3000/detallepedidos/by-pedido/${orderId}`);
    if (!detallesRes.ok) throw new Error("No se pudo cargar el detalle del pedido");
    const detalles = await detallesRes.json();

    // 3. Obtener productos
    const productosRes = await fetch(`http://localhost:3000/products`);
    if (!productosRes.ok) throw new Error("No se pudo cargar la lista de productos");
    const productos = await productosRes.json();

    // 4. Obtener métodos de pago
    const metodosRes = await fetch(`http://localhost:3000/metodos`);
    if (!metodosRes.ok) throw new Error("No se pudo cargar la lista de métodos de pago");
    const metodos = await metodosRes.json();

    // 5. Llenar resumen del pedido
    document.getElementById("order-title").textContent = `Detalle del Pedido #${order.id}`;
    document.getElementById("order-date").textContent = new Date(order.date).toLocaleDateString();

    const metodo = metodos.find((m) => m.id === order.metodoPagoId);
    document.getElementById("order-payment").textContent = metodo?.nombre || "No disponible";

    document.getElementById("order-status").textContent = order.status;
    document.getElementById("order-status").classList.add("badge-shipped");

    // 6. Calcular totales
    const subtotal = detalles.reduce((acc, item) => acc + item.subtotal, 0);
    const envio = order.envio || 0;
    const total = subtotal + envio;

    // Mostrar sin separadores, solo 2 decimales debe mostrar el numero completo
    function formatCurrency(cents) {
  return "₡" + cents.toLocaleString("es-CR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    document.getElementById("order-subtotal").textContent = formatCurrency(subtotal);
    document.getElementById("order-shipping-cost").textContent = formatCurrency(envio);
    document.getElementById("order-total").textContent = formatCurrency(total);

    // 7. Renderizar productos
    const productsContainer = document.getElementById("order-products");
    productsContainer.innerHTML = "";

    detalles.forEach((item) => {
      const producto = productos.find((p) => p.id === item.productoId);

      const productDiv = document.createElement("div");
      productDiv.className = "py-4 flex flex-col md:flex-row";

      productDiv.innerHTML = `
        <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <img src="${producto?.imageUrl || '/assets/images/default-product.jpg'}"
               alt="${producto?.name || 'Producto'}"
               class="w-20 h-20 object-cover rounded">
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-primary">${producto?.name || "Producto"}</h4>
          <p class="text-gray-600 text-sm">${producto?.description || ""}</p>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-gray-600">Cantidad: ${item.cantidad}</span>
            <span class="font-bold text-primary">${formatCurrency(item.subtotal)}</span>
          </div>
        </div>
      `;

      productsContainer.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Error al cargar el pedido:", error);
    alert("Ocurrió un error al cargar el pedido.");
  }
});


