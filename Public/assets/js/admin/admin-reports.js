let productosMasVendidosData = []; // para Excel

async function cargarProductosMasVendidos() {
  try {
    const response = await fetch('http://localhost:3000/reports/productos-mas-vendidos');
    const data = await response.json();
    productosMasVendidosData = data; // Guardamos para exportar después

    const container = document.getElementById('productos-mas-vendidos-container');
    container.innerHTML = '';

    if (!data.length) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">No hay productos vendidos.</td>
        </tr>`;
      return;
    }

    data.forEach((producto, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${index + 1}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${producto.producto}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${producto.total_vendido}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₡${parseFloat(producto.precio_promedio).toFixed(2)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₡${parseFloat(producto.total_generado).toFixed(2)}</td>
      `;
      container.appendChild(row);
    });

  } catch (error) {
    console.error('Error al cargar productos más vendidos:', error);
    const container = document.getElementById('productos-mas-vendidos-container');
    container.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-4 text-center text-red-500">Ocurrió un error al cargar los datos.</td>
      </tr>`;
  }
}


//exportar a excel
function exportarExcelProductosMasVendidos() {
  if (!productosMasVendidosData || productosMasVendidosData.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const worksheetData = productosMasVendidosData.map((item, index) => ({
    "#": index + 1,
    "Producto": item.producto,
    "Total Vendido": item.total_vendido,
    "Precio Promedio": item.precio_promedio,
    "Total Generado": item.total_generado,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos Más Vendidos");
  XLSX.writeFile(workbook, "productos_mas_vendidos.xlsx");
}



let clientesFrecuentesData = [];

async function cargarClientesFrecuentes() {
  try {
    const response = await fetch('http://localhost:3000/reports/clientes-frecuentes');
    const data = await response.json();
    clientesFrecuentesData = data;

    const container = document.getElementById('clientes-frecuentes-container');
    container.innerHTML = '';

    if (!data.length) {
      container.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-2 text-center text-gray-500">No hay datos disponibles.</td>
        </tr>
      `;
      return;
    }

    data.forEach((cliente, index) => {
      const row = document.createElement('tr');
      row.classList.add('border-b');

      row.innerHTML = `
        <td class="px-4 py-2">${index + 1}</td>
        <td class="px-4 py-2">${cliente.Nombre}</td>
        <td class="px-4 py-2">${cliente.CantidadPedidos}</td>
        <td class="px-4 py-2">₡${parseFloat(cliente.TotalGastado).toFixed(2)}</td>
      `;

      container.appendChild(row);
    });

  } catch (error) {
    console.error('Error al cargar clientes frecuentes:', error);
  }
}

