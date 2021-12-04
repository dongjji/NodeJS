// @ts-check

//IIFE
(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`);
  const formEl = document.getElementById("chat-form");
  /**
   * @type {HTMLInputElement | null}
   */
  // @ts-ignore
  const inputEl = document.getElementById("chat-message");

  if (!formEl || !inputEl) {
    throw new Error("Init Failed");
  }

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    socket.send(
      JSON.stringify({
        nickname: "Dong",
        message: inputEl.value,
      })
    );
    inputEl.value = "";
  });

  //   socket.addEventListener("open", () => {
  //     socket.send("Websocket Client");
  //   });

  socket.addEventListener("message", (event) => {
    alert(event.data);
  });
})();
