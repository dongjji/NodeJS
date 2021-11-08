const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    // const error = new Error("로그인 인증이 되지 않앗습니다.1");
    // error.statusCode = 401;
    // throw error;
    req.isAuth = false;
    return next();
  }
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (e) {
    // e.statusCode = 500;
    // throw e;
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    // const error = new Error("로그인 인증이 되지 않았습니다.2");
    // error.statusCode = 401;
    // throw error;
    req.isAuth = false;
    return next();
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};
