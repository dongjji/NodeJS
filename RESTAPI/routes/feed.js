const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

router.get("/posts", isAuth.isAuth, feedController.getPosts);

router
  .post(
    "/post",
    isAuth.isAuth,
    [
      body("title").trim().isLength({ min: 5 }),
      body("content").trim().isLength({ min: 5 }),
    ],
    feedController.createPost
  )
  .delete("/post", isAuth.isAuth, feedController.deletePost);

router
  .get("/post/:postId", isAuth.isAuth, feedController.getPost)
  .put(
    "/post/:postId",
    isAuth.isAuth,
    [
      body("title").trim().isLength({ min: 5 }),
      body("content").trim().isLength({ min: 5 }),
    ],
    feedController.updatePost
  )
  .delete("/post/:postId", isAuth.isAuth, feedController.deletePost);

module.exports = router;
