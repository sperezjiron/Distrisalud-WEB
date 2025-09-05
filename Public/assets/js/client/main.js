// Estado global de la aplicación
const appState = {
  currentMode: "client",
  cart: [],
  products: [],
  adminAuthenticated: false,
};

// Funciones de utilidad compartidas
function updateCartCount() {
  const itemCount = appState.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  document.getElementById("cart-count").textContent = itemCount;
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const loginBtn = document.getElementById("login-button");
  const profileBtn = document.getElementById("profile-button");
  const logoutBtn = document.getElementById("logout-button");

  if (user && token) {
    loginBtn?.classList.add("hidden");
    profileBtn?.classList.remove("hidden");
    logoutBtn?.classList.remove("hidden");
  } else {
    loginBtn?.classList.remove("hidden");
    profileBtn?.classList.add("hidden");
    logoutBtn?.classList.add("hidden");
  }

  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
    window.location.href = "/";
  });
});

// Manejar el inicio de sesión
if (data.success) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  // Redirigir según el rol
  if (data.user.role === "admin") {
    window.location.href = "/admin/dashboard.html";
  } else if (data.user.role === "vendedor") {
    window.location.href = "/seller/dashboard.html";
  } else {
    window.location.href = "profile.html";
  }
}

function verificarLogin() {
  const user = localStorage.getItem("loggedUser");
  const userLink = document.getElementById("login-button");
  if (user && userLink) {
    userLink.href = "/client/profile.html";
    userLink.innerHTML = '<i class="fas fa-user"></i>';
  } else if (userLink) {
    userLink.href = "/client/login.html";
    userLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/client/login.html";
}
