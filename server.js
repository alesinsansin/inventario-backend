const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model('Producto', ProductoSchema);

app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.json({ mensaje: 'Producto registrado', nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/productos/:id', async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ mensaje: 'Producto actualizado', productoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/productos/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});