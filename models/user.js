const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userPassword: { type: String, required: true },
  userMail: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
});

module.exports = mongoose.model("User", userSchema);
