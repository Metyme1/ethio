const mongoose = require("mongoose");

const specialPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Birthday", "Holiday", "Event", "Other"],
    required: true,
  },
  deliveryDate: { type: Date, required: false },
  customMessage: { type: String, required: false },
});

module.exports = mongoose.model("SpecialPackage", specialPackageSchema);
