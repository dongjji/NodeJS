const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

module.exprots = {
  createUser: async (args, req) => {
    const errors = [];
    const { email, password, name } = args.userInput;
    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is Invalid" });
    }
    if (
      !validator.isEmpty(password) ||
      !validator.isLength(password, { min: 8 })
    ) {
      errors.push({ message: "Password is Invalid" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User exists already");
      throw error;
    }
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hash,
      name,
    });
    const createdUser = await user.save();
    console.log(...createdUser._doc);
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};
