const fs = require("fs");

function processJSON(highWaterMark) {
  const rs = fs.createReadStream("local/json", {
    encoding: "UTF-8",
    highWaterMark,
  });

  let sum = 0;
  let accumulatedJsonStr = "";

  rs.on("data", (data) => {
    // console.log('Event: ', data)

    if (typeof data !== "string") return;

    accumulatedJsonStr += data;
    const lastNewLineIdx = accumulatedJsonStr.lastIndexOf("\n");

    const jsonLineStr = accumulatedJsonStr.substring(0, lastNewLineIdx);
    accumulatedeJsonStr = accumulatedJsonStr.substring(lastNewLineIdx);

    sum += jsonLineStr
      .split("\n")
      .map((jsonLine) => {
        try {
          return JSON.parse(jsonLine);
        } catch {
          return undefined;
        }
      })
      .filter((json) => json)
      .map((json) => json.data)
      .reduce((acc, el) => acc + el, 0);

    // sum = data.split(",\n")
    //     .map(line => {
    //         try {
    //             return JSON.parse(line)
    //         } catch {
    //             return undefined
    //         }
    //     })
    //     .filter(json => json)
    //     .map(json => json.data)
    //     .reduce((sum, el) => sum + el, 0)
  });

  rs.on("end", () => {
    console.log(highWaterMark, ": ", sum);
    console.log("event end");
  });
}

for (let waterMark = 1; waterMark < 50; waterMark++) {
  processJSON(waterMark);
}
