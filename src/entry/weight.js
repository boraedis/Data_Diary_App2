import { doc, deleteField, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../firebaseInit.js'

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
    let weight = document.getElementById('weight').value
    let bodyfat = document.getElementById('bodyfat').value
    let musclemass = document.getElementById('musclemass').value

    // DATA VALIDATION


    if (weight < 0) {
        alert.innerText = "Weight must be greater than 0"
        alert.hidden = false
        return
    }
    if ((bodyfat > 0) & (bodyfat < 0)) {
        alert.innerText = "Body Fat Percentage must be between 0 to 100"
        alert.hidden = false
        return
    }
    if (musclemass < 0) {
        alert.innerText = "Mucle Mass must be greater than 0"
        alert.hidden = false
        return
    }

    var date = document.getElementById('date').innerText
    var save_data = {}
    if (weight == "") {
        save_data['weight'] = deleteField()
    } else {
        save_data['weight'] = parseFloat(weight)
    }
    if (bodyfat == "") {
        save_data['bodyfat'] = deleteField()
    } else {
        save_data['bodyfat'] = parseFloat(bodyfat)
    }
    if (musclemass == "") {
        save_data['musclemass'] = deleteField()
    } else {
        save_data['musclemass'] = parseFloat(musclemass)
    }

    var day = doc(db, 'days', url_query['day'])
    console.log(save_data)
    updateDoc(day, save_data)
    updateDoc(doc(db, 'views', 'weight'), {
        [url_query['day']]: save_data['weight']
    })
    updateDoc(doc(db, 'views', 'bodyfat'), {
        [url_query['day']]: save_data['bodyfat']
    })
    await updateDoc(doc(db, 'views', 'musclemass'), {
        [url_query['day']]: save_data['musclemass']
    })
    location.reload()
})


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'

    if ('weight' in day_data) {
        // console.log(day_data.sleeptime.toDate().toTimeString().split(' ')[0])
        document.getElementById('weight').value = day_data.weight
    }
    if ('bodyfat' in day_data) {
        document.getElementById('bodyfat').value = day_data.bodyfat
    }
    if ('musclemass' in day_data) {
        document.getElementById('musclemass').value = day_data.musclemass
    }
}

main()