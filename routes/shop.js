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
  getOrder,
} = require("../controllers/shop");
const { isAuthenticated } = require("../middleware/isAuth");

router.get("/", getAllProducts);

router.get("/product/:id", getProductById);

router.get("/cart", isAuthenticated, getCartProducts);

router.post("/cart", isAuthenticated, addToCart);

router.get("/orders", isAuthenticated, getOrders);

router.post("/orders", isAuthenticated, addOrder);

router.get("/orders/:orderId", isAuthenticated, getOrder);

router.post("/delete-cart-item", isAuthenticated, deleteCartItem);

module.exports = { router };
