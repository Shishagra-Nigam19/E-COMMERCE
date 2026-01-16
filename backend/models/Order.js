const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
                price: { type: Number, required: true },
                name: { type: String, required: true },
                imageUrl: { type: String },
            },
        ],
        shippingAddress: {
            street: { type: String, required: [true, "Street address is required"] },
            city: { type: String, required: [true, "City is required"] },
            state: { type: String, required: [true, "State is required"] },
            zipCode: { type: String, required: [true, "Zip code is required"] },
            country: { type: String, required: [true, "Country is required"] },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: "Razorpay",
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        // Keep legacy fields for backwards compatibility
        total: { type: Number },
        paymentStatus: { type: String },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
