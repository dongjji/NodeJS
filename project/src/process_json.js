const fs = require("fs");

const rs = fs.createReadStream('local/json', {
    encoding: "UTF-8",
    highWaterMark: 6
})

let sum;

rs.on('data', (data) => {
    console.log('Event: ', data)

    if (typeof data !== 'string') return;

    sum = data.split(",\n")
        .map(line => {
            try {
                return JSON.parse(line)
            } catch {
                return undefined
            }
        })
        .filter(json => json)
        .map(json => json.data)
        .reduce((sum, el) => sum + el, 0)
})

rs.on('end', () => {
    console.log(sum)
    console.log('event end')
})