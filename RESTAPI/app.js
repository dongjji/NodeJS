require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const mongodbURI = `mongodb+srv://dongjoon:${process.env.mongoConnectPassword}@cluster0.u6gwl.mongodb.net/rest?retryWrites=true&w=majority`;

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); // application.json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

// finally
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json(message);
});

mongoose
  .connect(mongodbURI)
  .then((result) => {
    console.log("dbs connected");
    app.listen(8080, () => {
      console.log("server is listening on 8080");
    });
  })
  .catch((err) => console.log(err));
