const Product = require("../models/product");
const Cart = require("../models/cart");

const getAllProducts = async (req, res, next) => {
  // Product.getAll((products) => );
  const products = await Product.find();
  res.render("shop/shop", { products });
};
const getProductById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.render("shop/singleProduct", { product });
};

const addToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addToCart(productId, product.price);
    res.redirect("/shop");
  });
};

const getCartProducts = async (req, res, next) => {
  Cart.getCart((cart) => {
    res.render("shop/cart", {
      products: cart.products,
      totalPrice: cart.totalPrice,
    });
  });
};

const addOrder = (req, res, next) => {};

const getOrders = (req, res, next) => {};

module.exports = {
  getAllProducts,
  getProductById,
  addToCart,
  getCartProducts,
  addOrder,
  getOrders,
};
