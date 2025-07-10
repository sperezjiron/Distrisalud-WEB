const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.static('public'));  // Archivos estáticos (CSS/JS)
app.use(express.static('src'));     // HTML del admin y cliente

// Mock de rutas de API (simulando backend)
app.post('/api/admin/login', (req, res) => {
  // Validación simulada (en producción usa una base de datos)
  if (req.body.email === 'admin@distrisalud.com' && req.body.password === 'Admin123') {
    res.json({ 
      token: 'fake-jwt-token',
      user: { name: "Admin", role: "admin" }
    });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});
// Ruta para servir el archivo HTML
app.get('/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});
// Ruta principal del admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/admin/index.html'));
});

// Ruta principal del cliente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/client/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
    🚀 Servidor ejecutándose en:
    - Frontend Cliente: http://localhost:${PORT}
    - Panel Admin:      http://localhost:${PORT}/admin
  `);
});
