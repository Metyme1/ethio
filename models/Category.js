const mongoose = require("mongoose");

const catgorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Category", catgorySchema);
