const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    delivery_status: {
      type: String,
      enum: [
        "pending",
        "on-going",
        "delivered",
        "canceled",
        "confirmed",
        "processing",
        "out-for-delivery",
      ],
      default: "pending",
    },
    total_price: { type: Number, required: true },
    order_type: {
      type: String,
      enum: ["E-commerce", "User-to-User"],
      default: "E-commerce",
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    text_on_delivery: { type: String },
    delivery_date: { type: Date },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