//xportar a excel
function exportarClientesFrecuentesExcel() {
  if (!clientesFrecuentesData.length) {
    alert('No hay datos para exportar.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(clientesFrecuentesData.map(c => ({
    Nombre: c.Nombre,
    "Cantidad de Pedidos": c.CantidadPedidos,
    "Total Gastado (₡)": parseFloat(c.TotalGastado).toFixed(2),
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes Frecuentes");

  XLSX.writeFile(workbook, "clientes_frecuentes.xlsx");
}

let pedidosPendientesData = [];

async function cargarPedidosPendientes() {
  try {
    const response = await fetch('http://localhost:3000/reports/pedidos-pendientes');
    const data = await response.json();
    pedidosPendientesData = data;

    const container = document.getElementById('pedidos-pendientes-container');
    container.innerHTML = '';

    if (!data.length) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">No hay pedidos pendientes.</td>
        </tr>`;
      return;
    }

    data.forEach((pedido, index) => {
      const fecha = new Date(pedido.Fecha).toLocaleDateString('es-CR');
      const row = document.createElement('tr');

      row.innerHTML = `
        <td class="px-6 py-4 text-sm text-gray-800">${index + 1}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${pedido.ID_Pedido}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${pedido.Cliente}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${fecha}</td>
        <td class="px-6 py-4 text-sm text-gray-800">₡${parseFloat(pedido.Monto_Total).toFixed(2)}</td>
      `;

      container.appendChild(row);
    });

  } catch (error) {
    console.error('Error al cargar pedidos pendientes:', error);
    const container = document.getElementById('pedidos-pendientes-container');
    container.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-4 text-center text-red-500">Ocurrió un error al cargar los datos.</td>
      </tr>`;
  }
}

function exportarExcelPedidosPendientes() {
  if (!pedidosPendientesData || pedidosPendientesData.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const worksheetData = pedidosPendientesData.map((pedido, index) => ({
    "#": index + 1,
    "ID Pedido": pedido.ID_Pedido,
    "Cliente": pedido.Cliente,
    "Fecha": new Date(pedido.Fecha).toLocaleDateString('es-CR'),
    "Monto Total": pedido.Monto_Total,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos Pendientes");
  XLSX.writeFile(workbook, "pedidos_pendientes.xlsx");
}


let resumenDiarioData = [];

async function cargarResumenDiarioVentas() {
  try {
    const response = await fetch('http://localhost:3000/reports/resumen-diario');
    const data = await response.json();
    resumenDiarioData = data;

    const container = document.getElementById('resumen-diario-container');
    container.innerHTML = '';

    if (!data.length) {
      container.innerHTML = `
        <tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No hay registros diarios.</td></tr>`;
      return;
    }

    data.forEach((item, index) => {
      const fecha = new Date(item.Dia).toLocaleDateString('es-CR');
      const row = document.createElement('tr');

      row.innerHTML = `
        <td class="px-6 py-4 text-sm text-gray-800">${index + 1}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${fecha}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${item.CantidadPedidos}</td>
        <td class="px-6 py-4 text-sm text-gray-800">₡${parseFloat(item.TotalVendido).toFixed(2)}</td>
      `;

      container.appendChild(row);
    });

  } catch (error) {
    console.error('Error al cargar resumen diario:', error);
    const container = document.getElementById('resumen-diario-container');
    container.innerHTML = `
      <tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Error al cargar los datos.</td></tr>`;
  }
}

function exportarExcelResumenDiario() {
  if (!resumenDiarioData || resumenDiarioData.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const worksheetData = resumenDiarioData.map((item, index) => ({
    "#": index + 1,
    "Día": new Date(item.Dia).toLocaleDateString('es-CR'),
    "Cantidad de Pedidos": item.CantidadPedidos,
    "Total Vendido": item.TotalVendido,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Resumen Diario");
  XLSX.writeFile(workbook, "resumen_diario.xlsx");
}

let ventasPorMesData = [];

async function cargarVentasPorMes() {
  try {
    const response = await fetch('http://localhost:3000/reports/ventas-por-mes');
    const data = await response.json();
    ventasPorMesData = data;

    const container = document.getElementById('ventas-por-mes-container');
    container.innerHTML = '';

    if (!data.length) {
      container.innerHTML = `
        <tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No hay ventas registradas por mes.</td></tr>`;
      return;
    }

    data.forEach((item, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td class="px-6 py-4 text-sm text-gray-800">${index + 1}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${item.Mes}</td>
        <td class="px-6 py-4 text-sm text-gray-800">₡${parseFloat(item.TotalVentas).toFixed(2)}</td>
      `;

      container.appendChild(row);
    });

  } catch (error) {
    console.error('Error al cargar ventas por mes:', error);
    const container = document.getElementById('ventas-por-mes-container');
    container.innerHTML = `
      <tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error al cargar los datos.</td></tr>`;
  }
}

function exportarExcelVentasPorMes() {
  if (!ventasPorMesData || ventasPorMesData.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const worksheetData = ventasPorMesData.map((item, index) => ({
    "#": index + 1,
    "Mes": item.Mes,
    "Total Ventas": item.TotalVentas
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas por Mes");
  XLSX.writeFile(workbook, "ventas_por_mes.xlsx");
}


//funcion para imprimir valor

function imprimirValor(valor) {
  const ventana = window.open('', '_blank');    
    ventana.document.write(`
        <html>
        <head>
            <title>Reporte</title>
            <style>
            body { font-family: Arial, sans-serif; }
            .valor { font-size: 24px; font-weight: bold; }
            </style>
        </head>
        <body>
            <p class="valor">Valor: ₡${valor}</p>
        </body>
        </html>
    `);
}

async function showSectionreports() {
  showSection('frequent-reports');
  console.log('Cargando reportes frecuentes...');
  await cargarClientesFrecuentes();
  await cargarProductosMasVendidos();
  await cargarPedidosPendientes();
  await cargarResumenDiarioVentas();
  await cargarVentasPorMes();

}

