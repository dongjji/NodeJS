const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongo connection open!!");
  })
  .catch((err) => {
    console.log("connection error!");
    console.log(err.errors);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// app.set("/dog", (req, res) => {
//   res.send("WOOF!");
// });

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  console.log(products);
  res.render("products/index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("products/new");
});
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  res.render("products/show", { product });
  // Product.find({id:_id})
});
app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect("products");
});
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product });
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});
app.delete("/products/:id", (req, res) => {
  const deleteProduct = new Product(req.body);
  const { id } = req.params;
  deleteProduct.findOneAndDelete({ id: `${id}` });
  deleteProduct.save();
  res.redirect("products");
});
app.listen(3000, () => {
  console.log("App is Listening on port 3000");
});
