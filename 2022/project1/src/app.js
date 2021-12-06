// @ts-check

require("dotenv").config();
const path = require("path");
const Koa = require("Koa");
const Pug = require("koa-pug");
const route = require("koa-route");
const serve = require("koa-static");
const websockify = require("koa-websocket");
const mount = require("koa-mount");
const app = websockify(new Koa());
const mongoConnect = require("./database").mongoConnect;
const getDb = require("./database").getDb;

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
  route.all("/ws", async (ctx) => {
    const db = getDb();
    // ctx.websocket.send("Hello World");
    ctx.websocket.on("message", async (data) => {
      if (typeof data !== "string") {
        return;
      }

      //previous chat
      const prevChats = await db
        .collection("chats")
        .find({}, { sort: { createdAt: 1 } })
        .toArray();
      ctx.websocket.send(
        JSON.stringify({
          type: "prevChat",
          payload: {
            prevChats,
          },
        })
      );

      // new chat
      const newChat = JSON.parse(data);
      db.collection("chats").insertOne({
        ...newChat,
        createdAt: new Date(),
      });

      const { server } = app.ws;

      if (!server) {
        return;
      }

      // update all socket
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "newChat",
            payload: {
              newChat,
            },
          })
        );
      });
      // ctx.websocket.send(
      //   JSON.stringify({
      //     nickname,
      //     message,
      //   })
      // );
    });
  })
);
mongoConnect(() => {
  app.listen(3000, () => {
    console.log("app is listening on port 3000");
  });
});
