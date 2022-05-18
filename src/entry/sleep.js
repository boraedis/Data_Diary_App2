import { doc, deleteField, getDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from './../firebaseInit.js'

var url_query = processQuery()

function updatesleep() {
    console.log('updating text')
    let sleepval = document.getElementById('sleeptime').value
    let wakeval = document.getElementById('waketime').value
    let sleeplabel = document.getElementById('sleep-label')
    let wakelabel = document.getElementById('wake-label')
    let durationlabel = document.getElementById('duration-label')
    let sleeptime
    let waketime

    if (sleepval == '') {
        sleeplabel.innerText = 'BLANK'
    } else {
        sleeplabel.innerText = sleepval
        sleeptime = sleepval.split(':')
    }
    if (wakeval == '') {
        wakelabel.innerText = 'BLANK'
    } else {
        wakelabel.innerText = wakeval
        waketime = wakeval.split(':')
    }

    console.log(waketime, sleeptime)

    if ((sleeptime[0] == waketime[0]) & (sleeptime[1] == waketime[1])) {
        durationlabel.innerText = '0h 0m'
    } else if ((sleeptime[0] < waketime[0]) | ((sleeptime[0] == waketime[0]) & (sleeptime[1] < waketime[1]))) {
        let mins = waketime[1] - sleeptime[1]
        let hours = waketime[0] - sleeptime[0]
        if (mins < 0) {
            hours--
            mins = mins + 60
        }
        durationlabel.innerText = hours + 'h ' + mins + 'm'
    } else {
        waketime[0] = parseInt(waketime[0]) + 24
        let mins = waketime[1] - sleeptime[1]
        let hours = waketime[0] - sleeptime[0]
        if (mins < 0) {
            hours--
            mins = mins + 60
        }
        durationlabel.innerText = hours + 'h ' + mins + 'm'
    }
}

async function submitform() {
    console.log('submitting form!!')
    let alert = document.getElementById('alert')
    alert.hidden = true

    // IMPORTS
    let sleeptime = document.getElementById('sleeptime').value
    let waketime = document.getElementById('waketime').value
    let naphour = document.getElementById('naphour').value
    let napmin = document.getElementById('napmin').value

    // DATA VALIDATION

    if (((sleeptime == '') & !(waketime == '')) | !(sleeptime == '') & (waketime == '')) {
        alert.innerText = "You cannot fill out only Sleep Time or Wake Time"
        alert.hidden = false
        return
    } else if ((naphour > 24) | (naphour < 0)) {
        alert.innerText = "Nap hours must be 0 to 24"
        alert.hidden = false
        return
    } else if ((napmin > 59) | (napmin < 0)) {
        alert.innerText = "Nap minutes must be 0 to 59"
        alert.hidden = false
        return
    }

    var date = document.getElementById('date').innerText
    var save_data = {}

    if ((naphour == "") & (napmin == "")) {
        save_data['naps'] = deleteField()
    } else {
        save_data['naps'] = {}
        if (naphour == '') { save_data['naps'].hours = 0 } else { save_data['naps'].hours = parseInt(naphour) }
        if (napmin == '') { save_data['naps'].mins = 0 } else { save_data['naps'].mins = parseInt(napmin) }
    }




    if (sleeptime != '') {
        sleeptime = sleeptime.split(':')
        waketime = waketime.split(':')
        if ((sleeptime[0] == waketime[0]) & (sleeptime[1] == waketime[1])) {
            sleeptime = Timestamp.fromDate(new Date(date + ' ' + sleeptime[0] + ":" + sleeptime[1] + ':00'))
            waketime = Timestamp.fromDate(new Date(date + ' ' + waketime[0] + ":" + waketime[1] + ':00'))
        } else if ((sleeptime[0] < waketime[0]) | ((sleeptime[0] == waketime[0]) & (sleeptime[1] < waketime[1]))) {
            sleeptime = Timestamp.fromDate(new Date(date + ' ' + sleeptime[0] + ":" + sleeptime[1] + ':00'))
            waketime = Timestamp.fromDate(new Date(date + ' ' + waketime[0] + ":" + waketime[1] + ':00'))
        } else {
            let sleepdt = new Date(date + ' ' + sleeptime[0] + ":" + sleeptime[1] + ':00')
            sleepdt.setDate(sleepdt.getDate() - 1);
            sleeptime = Timestamp.fromDate(sleepdt)
            waketime = Timestamp.fromDate(new Date(date + ' ' + waketime[0] + ":" + waketime[1] + ':00'))
        }
        console.log(sleeptime)
        save_data['sleeptime'] = sleeptime.toDate().toTimeString().slice(0, 5)
        save_data['waketime'] = waketime.toDate().toTimeString().slice(0, 5)
    } else {
        save_data['sleeptime'] = deleteField()
        save_data['waketime'] = deleteField()
    }
    var day = doc(db, 'days', url_query['day'])
    console.log(save_data)
    console.log(url_query['day'])
    updateDoc(day, save_data)
    updateDoc(doc(db, 'views', 'sleeptime'), {
        [url_query['day']]: save_data['sleeptime']
    })
    updateDoc(doc(db, 'views', 'waketime'), {
        [url_query['day']]: save_data['waketime']
    })
    await updateDoc(doc(db, 'views', 'naps'), {
        [url_query['day']]: save_data['naps']
    })
    location.reload()
}


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    document.getElementById('submit_button').addEventListener('click', submitform)
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'

    if ('sleeptime' in day_data) {
        // console.log(day_data.sleeptime.toDate().toTimeString().split(' ')[0])
        document.getElementById('sleeptime').value = day_data.sleeptime
    }
    if ('waketime' in day_data) {
        document.getElementById('waketime').value = day_data.waketime
    }
    if ('naps' in day_data) {
        document.getElementById('naphour').value = day_data.naps.hours
        document.getElementById('napmin').value = day_data.naps.mins
    }

}

main()
document.getElementById('waketime').addEventListener('change', updatesleep)
document.getElementById('sleeptime').addEventListener('change', updatesleep)