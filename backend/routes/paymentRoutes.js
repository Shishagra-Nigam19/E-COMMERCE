const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { createRazorpayOrder, verifyPayment, completeOrder } = require("../controllers/paymentController");

router.post("/create-order", auth, createRazorpayOrder);
router.post("/verify", auth, verifyPayment);
router.post("/complete-order", auth, completeOrder);

module.exports = router;
