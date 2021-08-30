// @ts-check

// 프레임워크 없이 웹 서버 만들기

const http = require("http");

const { routes } = require("./api");

// // JSdoc
// /**
//  * @typedef Post
//  * @property {string} id
//  * @property {string} title
//  * @property {string} content
//  */

// /**@type {Post[]} */
// const posts = [
//   {
//     id: "It_s_me",
//     title: "My first post",
//     content: "hello world!",
//   },
//   {
//     id: "It_s_you",
//     title: "My second post",
//     content: "say hello!",
//   },
// ];

const server = http.createServer((req, res) => {
  // const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/;
  // // exec를 사용하게되면 괄호 친 부분에 해당하는 조건에 만족하는 문자열이 리턴된 배열의 1번 인덱스에 자리함
  // const postIdRegexResult =
  //   (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;
  // if (req.method === "GET" && req.url === "/posts") {
  //   // get /posts
  //   const result = {
  //     posts: posts.map((post) => ({
  //       id: post.id,
  //       title: post.title,
  //     })),
  //     totalCount: posts.length,
  //   };
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "application/json; charset=utf-8");
  //   res.end(JSON.stringify(result));
  // } else if (postIdRegexResult && req.method == "GET") {
  //   // get /posts/:id
  //   const postId = postIdRegexResult[1];
  //   const post = posts.find((_post) => _post.id === postId);
  //   if (post) {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "application/json; charset=utf-8");
  //     res.end(JSON.stringify(post));
  //   } else {
  //     res.statusCode = 400;
  //     res.end("Post not Found");
  //   }
  // } else if (req.url === "/posts" && req.method === "POST") {
  //   // post /posts
  //   req.setEncoding("utf-8");
  //   req.on("data", (data) => {
  //     /**
  //      * @typedef CreatePostBody
  //      * @property {string} title
  //      * @property {string} content
  //      * */
  //     /** @type {CreatePostBody} */
  //     const body = JSON.parse(data);
  //     posts.push({
  //       id: body.title.toLowerCase().trim().replace(" ", ""),
  //       title: body.title,
  //       content: body.content,
  //     });
  //   });
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "application/json; charset=utf-8");
  //   res.end(JSON.stringify(posts));
  // } else {
  //   res.statusCode = 404;
  //   res.end("Not Found");
  // }
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.method === req.method
    );

    if (!req.url || !route) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    const regexResult = route.url.exec(req.url);

    if (!regexResult) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    /** @type {Object.<*, *> | undefined} */
    const reqBody =
      (req.headers["content-type"] === "application/json" &&
        (await new Promise((resolve, reject) => {
          req.setEncoding("utf-8");
          req.on("data", (data) => {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error("Ill-formed json"));
            }
          });
        }))) ||
      undefined;

    const result = await route.callback(regexResult, reqBody);
    res.statusCode = result.statusCode;
    if (typeof result.body === "string") {
      res.end(result.body);
    } else {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(result.body));
    }
  }

  main();
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`server is listening at port :${PORT}`);
});

// http POST localhost:3000/posts title=foo content=bar --print=hHbB HB(보낸거)hb(받은거)
