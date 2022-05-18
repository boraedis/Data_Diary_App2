import { doc, deleteField, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../firebaseInit.js'

var url_query = processQuery()

async function submitform() {
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
        save_data['happiness'] = parseFloat(happiness)
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
}


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    document.getElementById('submit_button').addEventListener('click', submitform)
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