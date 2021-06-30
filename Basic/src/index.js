// @ts-check
const express = require("express");
const app = express();
console.dir(app);

// app.use((req, res) => {
//     console.log("we got a new request");
//     console.log(req);
//     // res.send("Hellllllo~~");
//     res.send("<h1>This is my website</h1>");
// });

app.listen(3000, () => {
    console.log("Listening On Port 3000!!!");
});

app.get("/", (req, res) => {
    res.send("This is the home page !!");
});
// subreddit
app.get("/r/:subreddit/:postID", (req, res) => {
    const { subreddit, postID } = req.params;
    console.log(subreddit);
    console.log(postID);
    res.send("this is a subreddit");
});
app.get("/cats", (req, res) => {
    res.send("Meow!");
});

app.get("/dogs", (req, res) => {
    res.send("woof!!!");
});

app.post("/cats", (req, res) => {
    res.send("post cats!!");
});

app.get("/search", (req, res) => {
    const { q } = req.query;
    res.send(`<h1>search results for : ${q}</h1>`);
    console.log(req.query);
});

app.get("*", (req, res) => {
    res.send(`sorry I don't know that path`);
});