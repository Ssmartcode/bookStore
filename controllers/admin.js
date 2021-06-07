const Product = require("../models/product");

const addProductGET = (req, res, next) => {
  res.render("admin/dashboard", { editMode: false });
};
const addProductPOST = async (req, res, next) => {
  const { title, price } = req.body;
  const newProduct = new Product({ title, price });
  await newProduct.save();
  res.redirect("/shop");
};
const editProductGET = async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  res.render("admin/dashboard", {
    editMode: true,
    productId,
    product,
  });
};
const editProductPOST = async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);
  product.title = req.body.title;
  product.price = req.body.price;
  await product.save();
  res.redirect("/shop");
};
const deleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await Product.findByIdAndDelete(productId);
  res.redirect("/shop");
};

module.exports = {
  addProductGET,
  addProductPOST,
  editProductGET,
  editProductPOST,
  deleteProduct,
};
