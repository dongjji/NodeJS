// @ts-check
const { MongoClient } = require("mongodb");

const uri = process.env.mongoURI;

let _db;

const mongoConnect = async (callback) => {
  const client = await MongoClient.connect(process.env.mongoURI, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (!client) {
    throw new Error("Could not find DB");
  } else {
    // @ts-ignore
    _db = client.db();
    callback(client);
    console.log("mongodb conneted!");
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  return "Could Not Find DB";
};

module.exports = { getDb, mongoConnect };
