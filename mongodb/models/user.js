const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const db = getDb();

    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId === product._id;
    });

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      this.cart.items[cartProductIndex].quantity += 1;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: 1,
      });
    }
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCartItems } }
      );
  }

  static findUserById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
