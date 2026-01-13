const express = require("express");
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders } = require("../controllers/orderController");
const { auth, admin } = require("../middlewares/auth");

router.route("/").post(auth, addOrderItems).get(auth, admin, getOrders);
router.route("/my-orders").get(auth, getMyOrders);

module.exports = router;
