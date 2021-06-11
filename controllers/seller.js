const Product = require("../models/product");

const sellerDashboard = async (req, res, next) => {
  console.log(req.userId);
  const products = await Product.find({ userId: req.userId });
  console.log(products);
  res.render("seller/dashboard", { editMode: false, products });
};
const addProductPOST = async (req, res, next) => {
  const { title, price } = req.body;
  const userId = req.userId;
  const newProduct = new Product({ title, price, userId });
  await newProduct.save();
  res.redirect("/shop");
};
const editProductGET = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.userId;
  let product;
  try {
    product = await Product.findOne({ _id: productId, userId });
    console.log(product);
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
const deleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await Product.deleteOne({ _id: productId, userId: req.userId });
  res.redirect("/shop");
};

module.exports = {
  sellerDashboard,
  addProductPOST,
  editProductGET,
  editProductPOST,
  deleteProduct,
};
