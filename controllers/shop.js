const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const productsPerPage = 3;

const getAllProducts = async (req, res, next) => {
  const p = +req.query.p || 1;
  const productsCount = await Product.countDocuments();
  const products = await Product.find()
    .limit(productsPerPage)
    .skip(productsPerPage * (p - 1));
  res.render("shop/shop", {
    products,
    totalPages: Math.ceil(productsCount / productsPerPage),
    currentPage: p,
    nextPage: p + 1,
    prevPage: p - 1,
  });
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
    console.log(err);
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
  const { productId } = req.params;

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
  res.status(201);
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

const getOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.userId });
  res.render("shop/orders", { orders });
};

const getOrder = async (req, res, next) => {
  req.path = "/shop";
  const { orderId } = req.params;
  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    return next(err);
  }
  const invoice = new PDFDocument();
  const invoicePath = path.join(__dirname, "..", "invoices");
  invoice.pipe(fs.createWriteStream(path.join(invoicePath, "invoice.pdf")));

  // invoice title
  invoice.fontSize(20).font("Times-Bold").text(`Order number: #${order.id}`);
  // invoice product
  invoice.moveDown();
  invoice
    .fontSize(18)
    .font("Times-Roman")
    .text("Ordered products:", { align: "center" });
  invoice.text("---------------------------", { align: "center" });
  invoice.moveDown();
  order.products.forEach((item) => {
    invoice.fontSize(14).text(`Product: ${item.product.title}`, 100);
    invoice.text(`Quantity: ${item.quantity}`, 120);
    invoice.text(`Price: ${item.product.price}`, 120);
  });

  res.setHeader("Content-type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=invoice");

  invoice.pipe(res);
  invoice.end();
};

module.exports = {
  getAllProducts,
  getProductById,
  addToCart,
  getCartProducts,
  addOrder,
  getOrders,
  getOrder,
  deleteCartItem,
};
