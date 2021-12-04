// @ts-check

const fs = require('fs');

const rs = fs.createReadStream('local/big-file', {
    encoding: 'utf-8',
})

let chunkCount = 0;

let obj = {
    a: 0,
    b: 0
};

/* @type {string | undefined} */
let previousChar;


rs.on('data', (data) => {
    // console.log(data)
    chunkCount++;
    if (typeof data !== 'string') return;
    
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== previousChar) {
            const newCharacter = data[i]

            if (!newCharacter) continue;

            previousChar = newCharacter
            obj[newCharacter]++;
        }
    }
})

rs.on('end', () => {
    console.log(obj)
    console.log(chunkCount)
    console.log('end')
})