const express = require("express");

const router = express.Router();
const Product = require("../models/product");
const {
  addProductGET,
  addProductPOST,
  editProductGET,
  editProductPOST,
  deleteProduct,
} = require("../controllers/admin");

router.get("/", addProductGET);

router.post("/", addProductPOST);

router.get("/edit/:id", editProductGET);

router.post("/edit/:id", editProductPOST);

router.post("/delete", deleteProduct);

module.exports = router;
