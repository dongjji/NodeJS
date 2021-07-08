const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Product = require("./models/product");
const categories = ["fruit", "vegetable", "dairy"];
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

app.get("/products", async(req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render("products/index", { products, category });
    } else {
        const products = await Product.find({});
        res.render("products/index", { products, category: "All" });
    }
});

app.get("/products/new", (req, res) => {
    res.render("products/new", { categories });
});
app.get("/products/:id", async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/show", { product });
    // Product.find({id:_id})
});
app.post("/products", async(req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products`);
});
app.get("/products/:id/edit", async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product, categories });
});
app.put("/products/:id", async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    res.redirect(`/products/${product._id}`);
});
app.delete("/products/:id", async(req, res) => {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.redirect("/products");
});
// delete를 할 때는 따로 ejs 창이 없기 때문에 app.delete를 실행하려면 delete form과 delete button을 만들어야함
// anchor tag를 사용하면 작동하지 않는다.
app.listen(3000, () => {
    console.log("App is Listening on port 3000");
});