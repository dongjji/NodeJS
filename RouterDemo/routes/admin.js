const express = require("express");
const router = express.Router();

router.get("/topsecret", (req, res) => {
  res.send("this is top secret");
});

router.get("/deleteverything", (req, res) => {
  res.send("ok delete all");
});

module.exports = router;
