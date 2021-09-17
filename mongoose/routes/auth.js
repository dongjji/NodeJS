const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router
  .get("/login", authController.getLogin)
  .post("/login", authController.postLogin);

router.get("/logout", authController.getLogout);

router
  .get("/signup", authController.getSignup)
  .post("/signup", authController.postSignup);

module.exports = router;
