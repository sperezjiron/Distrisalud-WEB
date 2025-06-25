document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // try {
    //   const response = await fetch("/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();

    //   if (data.success) {
    //     // Guardar token en localStorage o cookie
    //     localStorage.setItem("token", data.token);
    //     localStorage.setItem("user", JSON.stringify(data.user));

    //     // Redirigir al dashboard
    //     window.location.href = "profile.html";
    //   } else {
    //     alert(data.message || "Error al iniciar sesión");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("Error al conectar con el servidor");
    // }

    try {
      const data = true;

      if (data) {
        var user = email;
        // Guardar token en localStorage o cookie
        localStorage.setItem("user", user);

        // Redirigir al dashboard
        window.location.href = "/";
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  });
