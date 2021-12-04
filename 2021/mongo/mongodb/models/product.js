const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    if (this._id) {
      return db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    } else {
      return db
        .collection("products")
        .insertOne(this)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    }
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }

  static delete(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then()
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
