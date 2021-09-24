const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: "success", posts: posts });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.createPosts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation Failed, Entered data is incorredt");
      error.statusCode = 422;
      throw error;
      // return res.status(422).json({
      //   message: "Validation Failed, Entered data is incorredt",
      //   errors: errors.array(),
      // });
    }
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl: "images/duck.jpeg",
      creator: { name: "DongDong" },
    });
    await post.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: {
        _id: new Date().toISOString(),
        title,
        content,
        creator: {
          name: "DongDong",
        },
        createdAt: new Date(),
      },
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

module.exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const findPost = await Post.findOne({ id: postId });
    if (!findPost) {
      const error = new Error("Could not find the post");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "found", post: findPost });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

module.exports.deletePost = async (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ message: "Complete" });
};
