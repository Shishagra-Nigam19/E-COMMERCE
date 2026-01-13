const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json({ data: product });
        else res.status(404).json({ message: "Product not found" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ data: product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (product) res.json({ data: product });
        else res.status(404).json({ message: "Product not found" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) res.json({ message: "Product removed" });
        else res.status(404).json({ message: "Product not found" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
