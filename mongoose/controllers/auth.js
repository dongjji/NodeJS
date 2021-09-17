const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // TODO: req.flash
    req.flash("error", "존재하지 않는 아이디입니다.");
    return res.redirect("/login");
  }
  const isValid = await bcrypt.compare(password, findUser.password);
  if (!isValid) {
    req.flash("error", "아이디 혹은 비밀번호가 일치하지 않습니다.");
    return res.redirect("/login");
  }
  req.session.isLoggedIn = true;
  req.session.user = findUser;
  return res.redirect("/");
};

exports.getLogout = (req, res, next) => {
  req.session.destroy();
  return res.redirect("/");
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
