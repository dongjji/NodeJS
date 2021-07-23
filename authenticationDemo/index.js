const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

mongoose.connect("mongodb://localhost:27017/authDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "notagoodsecret" }));

const requireLogin = async (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  next();
};

app.get("/", (req, res) => {
  res.send("welcome!!");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    req.session.user_id = user._id;
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({ username, password: hash });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/secret");
});

app.post("/logout", (req, res) => {
  //   req.session.user_id = null;
  req.session.destroy();
  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});

app.get("/topsecret", requireLogin, (req, res) => {
  res.send("top secret!!!");
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
