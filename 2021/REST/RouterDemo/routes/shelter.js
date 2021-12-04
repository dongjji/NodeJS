const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("all 1");
});

router.get("/:id", (req, res) => {
  res.send("all 2");
});

router.get("/:id/edit", (req, res) => {
  res.send("all 3");
});

module.exports = router;
