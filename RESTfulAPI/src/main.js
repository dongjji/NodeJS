// @ts-check
// 프레임워크 없이 웹 서버 만들기

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/posts") {
    res.statusCode = 200;
    res.end("hello1");
  } else if (req.url === "/posts/:id" && req.method === "GET") {
    res.statusCode = 200;
    res.end("hello2");
  } else if (req.url === "/posts" && req.method === "POST") {
    res.statusCode = 200;
    res.end("hello3");
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`server is listening at port :${PORT}`);
});
