let realPromotions = [];

async function loadPromotions() {
  try { 
    const res = await fetch("http://localhost:3000/promotions");
    if (!res.ok) throw new Error("Error en la carga de promociones");
    realPromotions = await res.json();
    console.log("Promociones cargadas:", realPromotions);
    renderPromotions(realPromotions);
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
  tbody.innerHTML = ''; // Limpiar contenido previo

  if (promotions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
          No se encontraron promociones.
        </td>
      </tr>
    `;
    return;
  }

  promotions.forEach(promotion => {
    const row = document.createElement('tr');

    // Convertir Buffer de estado a string (ej. '1' o '0')
    let statusValue = promotion.status?.[0] === 1 ? 'Activo' : 'Inactivo';

    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${promotion.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${promotion.title}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${promotion.description}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${promotion.discount}%</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(promotion.startDate)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(promotion.endDate)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${statusValue}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button class="text-primary hover:text-blue-700 mr-3" onclick="viewPromotion(${promotion.id})">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-secondary hover:text-yellow-600" onclick="openPromotionModal(${promotion.id})">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}


function searchPromotion() {
  const query = document.getElementById('search-promotion').value.toLowerCase();
  const filtered = realPromotions.filter(promo =>
    (promo.title?.toLowerCase().includes(query)) ||
    (promo.description?.toLowerCase().includes(query))
  );
  renderPromotions(filtered);
}

function openPromotionModal(promotionId = null) {
  const modalTitle = document.getElementById('promotion-modal-title');
  const saveButton = document.getElementById('promotion-save-button');
  const form = document.getElementById('promotion-form');

  form.reset(); // limpiar el formulario
  document.getElementById('promotion-id').value = ''; // reset ID
  saveButton.classList.remove('hidden'); // mostrar botón guardar
  setPromotionFormReadOnly(false); // permitir edición

  if (promotionId) {
    const promotion = realPromotions.find(p => p.id === promotionId);
    if (!promotion) return;

    modalTitle.textContent = 'Editar Promoción';
    document.getElementById('promotion-id').value = promotion.id;
    document.getElementById('promotion-title').value = promotion.title || '';
    document.getElementById('promotion-description').value = promotion.description || '';
    document.getElementById('promotion-discount').value = promotion.discount || '';
    document.getElementById('promotion-start-date').value = promotion.startDate?.substring(0, 10) || '';
    document.getElementById('promotion-end-date').value = promotion.endDate?.substring(0, 10) || '';
    document.getElementById('promotion-status').value = promotion.status?.[0] === 1 ? '1' : '0';
  } else {
    modalTitle.textContent = 'Nueva Promoción';
  }

  document.querySelectorAll('#promotion-form input, #promotion-form textarea, #promotion-form select').forEach(el => {
  el.removeAttribute('disabled');
});


  document.getElementById('promotion-modal').classList.remove('hidden');
}

//funcion para formatear fecha
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

//funcion para ver un detalle de una promocion
function viewPromotion(promotionId) {
  const promotion = realPromotions.find(p => p.id === promotionId);
  if (!promotion) return;

  document.getElementById('promotion-modal-title').textContent = 'Detalle de Promoción';

  document.getElementById('promotion-id').value = promotion.id;
  document.getElementById('promotion-title').value = promotion.title || '';
  document.getElementById('promotion-description').value = promotion.description || '';
  document.getElementById('promotion-discount').value = promotion.discount || '';
  document.getElementById('promotion-start-date').value = promotion.startDate?.substring(0, 10) || '';
  document.getElementById('promotion-end-date').value = promotion.endDate?.substring(0, 10) || '';
  document.getElementById('promotion-status').value = promotion.status?.[0] === 1 ? '1' : '0';
  
  // Deshabilitar campos para solo vista
  document.querySelectorAll('#promotion-form input, #promotion-form textarea, #promotion-form select').forEach(el => {
    el.setAttribute('disabled', 'disabled');
  });

  setPromotionFormReadOnly(true);
  document.getElementById('promotion-save-button').classList.add('hidden');
  document.getElementById('promotion-modal').classList.remove('hidden');
}

//funcion para solo vista
function setPromotionFormReadOnly(readOnly) {
  const fields = [
    'promotion-title',
    'promotion-description',
    'promotion-discount',
    'promotion-start-date',
    'promotion-end-date',
    'promotion-status'
  ];
  
  fields.forEach(field => {
    document.getElementById(field).readOnly = readOnly;
  });
} 
function closePromotionModal() {
  document.getElementById('promotion-modal').classList.add('hidden');
}

//funcion para guardar una promocion
async function savePromotion() {
  const id = document.getElementById('promotion-id').value;
  const title = document.getElementById('promotion-title').value;
  const description = document.getElementById('promotion-description').value;
  const discount = document.getElementById('promotion-discount').value;
  const startDate = document.getElementById('promotion-start-date').value;
  const endDate = document.getElementById('promotion-end-date').value;
  const status = document.getElementById('promotion-status').value;

  const promotionData = {
    title,
    description,
    discount: parseFloat(discount),
    startDate,
    endDate,
    status: parseInt(status)
  };

  try {
    let response;
    if (id) {
      // Actualizar
      response = await fetch(`http://localhost:3000/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotionData)
      });
    } else {
      // Crear nueva
      response = await fetch('http://localhost:3000/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotionData)
      });
    }

    if (!response.ok) throw new Error('Error al guardar la promoción');

    closePromotionModal();
    loadPromotions(); // Vuelve a cargar la lista
  } catch (error) {
    console.error('Error al guardar la promoción:', error);
    alert('Ocurrió un error al guardar la promoción');
  }
}
