const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { auth, admin } = require("../middlewares/auth");

router.route("/").get(getProducts).post(auth, admin, createProduct);
router.route("/:id").get(getProductById).put(auth, admin, updateProduct).delete(auth, admin, deleteProduct);

module.exports = router;
