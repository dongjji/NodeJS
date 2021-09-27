const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const userController = require("../controllers/user");

const User = require("../models/user");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("등록된 이메일이 이미 존재합니다");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 8 }),
    body("name").trim().not().isEmpty(),
  ],
  userController.signup
);

module.exports = router;
