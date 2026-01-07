const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// crear pedido
router.post('/', protect, createOrder);

// obtemer pedidos del usuario
router.get('/my', protect, getMyOrders);


module.exports = router;