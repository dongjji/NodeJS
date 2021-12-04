const express = require("express");
const app = express();
const session = require("express-session");

const sessionOptions = {
  secret: "thoisisnotgoodsecret",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));

app.get("/viewcount", (req, res) => {
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  res.send(`you have viewd this page ${req.session.count} times`);
});

app.get("/register", (req, res) => {
  const { username = "unknown" } = req.query;
  req.session.username = username;
  res.redirect("/greet");
});

app.get("/greet", (req, res) => {
  res.send(`Hi ${req.session.username}`);
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
