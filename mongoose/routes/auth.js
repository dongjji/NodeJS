const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const { isLoggedIn, alreadyLoggedIn } = require("../util/middleware");

router
  .get("/login", alreadyLoggedIn, authController.getLogin)
  .post("/login", alreadyLoggedIn, authController.postLogin);

router.get("/logout", isLoggedIn, authController.getLogout);

router
  .get("/signup", alreadyLoggedIn, authController.getSignup)
  .post("/signup", alreadyLoggedIn, authController.postSignup);

module.exports = router;
