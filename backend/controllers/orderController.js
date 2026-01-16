const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;

    if (items && items.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    // Calculate total and formatted items
    const formattedItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }
        if (product.countInStock < item.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        formattedItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
            name: product.name,
            imageUrl: product.imageUrl,
        });

        // Reduce stock
        product.countInStock -= item.quantity;
        await product.save();
    }

    const order = new Order({
        user: req.user._id,
        items: formattedItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json({ data: createdOrder });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.json({ data: orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order) {
        res.json({ data: order });
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json({ data: updatedOrder });
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json({ data: updatedOrder });
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name email").populate("items.product");
    res.json({ data: orders });
});
