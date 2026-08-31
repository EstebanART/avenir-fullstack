const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: 'pedido no encontrado' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'el pedido no puede cancelarse' });
        }

        for (const item of order.products) {
            await Product.findOneAndUpdate(
                { _id: item.product },
                { $inc: { stock: item.quantity } },
                { new: true }
            );
        }

        order.status = 'cancelled';
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'error al cancelar pedido' });
    }
};

// crear pedido
const createOrder = async (req, res) => {
    try {
        const { products } = req.body || {};

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'no hay productos en el pedido'});
        }

        const processedProducts = [];
        let total = 0;

        for (const item of products) {
            const { product: productId, quantity } = item || {};

            if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({ message: 'producto o cantidad inválida' });
            }

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'producto no encontrado' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ message: 'stock insuficiente' });
            }

            const updatedProduct = await Product.findOneAndUpdate(
                { _id: productId, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(400).json({ message: 'stock insuficiente' });
            }

            processedProducts.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity
            });
            total += product.price * quantity;
        }

        const order = await Order.create({
            user: req.user._id,
            products: processedProducts,
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

module.exports = { createOrder, getMyOrders, cancelOrder };