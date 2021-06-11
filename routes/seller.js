const express = require("express");

const router = express.Router();
const {
  sellerDashboard,
  addProductPOST,
  editProductGET,
  editProductPOST,
  deleteProduct,
} = require("../controllers/seller");

router.get("/", sellerDashboard);

router.post("/", addProductPOST);

router.get("/edit/:id", editProductGET);

router.post("/edit/:id", editProductPOST);

router.post("/delete", deleteProduct);

module.exports = router;
