require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.sendgridApiKey,
    },
  })
);

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
    req.flash("error", "이미 존재하는 이메일입니다.");
    return res.redirect("/signup");
  }
  if (password !== confirmPassword) {
    return res.redirect("/signup");
  }
  const hash = await bcrypt.hash(password, 12);
  const newUser = new User({ email, password: hash, cart: { items: [] } });
  await newUser.save();
  transporter.sendMail({
    to: email,
    from: "cdj970723@gmail.com",
    subject: "회원가입 인증 메일",
    html: "<h1>인증되셨습니다</h1>",
  });

  req.session.isLoggedIn = true;
  req.session.user = newUser;
  return res.redirect("/");
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  message = message.length ? message[0] : null;
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(64, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
  });
};
