const Order = require('../models/orderModel');

// crear pedido
const createOrder = async (req, res) => {
    try {
        const { products, total } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'no hay productos en el pedido'});
        }

        const order = await Order.create({
            user: req.user._id,
            products,
            total 
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'error al crear pedido'});
    }
};


// obtener pedidos del usuario

const getMyOrders = async (req, res ) => {
    try {
        const orders = await Order.find({ user: req.user._id })
        .populate('products.product', 'name price')
        .sort({ createdAt: -1 });

      res.json(orders);  
    } catch (error) {
        res.status(500).json({ message: 'error al obtener pedidos'});
    }
};

module.exports = { createOrder, getMyOrders };