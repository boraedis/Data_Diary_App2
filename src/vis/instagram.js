import { doc, deleteField, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db } from './../firebaseInit.js'

import { LineChart } from './charts.js'

// import * as d3 from 'https://unpkg.com/d3?module'

var data
var height = 500
var margin = { top: 20, right: 20, bottom: 30, left: 30 }


async function getData() {
    data = []
    var followers = await getDoc(doc(db, 'views', 'insta_followers'))
    var following = await getDoc(doc(db, 'views', 'insta_following'))
    followers = followers.data()
    following = following.data()
    for (let d in followers) {
        data.push({
            day: d,
            followers: followers[d],
            following: following[d]
        })
    }
}

async function main() {
    var dataset1 = [
        { day: 1, followers: 500 },
        { day: 2, followers: 545 },
        { day: 3, followers: 550 },
        { day: 4, followers: 551 },
        { day: 6, followers: 543 },
        { day: 7, followers: 521 },
        { day: 8, followers: 561 },
        { day: 9, followers: 561 },
        { day: 10, followers: 567 },
        { day: 16, followers: 570 },
        { day: 17, followers: 610 },
        { day: 18, followers: 650 },
        { day: 19, followers: 690 },
        { day: 20, followers: 700 },
    ];
    await getData()
    var chart = LineChart(dataset1, {
        x: d => d.day,
        y: d => d.followers,
        yLabel: "Followers",
        color: "steelblue"
    })

    document.getElementById('chart_place').appendChild(chart)
}

main()