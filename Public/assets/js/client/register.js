document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

  // 1. Obtener valores del formulario
    const name = document.getElementById("name").value;
    const cedula = document.getElementById("cedula").value;
    const tipoCedula = document.getElementById("tipoCedula").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const codigoPostal = document.getElementById("codigoPostal").value;
    const nombreNegocio = document.getElementById("nombreNegocio").value;
    const tipoCliente = document.getElementById("tipoCliente").value;
    const password = document.getElementById("password").value;

    console.log("Datos del registro:", { name, email, password });

    try {
      // 1. Crear usuario
      const userResponse = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          pass: password,
          rolId: 2, // Rol de cliente
          estado: 1,
        }),
      });

      const userData = await userResponse.json();

      if (!userResponse.ok)
        throw new Error(userData.message || "Error al crear usuario");

      const userId = userData.id;

      // 2. Crear customer
      const customerResponse = await fetch("http://localhost:3000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          name: name,
          cedula: cedula,
          tipoCedula: tipoCedula,
          email: email,
          telefono: telefono,
          direccion: direccion,
          codigoPostal: codigoPostal,
          nombreNegocio: nombreNegocio,
          tipoCliente: tipoCliente,
          estado: "activo",
          fechaCreacion: new Date().toISOString(),
          fechaUltimoIngreso: new Date().toISOString(),
        }),
      });

      const customerData = await customerResponse.json();

      if (!customerResponse.ok)
        throw new Error(customerData.message || "Error al crear cliente");

       // Guardar en localStorage
      localStorage.setItem("loggedCustomer", JSON.stringify(customerData));
      localStorage.setItem("loggedUser", JSON.stringify(userData));

      console.log("Usuario y cliente creados:", userData, customerData);

      alert("Registro exitoso");
     
      
      window.location.href = "/client/profile.html";
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error: " + error.message);
    }
  });
