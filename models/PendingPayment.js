const mongoose = require("mongoose");

// This model stores Razorpay payments that were captured but failed to create orders
// This is a safety net to recover from failed order creations
const pendingPaymentSchema = new mongoose.Schema(
    {
        razorpayPaymentId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpaySignature: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        orderInfo: {
            type: Object, // Stores the full order info for recovery
            required: true,
        },
        error: {
            type: String, // Error message if order creation failed
        },
        status: {
            type: String,
            enum: ["pending", "recovered", "failed", "manual"],
            default: "pending",
        },
        recoveredOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const PendingPayment = mongoose.model("PendingPayment", pendingPaymentSchema);
module.exports = PendingPayment;
