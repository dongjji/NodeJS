const User = require("../models/user");

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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
    await user.save();
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    throw e;
  }
};
