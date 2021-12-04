// @ts-check

const fs = require("fs");

const ws = fs.createWriteStream("local/big-file");

const NUM_BLOCKS = 500;

let obj = {
  a: 0,
  b: 0,
};

for (let i = 0; i < NUM_BLOCKS; i++) {
  const num = Math.ceil(Math.random() * 200 + 800);
  const character = i % 2 ? "a" : "b";

  ws.write(character.repeat(1024 * num)); // 1024 = KB 1024*1024 = MB

  obj[character]++;
}

console.log(obj);
// ws.write('hello world')
