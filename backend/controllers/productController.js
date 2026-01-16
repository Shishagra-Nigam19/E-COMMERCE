const Product = require("../models/Product");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc    Fetch all products with pagination and search
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: "i",
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json({ data: product });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: req.body.name || "Sample Product",
        price: req.body.price || 0,
        description: req.body.description || "Sample description",
        category: req.body.category || "Sample category",
        brand: req.body.brand || "Sample brand",
        countInStock: req.body.countInStock || 0,
        imageUrl: req.body.imageUrl || "/images/sample.jpg",
    });

    const createdProduct = await product.save();
    res.status(201).json({ data: createdProduct });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, brand, countInStock, imageUrl } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.imageUrl = imageUrl || product.imageUrl;

        const updatedProduct = await product.save();
        res.json({ data: updatedProduct });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed");
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
exports.getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
});
