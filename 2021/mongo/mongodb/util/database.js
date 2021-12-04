const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://dongjoon:${process.env.mongoConnectPassword}@cluster0.u6gwl.mongodb.net/shop?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  return "No Database Found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
