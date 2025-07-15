let realCategory = []; // Variable para almacenar las categorías cargadas
let categoryMap = {}; // Mapear id -> nombre

//función para cargar los datos del backend
async function loadCategory() {
  try {
    const response = await fetch("http://localhost:3000/categories");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    data.forEach(cat => {
      categoryMap[cat.id] = cat.name; // Construir el mapa
    });

    console.log("Categorías cargadas:", categoryMap);
    return data;
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}