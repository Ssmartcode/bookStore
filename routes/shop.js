const express = require("express");

const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addToCart,
  getCartProducts,
  addOrder,
  getOrders,
} = require("../controllers/shop");

router.get("/", getAllProducts);

router.get("/cart", getCartProducts);

router.post("/cart", addToCart);

router.get("/:id", getProductById);

router.post("/orders", addOrder);

router.get("/orders", getOrders);

module.exports = { router };
