const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("613c866e6f9f9d1d9e395674")
    .then((user) => {
      console.log(user);
      console.log(req.user);
      console.log(req.session.user);
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.getLogout = (req, res, next) => {
  isAuthenticated = false;
  req.session.destroy(() => res.redirect("/"));
};
