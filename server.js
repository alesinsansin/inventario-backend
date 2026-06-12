const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conexión exitosa a MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err);
  });

// Esquema
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model('Producto', ProductoSchema);

// Obtener productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar producto
app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();

    res.json({
      mensaje: 'Producto registrado',
      nuevoProducto
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puerto para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});