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
            },
        ],
        total: {
            type: Number,
            required: [true, "Total is required"],
            min: [0, "Total cannot be negative"],
        },
        shippingAddress: {
            street: { type: String, required: [true, "Street address is required"] },
            city: { type: String, required: [true, "City is required"] },
            state: { type: String, required: [true, "State is required"] },
            zipCode: { type: String, required: [true, "Zip code is required"] },
            country: { type: String, required: [true, "Country is required"] },
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
