const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//conexion a mongodb
connectDB();


// MiddLeware
app.use(cors({
  origin: 'http://localhost:5173' // puerto de Vite por defecto
}));
app.use(express.json());

//rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);


// ruta de prueba
app.get('/', (req, res) => {
    res.send('backend de avenir api');
});

app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});


