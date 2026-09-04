const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//conexion a mongodb
connectDB();


// MiddLeware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json());

//rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));


// ruta de prueba
app.get('/', (req, res) => {
    res.send('backend de avenir api');
});

app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});


