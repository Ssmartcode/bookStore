const express = require("express");

const router = express.Router();
const {
  sellerDashboard,
  addProductPOST,
  editProductGET,
  editProductPOST,
  deleteProduct,
} = require("../controllers/seller");
const { isAuthenticated } = require("../middleware/isAuth");

router.get("/", isAuthenticated, sellerDashboard);

router.post("/", isAuthenticated, addProductPOST);

router.get("/edit/:id", isAuthenticated, editProductGET);

router.post("/edit/:id", isAuthenticated, editProductPOST);

router.delete("/delete/:productId", isAuthenticated, deleteProduct);

module.exports = router;
