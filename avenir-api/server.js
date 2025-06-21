const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');


const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//conexion a mongodb
connectDB();


// MiddLeware
app.use(cors());
app.use(express.json());

//rutas
app.use('/api/users', userRoutes);

// ruta de prueba
app.get('/', (req, res) => {
    res.send('backend de avenir api');
});

app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

app.use('/api/products', productRoutes);