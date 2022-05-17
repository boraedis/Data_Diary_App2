import { collection, query, orderBy, doc, deleteField, getDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, app, auth, processQuery } from '../firebaseInit.js'

var url_query = processQuery()

function yesterday() {
    var url_query = processQuery()
    url_query.day = parseInt(url_query.day) - 1
    var q = '?'
    for (let x in url_query) {
        q = q + x + '=' + url_query[x] + '&'
    }
    q = q.slice(0, q.length - 1)
    window.location = location.pathname + q
}

function tomorrow() {
    var url_query = processQuery()
    url_query.day = parseInt(url_query.day) + 1
    var q = '?'
    for (let x in url_query) {
        q = q + x + '=' + url_query[x] + '&'
    }
    q = q.slice(0, q.length - 1)
    window.location = location.pathname + q
}

function clear() {
    var inputs = document.getElementsByTagName('input')
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = ''
    }
}

document.getElementById('yesterday').addEventListener('click', yesterday)
document.getElementById('tomorrow').addEventListener('click', tomorrow)
document.getElementById('clear').addEventListener('click', clear)


document.getElementById('submit_button').addEventListener('click', async function submitform() {
    console.log('submitting form!!')
    let alert = document.getElementById('alert')
    alert.hidden = true

    // IMPORTS
    let happiness = document.getElementById('happiness').value
    let reason = document.getElementById('reason').value

    // DATA VALIDATION


    if ((happiness > 100) | (happiness < 0)) {
        alert.innerText = "Happiness must be between 0 to 100"
        alert.hidden = false
        return
    }

    var date = document.getElementById('date').innerText
    var save_data = {}
    if (happiness == "") {
        save_data['happiness'] = deleteField()
    } else {
        save_data['happiness'] = happiness
    }
    if (reason == "") {
        save_data['reason'] = deleteField()
    } else {
        save_data['reason'] = reason
    }

    var day = doc(db, 'days', url_query['day'])
    console.log(save_data)
    updateDoc(day, save_data)
    updateDoc(doc(db, 'views', 'happiness'), {
        [url_query['day']]: save_data['happiness']
    })
    await updateDoc(doc(db, 'views', 'reason'), {
        [url_query['day']]: save_data['reason']
    })
    location.reload()
})


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'

    if ('happiness' in day_data) {
        // console.log(day_data.sleeptime.toDate().toTimeString().split(' ')[0])
        document.getElementById('happiness').value = day_data.happiness
    }
    if ('reason' in day_data) {
        document.getElementById('reason').value = day_data.reason
    }
}

main()