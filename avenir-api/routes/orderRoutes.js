const express = require('express');
const { createOrder, getMyOrders, cancelOrder } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// crear pedido
router.post('/', protect, createOrder);

// obtemer pedidos del usuario
router.get('/my', protect, getMyOrders);

router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;