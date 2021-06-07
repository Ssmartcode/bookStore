const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

const getAllProducts = async (req, res, next) => {
  // Product.getAll((products) => );
  const products = await Product.find();
  res.render("shop/shop", { products });
};
const getProductById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.render("shop/singleProduct", { product });
};

const addToCart = async (req, res, next) => {
  // get product from db
  const productId = req.body.productId;
  console.log(productId);
  const product = await Product.findById(productId);

  // get user's cart from db
  const user = await User.findById(req.user.id);

  // check if product is already in user's cart
  const productInCart = user.cart.items.findIndex((item) => {
    return item.productId.toString() === product.id;
  });
  if (productInCart >= 0) {
    user.cart.items[productInCart].quantity += 1;
  } else {
    user.cart.items.push({ productId: product, quantity: 1 });
  }

  user.cart.totalPrice += +product.price;
  await user.save();
  res.redirect("/shop");
};

const getCartProducts = async (req, res, next) => {
  const existingUser = await User.findById(req.user.id).populate(
    "cart.items.productId"
  );
  const items = existingUser.cart.items.map((item) => {
    return { product: item.productId, quantity: item.quantity };
  });

  res.render("shop/cart", { items, totalPrice: existingUser.cart.totalPrice });
};

const addOrder = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId").execPopulate();

  const order = new Order({
    user: user.id,
    products: user.cart.items.map((item) => {
      return {
        product: { ...item.productId._doc },
        quantity: item.quantity,
      };
    }),
    orderValue: user.cart.totalPrice,
  });
  await order.save();
  user.cart.items = [];
  user.cart.totalPrice = 0;
  await user.save();
  res.redirect("/shop/cart");
};

const getOrders = (req, res, next) => {};

module.exports = {
  getAllProducts,
  getProductById,
  addToCart,
  getCartProducts,
  addOrder,
  getOrders,
};
