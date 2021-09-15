const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router
  .get("/login", authController.getLogin)
  .post("/login", authController.postLogin);

module.exports = router;
