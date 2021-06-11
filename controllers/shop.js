const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

const getAllProducts = async (req, res, next) => {
  const products = await Product.find();
  res.render("shop/shop", { products });
};
const getProductById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.render("shop/singleProduct", { product });
};

const addToCart = async (req, res, next) => {
  const productId = req.body.productId;

  // get product from db
  const product = await Product.findById(productId);

  // get user's cart from db
  userId = req.userId;
  const user = await User.findById(userId);

  // check if product is already in user's cart
  const productInCart = user.cart.items.findIndex((item) => {
    return item.productId.toString() === product.id;
  });
  if (productInCart >= 0) {
    user.cart.items[productInCart].quantity += 1;
  } else {
    user.cart.items.push({ productId, quantity: 1 });
  }

  user.cart.totalPrice += +product.price;
  try {
    await user.save();
  } catch (err) {
    req.flash("error", "Something went wrong. please try agian later");
  }
  req.flash("success", "Your cart has been updated");
  res.redirect("/shop");
};

const getCartProducts = async (req, res, next) => {
  const user = await User.findById(req.userId).populate("cart.items.productId");
  const items = user.cart.items.map((item) => {
    return { product: item.productId, quantity: item.quantity };
  });

  res.render("shop/cart", { items, totalPrice: user.cart.totalPrice });
};

const deleteCartItem = async (req, res, next) => {
  const { productId } = req.body;

  const user = await User.findById(req.userId).populate("cart.items.productId");
  const deletingProduct = user.cart.items.find(
    (item) => item.productId.id.toString() === productId
  );
  const newItems = user.cart.items.filter(
    (item) => item.productId.id.toString() !== productId
  );
  user.cart.items = newItems;
  user.cart.totalPrice -=
    +deletingProduct.productId.price * +deletingProduct.quantity;
  await user.save();
  res.redirect("/shop/cart");
};

const addOrder = async (req, res, next) => {
  const user = await User.findById(req.userId).populate("cart.items.productId");
  const order = new Order({
    user: req.userId,
    products: user.cart.items.map((item) => {
      return {
        product: { ...item.productId._doc },
        quantity: item.quantity,
      };
    }),
    orderValue: user.cart.totalPrice,
  });
  try {
    await order.save();
    user.cart.items = [];
    user.cart.totalPrice = 0;
    await user.save();
  } catch (err) {
    req.flash("error", "Something went wrong. please try agian later");
    return next();
  }
  req.flash("success", "Your order has been sent!");
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
  deleteCartItem,
};
