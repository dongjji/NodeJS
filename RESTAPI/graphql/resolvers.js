const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
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
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("아이디 혹은 비밀번호가 일치하지 않습니다");
      error.code = 401;
      throw error;
    }
    const isValid = await bcrypt.compare(user.password, password);
    if (!isValid) {
      const error = new Error("아이디 혹은 비밀번호가 일치하지 않습니다");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "supersecrettoken",
      { expiresIn: "1h" }
    );
    return { token: token, userId: user._id.toString() };
  },
  createPost: async (parent, args, req) => {
    console.log(args);
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }
    const { title, content, imageUrl } = args;
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postinput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid" });
    }
    if (
      !validator.isEmpty(postInput.title) ||
      validator.isLength(postinput.title, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user");
      error.code = 401;
      throw error;
    }
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    // Add Post to User
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
};
