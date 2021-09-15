exports.getLogin = (req, res, next) => {
  console.log(req.get("Cookie"));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  res.setHeader("Set-Cookie", "isLoggedIn=true");
  res.redirect("/");
};
