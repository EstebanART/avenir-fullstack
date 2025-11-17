const Product = require('../models/productModel.js');

//crear producto
const createProduct = async (req, res) => { 
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'error al crear el producto'});
    }
};


// obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'error al obtener productos' });
    }
};

//obtener producto por id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'producto no encontrado'});
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'error al obtener el producto' });
    }
};

//actualizar producto
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'error al actualizar el producto'});
    }
};

//eliminar producto
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'producto no encontrado'});
        res.json({ message: 'error al eliminar producto' });
    } catch (error) {
        res.status(500).json({ message: 'Producto eliminado' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};