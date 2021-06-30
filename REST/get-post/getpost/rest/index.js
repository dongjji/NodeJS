// @ts-check
const express = require("express");
const app = express();
const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let comments = [{
        id: uuid(),
        username: "Todd",
        comment: "lol that is so funny!",
    },
    {
        id: uuid(),
        username: "Skyler",
        comment: "I like to go birdwatching with my dog",
    },
    {
        id: uuid(),
        username: "Sk8erBoi",
        comment: "Plz delete your account, Todd",
    },
    {
        id: uuid(),
        username: "onlysayswoof",
        comment: "woof woof woof",
    },
];

// 중요!!
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/tacos", (req, res) => {
    res.send("GET /tacos responese");
});

app.post("/tacos", (req, res) => {
    console.log(req.body);
    const { meat, qty } = req.body;
    res.send(`here is your ${qty} ${meat}`);
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});

app.get("/comments", (req, res) => {
    res.render("comments/index", { comments });
});

app.get("/comments/new", (req, res) => {
    res.render("comments/new");
});

app.post("/comments", (req, res) => {
    const { username, comment } = req.body;
    comments.push({ id: uuid(), username, comment });
    res.redirect("/comments");
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    const comment = comments.find((c) => c.id === id);
    res.render("comments/show", { comment });
});

// 저장할 때마다 id값이 바뀜 uuid()때문
app.patch("/comments/:id", (req, res) => {
    const { id } = req.params;
    const newCommentText = req.body.comment;
    const foundComment = comments.find((c) => c.id === id);
    foundComment.comment = newCommentText;
    res.redirect("/comments");
});

app.get("/comments/:id/edit", (req, res) => {
    const { id } = req.params;
    const comment = comments.find((c) => c.id === id);
    res.render("comments/edit", { comment });
});