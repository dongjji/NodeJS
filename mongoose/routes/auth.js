const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const User = require("../models/user");

const authController = require("../controllers/auth");
const { isLoggedIn, alreadyLoggedIn } = require("../util/middleware");

router
  .get("/login", alreadyLoggedIn, authController.getLogin)
  .post("/login", alreadyLoggedIn, authController.postLogin);

router.get("/logout", isLoggedIn, authController.getLogout);

router.get("/signup", alreadyLoggedIn, authController.getSignup).post(
  "/signup",
  alreadyLoggedIn,
  [
    check("email")
      .isEmail()
      .withMessage("회원가입 형식에 맞지 않습니다.")
      .custom((value, { req }) => {
        User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("이미 존재하는 이메일 아이디입니다");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "비밀번호는 최소 8글자 이상의 영문과 숫자의 조합이어야 합니다."
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("입력하신 비밀번호와 일치하지 않습니다.");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router
  .get("/reset", authController.getReset)
  .post("/reset", authController.postReset)
  .get("/reset/:token", authController.getNewPassword)
  .post("/new-password", authController.postNewPassword);

module.exports = router;
