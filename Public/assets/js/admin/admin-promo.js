let realPromotions = [];

async function loadPromotions() {
  try { 
    const res = await fetch("http://localhost:3000/promotions");
    if (!res.ok) throw new Error("Error en la carga de promociones");
    realPromotions = await res.json();
    console.log("Promociones cargadas:", realPromotions);
  } catch (error) {
    console.error("Error cargando promociones:", error);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  await loadPromotions();   
    renderPromotions(realPromotions);
});

function renderPromotions(promotions = []) {
   const tbody = document.getElementById('promotions-table-body');
  tbody.innerHTML = ''; // Limpiar contenido anterior

  if (!promotions || promotions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No hay promociones registradas.</td></tr>`;
    return;
  }

  promotions.forEach(promo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${promo.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${promo.nombre}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${promo.descuento}%</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(promo.fechaInicio)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(promo.fechaFin)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button class="text-primary hover:text-blue-700 mr-3" onclick="viewPromotion(${promo.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-secondary hover:text-yellow-600" onclick="openPromotionModal(${promo.id})">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}       


function searchPromotion() {
    const searchTerm = document.getElementById('search-promotion').value.toLowerCase();
    // Lógica para buscar promociones en la tabla
    console.log(`Buscando promociones que contengan: ${searchTerm}`);
}

function openPromotionModal(promotionId) {
    if (promotionId) {
        // Lógica para abrir el modal y cargar los datos de la promoción para editar
        console.log(`Editando promoción con ID: ${promotionId}`);
    } else {
        // Lógica para abrir el modal para agregar una nueva promoción
        console.log('Agregando nueva promoción');
    }
}
