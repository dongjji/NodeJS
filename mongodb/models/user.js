const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, id) {
    this.username = username;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    if (this._id) {
      return db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection("users").insertOne(this);
    }
  }

  static findUserById(userId) {
    const db = getDb();
    db.collections("users")
      .findOne({ _id: new ObjectId(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
