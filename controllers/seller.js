const path = require("path");
const mongoose = require("mongoose");

const Product = require("../models/product");
const User = require("../models/user");
const deleteFile = require("../utilities/deleteFile");

const sellerDashboard = async (req, res, next) => {
  const products = await Product.find({ userId: req.userId });
  res.render("seller/dashboard", { editMode: false, products });
};
const addProductPOST = async (req, res, next) => {
  const { title, price } = req.body;
  const userId = req.userId;
  if (!req.file) {
    const err = new Error("Your uploaded file is not an image");
    err.code = 422;
    return next(err);
  }
  const newProduct = new Product({
    title,
    price,
    image: req.file.filename,
    userId,
  });
  await newProduct.save();
  res.redirect("/shop");
};
const editProductGET = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.userId;
  let product;
  try {
    product = await Product.findOne({ _id: productId, userId });
    if (!product) throw new Error("You can't edit this product");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/shop");
  }
  res.render("seller/dashboard", {
    editMode: true,
    productId,
    product,
  });
};
const editProductPOST = async (req, res, next) => {
  const productId = req.params.id;
  let product;
  try {
    product = await Product.findOne({ _id: productId, userId: req.userId });
    if (!product) throw new Error("You can't edit this product");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/shop");
  }
  product.title = req.body.title;
  product.price = req.body.price;
  await product.save();
  res.redirect("/shop");
};

//! when you delete product from shop you also need to delete it from cart

const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);

    // const sess = await mongoose.startSession();
    // sess.startTransaction();

    // deleteFile(
    //   path.join(__dirname, "..", "public", "uploads", "images", product.image)
    // );
    // await Product.deleteOne({
    //   _id: productId,
    //   userId: req.userId,
    // });

    const cart = await User.updateMany({
      $pull: { "cart.items": { productId: productId } },
    });

    // sess.commitTransaction();
  } catch (err) {
    const error = new Error(
      "We could not delete this product. Try agiain later"
    );
    error.code = 500;
    return next(error);
  }
  res.status(201).json({ success: "success" });
};

module.exports = {
  sellerDashboard,
  addProductPOST,
  editProductGET,
  editProductPOST,
  deleteProduct,
};
