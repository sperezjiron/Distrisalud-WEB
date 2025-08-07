// Cargar productos del carrito desde localStorage
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="text-gray-500">No hay productos en el carrito.</p>';
    subtotalElement.textContent = "₡0.00";
    totalElement.textContent = "₡0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className =
      "flex justify-between items-center border-b border-gray-200 py-2";
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
document.getElementById("confirm-order").addEventListener("click", async function () {
  const email = document.getElementById("email").value;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderSummary = cart
    .map(
      (item) =>
        `${item.name} (${item.quantity}) - ₡${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");
  const subtotal = document.getElementById("subtotal").textContent;
  const total = document.getElementById("total").textContent;

  const emailBody = `
      Resumen de su pedido:
      ${orderSummary}
      
      Subtotal: ${subtotal}
      Envío: ₡5,000.00
      Total: ${total}
    `;

 // Simular envío
  await Swal.fire({
    icon: 'info',
    title: 'Resumen enviado',
    html: `<p>Resumen del pedido enviado a <strong>${email}</strong>:</p><pre style="text-align:left; background:#f9f9f9; padding:10px; border-radius:8px;">${emailBody}</pre>`,
    confirmButtonColor: '#3b82f6',
    width: 600,
  });
});

// Enviar pedido por WhatsApp
document
  .getElementById("whatsapp-button")
  .addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderSummary = cart
      .map(
        (item) =>
          `${item.name} (${item.quantity}) - ₡${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("%0A");

    const subtotal = document.getElementById("subtotal").textContent;
    const total = document.getElementById("total").textContent;

    // 📍 Dirección de envío
    const provincia = document.getElementById("province").value;
    const canton = document.getElementById("canton").value;
    const distrito = document.getElementById("district").value;
    const direccion = document.getElementById("address").value;
    const notas = document.getElementById("notes").value || "Ninguna";

    // 🧍 Datos del cliente
    const clienteString = localStorage.getItem("loggedCustomer");
    const cliente = clienteString ? JSON.parse(clienteString) : {};
    const nameParts = cliente.name ? cliente.name.split(" ") : ["Cliente"];
    const nombre = nameParts.slice(0, -1).join(" ") || nameParts[0];
    const apellido = nameParts.slice(-1).join(" ") || "";

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
Correo: ${cliente.email || ""}
Teléfono: ${cliente.telefono || ""}

*Dirección de envío:*
Provincia: ${provincia}
Cantón: ${canton}
Distrito: ${distrito}
Dirección exacta: ${direccion}
Notas: ${notas}

*Método de pago:* ${metodoPago}
`.replace(/\n/g, "%0A");

    const whatsappUrl = `https://wa.me/50672880480?text=${message}`;
    window.open(whatsappUrl, "_blank");
  });

document.addEventListener("DOMContentLoaded", async () => {
  loadCart();
  try {
    // Obtener el cliente conectado desde localStorage y convertirlo a objeto
    const clienteString = localStorage.getItem("loggedCustomer");
    if (!clienteString)
      throw new Error("Cliente no encontrado en localStorage");

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
document.getElementById("confirm-order").addEventListener("click", async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cliente = JSON.parse(localStorage.getItem("loggedCustomer"));

  if (!cart.length || !cliente) {
    await Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío o cliente no identificado',
      text: 'Debe haber productos en el carrito y un cliente logueado.',
      confirmButtonColor: '#f59e0b'
    });
    return;
  }

  // Determinar el método de pago (IDs: 1 = Transferencia, 2 = Efectivo, 3 = SINPE Móvil)
  let methodId = null;
  if (document.getElementById("sinpe")?.checked) {
    methodId = 3;
  } else if (document.getElementById("transfer")?.checked) {
    methodId = 1;
  } else if (document.getElementById("cash")?.checked) {
    methodId = 2;
  }

  if (!methodId) {
    await Swal.fire({
      icon: 'info',
      title: 'Método de pago',
      text: 'Seleccione un método de pago antes de continuar.',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  // Calcular total del pedido
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const envio = 5000; // Costo de envío fijo
  const total = subtotal + envio;
  let pedidoId;
  try {
    // 1. Crear Pedido
    const orderRes = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString(),
        status: "Pendiente",
        clientId: cliente.id,
        totalAmount: total,
      }),
    });
    if (!orderRes.ok) throw new Error("Error al crear el pedido");
    const newOrder = await orderRes.json();
    pedidoId = newOrder.id;
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al crear el pedido',
      text: error.message,
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  try {
    // 2. Crear Detalles del Pedido
    for (const item of cart) {
      const detalleRes = await fetch("http://localhost:3000/detallepedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedidoId,
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.price,
          subtotal: item.price * item.quantity,
        }),
      });
      if (!detalleRes.ok)
        throw new Error("Error al crear el detalle del pedido");

      // 3. Restar del stock
      const stockRes = await fetch(
        `http://localhost:3000/products/${item.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock: item.stock - item.quantity,
          }),
        }
      );
      if (!stockRes.ok)
        throw new Error("Error al actualizar el stock del producto");
    }
    console.log(
      "Detalles del pedido creados y stock actualizado correctamente."
    );
  } catch (error) {
    console.error("Error al crear los detalles del pedido:", error);
     await Swal.fire({
      icon: 'error',
      title: 'Error en los detalles del pedido',
      text: error.message,
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  try {
    // 4. Crear Pago
    const paymentRes = await fetch("http://localhost:3000/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: pedidoId,
        methodId,
        amount: total,
        paymentStatus: "Pendiente",
        paymentType: "Contado",
        receiptUrl: "NA",
        paymentDate: new Date().toISOString(),
      }),
    });
    if (!paymentRes.ok) throw new Error("Error al crear el pago");
    console.log("Pago creado correctamente.");
  } catch (error) {
    console.error("Error al crear el pago:", error);
     await Swal.fire({
      icon: 'error',
      title: 'Error en el pago',
      text: error.message,
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  await Swal.fire({
    icon: 'success',
    title: '¡Pedido confirmado!',
    text: 'Tu compra se ha realizado exitosamente.',
    confirmButtonColor: '#16a34a'
  });

  // 5. Limpiar carrito y redirigir si deseas
  localStorage.removeItem("cart");
  window.location.href = "/client/orders.html";
});
