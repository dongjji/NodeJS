const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const { isLoggedIn } = require("../util/middleware");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isLoggedIn, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", isLoggedIn, adminController.postAddProduct);

router.get(
  "/edit-product/:productId",
  isLoggedIn,
  adminController.getEditProduct
);

router.post("/edit-product", isLoggedIn, adminController.postEditProduct);

router.post("/delete-product", isLoggedIn, adminController.postDeleteProduct);

module.exports = router;
