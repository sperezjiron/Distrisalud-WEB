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
  const tbody = document.querySelector('#promotions tbody');
    tbody.innerHTML = '';
    if (!promotions || promotions.length === 0) {
    const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
          No hay promociones para mostrar.
        </td>
      `;
      tbody.appendChild(row);
      return;
    }   
    promotions.forEach(promotion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${promotion.name}</td>
            <td class="px-6 py-4 whitespace-nowrap">${promotion.discount}%</td>
            <td class="px-6 py-4 whitespace-nowrap">${promotion.startDate}</td>
            <td class="px-6 py-4 whitespace-nowrap">${promotion.endDate}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button class="btn-edit" onclick="openPromotionModal(${promotion.id})">Editar</button>
            <button class="btn-delete
" onclick="deletePromotion(${promotion.id})">Eliminar</button>
            </td>       
        `;
        tbody.appendChild(row);
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
