const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
  products: [
    { product: { type: Object, require: true }, quantity: { type: Number } },
  ],
  orderValue: { type: Number, require: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
