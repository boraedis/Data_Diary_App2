import { collection, query, orderBy, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, app, auth, getDB } from './firebaseInit.js'


async function links() {
    let links = query(collection(db, 'links'), orderBy('Order', 'desc'))
    var tilebar = document.getElementById('links')
    links = await getDocs(links)
    links.forEach((link) => {
        let tile = document.createElement('a')
        link = link.data()
        tile.classList = ['button is-$white']
        tile.style.backgroundColor = '#FFFFFF'
        tile.href = link.Link
        document.getElementById('links').appendChild(tile)
        let pic = document.createElement('img')
        pic.src = link.Image
        console.log(link)
        pic.id = link.id
        pic.style.height = '100%'
        tile.appendChild(pic)
        let name = document.createElement('h1')
        name.innerHTML = link.Title
        tile.appendChild(name)
        tilebar.appendChild(tile)
    })
}

function startTime() {
    const today = new Date();
    document.getElementById('dateText').innerHTML = today.toDateString()
    document.getElementById('timeText').innerHTML = '<strong>' + today.toTimeString().slice(0, 5) + '</strong>'
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}

function googleSearch() {
    var search = $("#searchbar").val()
    window.location = 'https://www.google.com/search?q=' + search
}

async function main() {
    const today = new Date();
    const bday = new Date('2000/04/20')
    let daynum = Math.floor((today - bday) / (1000 * 60 * 60 * 24))
    var max_day = daynum
    var day_data = await getDoc(doc(db, "days", daynum.toString()))
    var day_cur = day_data
    console.log(max_day, day_cur.exists())
    var count = 0
        // if (!(day_data.exists)) {
    while (!(day_cur.exists())) {
        max_day--;
        day_cur = await getDoc(doc(db, "days", max_day.toString()))
        console.log(max_day, day_cur.exists())
        count++;
        if (count >= 100) {
            console.log(1)
            break
        }
    }
    console.log(max_day)
    var date_cur = new Date(day_cur.data().date)
    while (max_day != daynum) {
        max_day++
        date_cur.setDate(date_cur.getDate() + 1)
        setDoc(doc(db, 'days', max_day.toString()), {
            date: date_cur.toDateString()
        })
        console.log(max_day, date_cur)
        console.log('added')
    }

    // var daynums = []
    // var dates = {}
    // var days = await db.collection("days").get()
    // days.forEach((day) => {
    //     daynums.push(parseInt(day.id))
    //     dates[day.id] = new Date(day.data()['date'])
    // })
    // console.log(daynums)
    // let maxday = Math.max(...daynums)
    // console.log(maxday)
    // var curday = maxday + 1
    // var curdate = dates[maxday]
    // console.log(curdate)
    // curdate.setDate(curdate.getDate() + 1);
    // console.log(curday, curdate)
    // while (curday <= daynum) {
    //     db.collection("days").doc(curday.toString()).set({
    //         date: curdate.toDateString()
    //     })
    //     curday++
    //     curdate.setDate(curdate.getDate() + 1);
    //     console.log(curday, curdate)
}
startTime()
links()
main()