// models/Delivery.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: function () {
        return this.delivery_type !== "User-to-User";
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    delivery_person_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: function () {
        return this.status !== "pending";
      },
    },
    delivery_type: {
      type: String,
      enum: ["E-commerce", "User-to-User"],
      required: true,
    },
    pickup_address: {
      type: String,
      required: function () {
        return this.delivery_type === "User-to-User";
      },
    },
    delivery_address: {
      type: String,
      required: function () {
        return this.delivery_type === "E-commerce";
      },
    },
    weight: {
      type: Number,
      required: true,
    },
    baseCost: {
      type: Number,
      required: true,
      default: 20,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    costPerKm: {
      type: Number,
      required: true,
    },
    total_distance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "delivered", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
