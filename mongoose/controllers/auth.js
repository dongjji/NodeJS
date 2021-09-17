const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // TODO: req.flash
    return res.redirect("/login");
  }
  const isValid = await bcrypt.compare(password, findUser.password);
  console.log(isValid);
  if (isValid) {
    req.session.isLoggedIn = true;
    req.session.user = findUser;
    return res.redirect("/");
  } else {
    res.redirect("/login");
  }
};

exports.getLogout = (req, res, next) => {
  isAuthenticated = false;
  req.session.destroy(() => res.redirect("/"));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign UP",
    path: "/signup",
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    return res.redirect("/signup");
  }
  if (password !== confirmPassword) {
    return res.redirect("/signup");
  }
  const hash = await bcrypt.hash(password, 12);
  const newUser = new User({ email, password: hash, cart: { items: [] } });
  await newUser.save();
  req.session.isLoggedIn = true;
  req.session.user = newUser;
  res.redirect("/");
};
