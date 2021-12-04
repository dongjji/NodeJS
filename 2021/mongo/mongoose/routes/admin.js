const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const { isLoggedIn } = require("../util/middleware");
const { body } = require("express-validator");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isLoggedIn, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isLoggedIn,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  isLoggedIn,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  isLoggedIn,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postEditProduct
);

router.post("/delete-product", isLoggedIn, adminController.postDeleteProduct);

module.exports = router;
