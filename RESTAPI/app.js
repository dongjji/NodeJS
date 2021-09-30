require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
// const graphqlHttp = require("express-graphql").graphqlHttp;
const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const userRoutes = require("./routes/user");
const mongodbURI = `mongodb+srv://dongjoon:${process.env.mongoConnectPassword}@cluster0.u6gwl.mongodb.net/rest?retryWrites=true&w=majority`;

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); // application.json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
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
app.use("/auth", userRoutes);
app.use(
  "/graphql",
  graphqlHTTP({
    shcema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message;
      const code = err.originalError.code || 500;
      return { message, status: code, data };
    },
  })
);

// finally
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json(message, data);
});

mongoose
  .connect(mongodbURI)
  .then((result) => {
    console.log("dbs connected");
    const server = app.listen(8080, () => {
      console.log("server is listening on 8080");
    });
    const io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
