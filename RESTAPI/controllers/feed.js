const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");
const io = require("../socket");

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({ message: "success", posts, totalItems });
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
      creator: req.userId,
    });

    const newPost = await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    io.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });
    res.status(201).json({
      message: "Post created successfully!",
      post: newPost,
      creator: { _id: user._id, name: user.name },
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
    const findPost = await Post.findById(postId);
    if (!findPost) {
      const error = new Error("Could not find the post");
      error.statusCode = 404;
      throw error;
    }
    console.log(findPost);
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
    const findPost = await Post.findOne({ id: postId })
      .populate("creator")
      .sort({ createdAt: -1 });
    if (findPost.creator._id.toString() !== req.userId) {
      const error = new Error("접근 권한이 없습니다");
      error.statusCode = 403;
      throw error;
    }
    findPost.title = title;
    findPost.content = content;
    findPost.imageUrl = imageUrl;
    const result = await findPost.save();
    io.getIO().emit("posts", { action: "update", post: result });

    if (imageUrl !== findPost.imageUrl) {
      clearImage(findPost.imageUrl);
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    throw e;
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  // const deletePost = await Post.findByIdAndDelete(postId);
  const deletePost = await Post.findById(postId);
  if (deletePost.creator.toString() !== req.userId) {
    res.redirect("/");
    const error = new Error("접근 권한이 없습니다");
    error.statusCode = 403;
    throw error;
  }
  if (deletePost) {
    clearImage(deletePost.imageUrl);
  }
  await Post.deleteOne({ id: postId });
  const user = await User.findById(req.userId);
  user.posts.pull(postId);
  await user.save();
  io.getIO().emit("posts", { action: "delete", post: postId });

  res.status(200).json({ message: "Complete" });
};
