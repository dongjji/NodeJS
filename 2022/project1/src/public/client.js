// @ts-check

//IIFE
(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`);
  const formEl = document.getElementById("chat-form");
  const chatsEl = document.getElementById("chats");

  /**
   * @type {HTMLInputElement | null}
   */
  // @ts-ignore
  const inputEl = document.getElementById("chat-message");

  if (!formEl || !inputEl) {
    throw new Error("Init Failed");
  }

  /**
   * @typedef Chat
   * @property {string} nickname
   * @property {string} message
   */

  /**
   * @type {Chat[]}
   */
  let chats = [];

  const adjectives = [
    "멋진",
    "훌륭한",
    "착한",
    "친절한",
    "이쁜",
    "카리스마 넘치는",
  ];
  const animals = ["물범", "라이언", "어피치", "무지", "콘", "춘식이"];

  /**
   * @param {string[]} array
   * @returns {string}
   */
  function randomName(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  const myNickName = `${randomName(adjectives)} ${randomName(animals)}`;
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    socket.send(
      JSON.stringify({
        nickname: myNickName,
        message: inputEl.value,
      })
    );
    inputEl.value = "";
  });

  //   socket.addEventListener("open", () => {
  //     socket.send("Websocket Client");
  //   });

  socket.addEventListener("message", (event) => {
    const { type, payload } = JSON.parse(event.data);
    if (type === "prevChat") {
      chats = payload.prevChats;
      console.log(payload);
    } else if (type === "newChat") {
      const newChat = payload.newChat;
      chats.push(newChat);
    }
    chatsEl.innerHTML = "";
    chats.forEach(({ nickname, message }) => {
      const div = document.createElement("div");
      div.innerText = `${nickname}: ${message}`;
      chatsEl.append(div);
    });
  });
})();
