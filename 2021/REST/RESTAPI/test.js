function main(damp) {
    damp = damp/10
    let omega = 160/damp
    let K_P = omega**2 / 500
    let K_D = (2*damp*omega - 25) / 500

    console.log("------damp: ", damp, "---------")
    console.log("omega: ", omega)
    console.log("K_P: ", K_P)
    console.log("K_D: ", K_D)
    console.log("K_P/K_D: ", K_P/K_D)
    let roundPD = Math.ceil(K_P/K_D)
    let roundOmega = Math.round(damp*roundPD + Math.sqrt(damp**2 * roundPD**2 - 25*roundPD),1)
    let round_P = roundOmega**2 / 500
    let round_D = (2*damp*roundOmega - 25) / 500
    console.log("Round Omgea: ", roundOmega)
    console.log("Round K_P: ", round_P)
    console.log("Round K_D: ", round_D)
    console.log("Round K_P/K_D: ", roundPD)
    console.log("------ Root Locus ------")
    console.log(`500 * [1, ${roundPD}]`)
    console.log(`[1 25 0]`)
    console.log("------ step response ------")
    console.log(`500 * [${round_D}, ${round_P}]`)
    console.log(`[1 25 0]`)
    console.log()
    let settlingTime = 4 / roundOmega*damp
}

// const fs = require('fs')
// const ws = fs.createWriteStream('test.txt')

function main2(damp) {
    damp = damp/100
    let omega = 160/damp
    let K_P = omega**2 / 500
    let K_D = (2*damp*omega - 25) / 500

    let str=""

    console.log("------damp: ", damp, "---------")
    console.log("omega: ", omega)
    // console.log("K_P: ", K_P)
    // console.log("K_D: ", K_D)
    console.log("정착시간을 최소한으로 만족시키는 K_P/K_D: ", K_P/K_D) // settling time을 최소한으로 만족시킬 때의 K_P / K_D 값
    let overShoot = 100 * 2.71828182846 ** (-damp * Math.PI / Math.sqrt(1-damp**2)) 
    for (let i = 0; i < 200; i++) {
        let roundPD = Math.ceil(K_P/K_D) + i // K_P / K_D 값을 1씩 총 200번 증가시키면서(비용증가) settling time확인
        let roundOmega = damp*roundPD + Math.sqrt(damp**2 * roundPD**2 - 25*roundPD)
        let round_P = roundOmega**2 / 500
        let round_D = (2*damp*roundOmega - 25) / 500
        console.log("-------------damp: ", damp, "K_P/K_D: ", roundPD, "-------------------")
        console.log("Omgea: ", roundOmega)
        console.log("K_P: ", round_P)
        console.log("K_D: ", round_D)
        console.log("K_P/K_D: ", roundPD)
        console.log("------ Root Locus ------")
        console.log(`500 * [1, ${roundPD}]`)
        console.log(`[1 25 0]`)
        console.log("------ step response ------")
        console.log(`500 * [${round_D}, ${round_P}]`)
        console.log(`[1 25 0]`)
        console.log("------ Result ------")
        let settlingTime = 4 / (roundOmega*damp)
        console.log("Settling Time: ", settlingTime)
        console.log("Over Shoot: ", overShoot)
        console.log("Cost: ", round_D)
        console.log()
        str += "------------damp: " + damp.toString() + "         K_P / K_D값: " + roundPD.toString() + "-------------\n" + 
         "정착시간: " + settlingTime.toString() + 
         "\nK_D(비용): " + round_D.toString() + 
         "\n오버슈트: " + overShoot.toString() + 
         "\n주파수: " + roundOmega.toString() + 
         "\n---------------------------------\n"
    }
    // ws.write(str)
    return;
}

let shortTime = Infinity
for (let i = 70; i >= 70 ; i = i-1) {
    main2(i)
}

// main2(43.5)