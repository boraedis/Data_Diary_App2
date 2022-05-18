import { collection, query, orderBy, doc, deleteField, getDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, app, auth, processQuery } from '../firebaseInit.js'

var url_query = processQuery()

async function submitform() {
    console.log('submitting form!!')
    let alert = document.getElementById('alert')
    alert.hidden = true

    // IMPORTS
    let distancewalked = document.getElementById('distancewalked').value
    if (document.getElementById('workedout-yes').checked) {
        let workedout = true
    } else {
        let workedout = false
    }

    // DATA VALIDATION


    if (distancewalked < 0) {
        alert.innerText = "Distance walked must be greater than 0"
        alert.hidden = false
        return
    }

    var date = document.getElementById('date').innerText
    var save_data = {}
    if (distancewalked == "") {
        save_data['distancewalked'] = deleteField()
    } else {
        save_data['distancewalked'] = parseFloat(distancewalked)
    }
    if (!(document.getElementById('workedout-yes').checked) & !(document.getElementById('workedout-no').checked)) {
        save_data['workedout'] = deleteField()
    } else {
        save_data['workedout'] = workedout
    }

    var day = doc(db, 'days', url_query['day'])
    console.log(save_data)
    updateDoc(day, save_data)
    updateDoc(doc(db, 'views', 'distancewalked'), {
        [url_query['day']]: save_data['distancewalked']
    })
    await updateDoc(doc(db, 'views', 'workedout'), {
        [url_query['day']]: save_data['workedout']
    })
    location.reload()
}


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    document.getElementById('submit_button').addEventListener('click', submitform)
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'

    if ('distancewalked' in day_data) {
        // console.log(day_data.sleeptime.toDate().toTimeString().split(' ')[0])
        document.getElementById('distancewalked').value = day_data.distancewalked
    }
    if ('workedout' in day_data) {
        if (day_data.workedout) {
            document.getElementById('workedout-yes').checked = true
            document.getElementById('workedout-no').checked = false
        } else {
            document.getElementById('workedout-yes').checked = false
            document.getElementById('workedout-no').checked = true
        }
    }
}

main()