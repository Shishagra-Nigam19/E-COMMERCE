const express = require("express");
const router = express.Router();
const {
    addOrderItems,
    getMyOrders,
    getOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered
} = require("../controllers/orderController");
const { auth, admin } = require("../middlewares/auth");

router.route("/").post(auth, addOrderItems).get(auth, admin, getOrders);
router.route("/myorders").get(auth, getMyOrders);
router.route("/:id").get(auth, getOrderById);
router.route("/:id/pay").put(auth, updateOrderToPaid);
router.route("/:id/deliver").put(auth, admin, updateOrderToDelivered);

module.exports = router;
