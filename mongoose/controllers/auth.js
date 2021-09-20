require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

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
    previousInput: { email: "" },
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // TODO: req.flash
    req.flash("error", "존재하지 않는 아이디입니다.");
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: req.flash("error"),
      previousInput: { email: email },
    });
  }
  const isValid = await bcrypt.compare(password, findUser.password);
  if (!isValid) {
    req.flash("error", "아이디 혹은 비밀번호가 일치하지 않습니다.");
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: req.flash("error"),
      previousInput: { email: email },
    });
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
    errorMessage: "",
    previousInput: { email: "" },
  });
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign UP",
      path: "/signup",
      errorMessage: errors.array().length ? errors.array()[0].msg : "",
      previousInput: { email: email },
    });
  }
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
    html: `
    <div style="text-align: center;">
      <h1>이메일 인증 키</h1>
    </div>
    `,
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
  crypto.randomBytes(64, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const findUser = await User.findOne({ email: req.body.email });
    if (!findUser) {
      req.flash("error", "존재하지 않는 이메일입니다");
      return res.redirect("/reset");
    }
    findUser.resetToken = token;
    findUser.resetTokenExpiration = Date.now() + 60 * 60 * 1000; // 1hour
    await findUser.save();
    res.redirect("/");
    transporter.sendMail({
      to: findUser.email,
      from: "cdj970723@gmail.com",
      subject: "비밀번호 초기화 인증 코드",
      html: `
      <h1>비밀번호 초기화가 요청되었습니다 </h1>
      <p><a href="http://localhost:3000/reset/${token}">클릭</a>하여 비밀번호 초기화 하기</p>
      `,
    });
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const findUser = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!findUser) {
    req.flash("error", "해당 아이디는 존재하지 않는 아이디입니다.");
    return res.redirect("/");
  }
  let message = req.flash("error");
  message = message.length ? message[0] : null;
  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "New Password",
    errorMessage: message,
    userId: findUser._id.toString(),
    passwordToken: token,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  const findUser = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });
  const hash = await bcrypt.hash(password, 12);
  findUser.password = hash;
  findUser.resetToken = undefined;
  findUser.resetTokenExpiration = undefined;
  await findUser.save();
  req.session.isLoggedIn = true;
  req.session.user = findUser;
  res.redirect("/");
};
