import axios from "axios";
import express  from "express"
import fetch from "node-fetch"
const app = express();

const URL = "https://kox947ka1a.execute-api.ap-northeast-2.amazonaws.com/prod/users"
const token = "f3d66bc0768c680c59aa6fe7dad0bad8"

const startAPI = async (problem) => {
    const res = await fetch(`${URL}/start`, {
        method: "POST",
        headers: {
            'X-Auth-Token': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "problem": problem
        })  
    })
    const resData = await res.json()
    return resData.auth_key
}

const locationAPI = async (auth_key) => {
    const res = await fetch(`${URL}/locations`, {
        method: "GET",
        headers: {
            'Authorization': auth_key,
            'Content-Type': 'application/json',
        },
    })
    const resData = await res.json()
    console.log(resData)
    return resData.locations
}

const truckAPI = async (auth_key) => {
    const res = await fetch(`${URL}/trucks`, {
        method: "GET",
        headers: {
            'Authorization': auth_key,
            'Content-Type': 'application/json',
        },
    })
    const resData = await res.json()
    console.log(resData)
    return resData.trucks
}

const scoreAPI = async (auth_key) => {
    const res = await fetch(`${URL}/score`, {
        method: "GET",
        headers: {
            'Authorization': auth_key,
            'Content-Type': 'application/json',
        },
    })
    const resData = await res.json()
    console.log(resData)
    return resData.score
}

const simulateAPI = async  (auth_key) => {
    const res = await fetch(`${URL}/simulate`, {
        method: "PUT",
        headers: {
            'Authorization': auth_key,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "commands": [
                {"truck_id": 0, "command": [0]},
                {"truck_id": 1, "command": [0]},
                {"truck_id": 2, "command": [0]},
                {"truck_id": 3, "command": [0]},
                {"truck_id": 4, "command": [0]},
            ]
        })
    })
    const resData = await res.json()
    return resData
}

// const simulateAPI = async

const solve = async () => {
    const auth_key = await startAPI(2);
    for (let i = 0; i < 720; i++) {
        await simulateAPI(auth_key)
    }
    locationAPI(auth_key)
    truckAPI(auth_key)
    scoreAPI(auth_key)
}

solve()

app.listen(3000)