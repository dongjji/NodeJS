const User = require("../models/user");

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("validation error");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hash,
      name,
    });
    const newUser = await user.save();
    res.status(201).json({ message: "New User Created!", userId: newUser._id });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    throw e;
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("이메일 혹은 비밀번호가 일치하지 않습니다");
      error.statusCode = 401;
      throw error;
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      const error = new Error("이메일 혹은 비밀번호가 일치하지 않습니다");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      "secret",
      { expiresIn: "1h" }
    ); // new signature json web token
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    throw e;
  }
};
