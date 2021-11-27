// @ts-check

const fs = require('fs');

const data = fs.readFileSync('local/big-file', 'utf-8')

// let chunkCount = 0;

let obj = {
    a: 0,
    b: 0
};

/* @type {string | undefined} */
let previousChar;

for (let i = 0; i < data.length; i++) {
    if (data[i] !== previousChar) {
        const newCharacter = data[i]

        if (!newCharacter) continue;

        previousChar = newCharacter
        obj[newCharacter]++;
    }

}

console.log(obj)