const express = require("express");

const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addToCart,
  getCartProducts,
  addOrder,
  getOrders,
  deleteCartItem,
} = require("../controllers/shop");
const { isAuthenticated } = require("../middleware/isAuth");

router.get("/", getAllProducts);

router.get("/cart", getCartProducts);

router.post("/cart", isAuthenticated, addToCart);

router.get("/:id", getProductById);

router.post("/delete-cart-item", isAuthenticated, deleteCartItem);

router.post("/orders", isAuthenticated, addOrder);

router.get("/orders", isAuthenticated, getOrders);

module.exports = { router };
