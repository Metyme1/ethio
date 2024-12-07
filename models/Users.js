const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "delivery-person", "call-person", "customer"],
      default: "customer",
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
