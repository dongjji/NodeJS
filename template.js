const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
// setting views directory
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});

app.get("/rand", (req, res) => {
    const num = Math.floor(Math.random() * 10 + 1);
    res.render("home.ejs", { num: num });
});

app.get("/cats", (req, res) => {
    const cats = ["Monty", "Blue", "Rocket", "Stephanie", "Wiston"];
    res.render("cats.ejs", { cats: cats });
});