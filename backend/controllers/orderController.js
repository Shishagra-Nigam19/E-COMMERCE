const Order = require("../models/Order");
const Product = require("../models/Product");

exports.addOrderItems = async (req, res) => {
    const { items, shippingAddress, paymentStatus } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: "No order items" });
    }

    try {
        // Calculate total and formatted items
        let total = 0;
        const formattedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
            if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

            total += product.price * item.quantity;
            formattedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: req.user._id,
            items: formattedItems,
            total,
            shippingAddress,
            paymentStatus: paymentStatus || "pending"
        });

        const createdOrder = await order.save();
        res.status(201).json({ data: createdOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.product");
        res.json({ data: orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id name email").populate("items.product");
        res.json({ data: orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
