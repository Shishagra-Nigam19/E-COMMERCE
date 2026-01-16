const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
} = require("../controllers/productController");
const { auth, admin } = require("../middlewares/auth");

// Top products must be before /:id to avoid route conflict
router.get("/top", getTopProducts);
router.route("/").get(getProducts).post(auth, admin, createProduct);
router.route("/:id").get(getProductById).put(auth, admin, updateProduct).delete(auth, admin, deleteProduct);
router.route("/:id/reviews").post(auth, createProductReview);

module.exports = router;
