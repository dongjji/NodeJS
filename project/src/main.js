// @ts-check
/* eslint-disable no-console */

const express = require("express");
const app = express();

app.use("/", (req, res, next) => {
  res.send("<h1>Hello</h1>");
});

app.listen(3000, () => {
  console.log("servere is listening on port 3000");
});
