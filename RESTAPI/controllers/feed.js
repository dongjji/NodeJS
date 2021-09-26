const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
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

exports.createPost = async (req, res, next) => {
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
    if (!req.file) {
      const error = new Error("No image provided");
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path;
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: { name: "DongDong" },
    });
    console.log(post);
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

exports.getPost = async (req, res, next) => {
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

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.updatePost = async (req, res, next) => {
  try {
    const { postId, title, content } = req.body;
    const imageUrl = req.file ? req.file.path : req.body.image;
    if (!imageUrl) {
      const error = new Error("no file pciked.");
      error.statusCode = 422;
      throw error;
    }
    const findPost = await Post.findOne({ id: postId });
    if (!findPost) {
      const error = new Erorr("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    if (imageUrl !== findPost.imageUrl) {
      clearImage(findPost.imageUrl);
    }
    const updatePost = await Post.findByIdAndUpdate(postId, {
      $set: {
        title: title,
        imageUrl: imageUrl,
        content: content,
      },
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    throw e;
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.body;
  // const deletePost = await Post.findByIdAndDelete(postId);
  const deletePost = await Post.findById(postId);
  if (deletePost) {
    clearImage(deletePost.imageUrl);
  }
  await Post.deleteOne({ id: postId });

  res.status(200).json({ message: "Complete" });
};
