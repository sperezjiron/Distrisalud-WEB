// Configuración inicial del panel admin
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    checkAdminAuth();
    
    // Configurar menu activo
    setupAdminMenu();
    
    // Cargar estadísticas del dashboard
    if (document.querySelector('.admin-stats-grid')) {
        loadDashboardStats();
    }
});

function checkAdminAuth() {
    // Verificar si el usuario está logueado
    if (!localStorage.getItem('adminToken')) {
        window.location.href = '/admin/login.html';
    }
}

function setupAdminMenu() {
    // Resaltar item activo en el menú
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        }
    });
}
// Ejemplo: Cargar estadísticas ESTO VA EN EL API
fetch('/api/admin/stats')
  .then(response => response.json())
  .then(data => {
    document.getElementById('sales-amount').textContent = `$${data.sales}`;
    // Actualizar otros datos...
  });

  // Verifica el token JWT al cargar
if(!localStorage.getItem('adminToken')) {
  window.location.href = '/admin/login.html';
}
