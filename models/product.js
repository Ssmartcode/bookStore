const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, require: true },
  price: { type: String, require: true },
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);
