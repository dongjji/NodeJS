// @ts-check

const path = require("path");
const Koa = require("Koa");
const Pug = require("koa-pug");
const route = require("koa-route");
const serve = require("koa-static");
const websockify = require("koa-websocket");
const mount = require("koa-mount");
const app = websockify(new Koa());

// @ts-ignore
// eslint-disable-next-line no-new
new Pug({
  viewPath: path.resolve(__dirname, "./views"),
  app,
});

app.use(mount("/public", serve("src/public")));

app.use(async (ctx) => {
  await ctx.render("main");
});

// Using routes
app.ws.use(
  route.all("/ws", (ctx) => {
    // ctx.websocket.send("Hello World");
    ctx.websocket.on("message", (data) => {
      if (typeof data !== "string") {
        return;
      }
      const { message, nickname } = JSON.parse(data);
      ctx.websocket.send(
        JSON.stringify({
          nickname,
          message,
        })
      );
    });
  })
);

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
