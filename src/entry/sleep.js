import { doc, deleteField, getDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from './../firebaseInit.js'

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


document.getElementById('submit_button').addEventListener('click', async function submitform() {
    console.log('submitting form!!')
    let alert = document.getElementById('alert')
    alert.hidden = true

    // IMPORTS
    let sleeptime = document.getElementById('sleeptime').value
    let waketime = document.getElementById('waketime').value
    let naphour = document.getElementById('naphour').value
    let napmin = document.getElementById('napmin').value

    if (naphour == "") {
        naphour = 0
    } else {
        naphour = parseInt(naphour)
    }

    if (napmin == "") {
        napmin = 0
    } else {
        napmin = parseInt(napmin)
    }

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
    var save_data = {
        'naphour': naphour,
        'napmin': napmin,
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
    console.log(parseInt(save_data['naphour']) + parseInt(save_data['naphour']) / 60)
    updateDoc(doc(db, 'views', 'sleeptime'), {
        [url_query['day']]: save_data['sleeptime']
    })
    updateDoc(doc(db, 'views', 'waketime'), {
        [url_query['day']]: save_data['waketime']
    })
    await updateDoc(doc(db, 'views', 'naps'), {
        [url_query['day']]: save_data['naphour'] + save_data['naphour'] / 60
    })
    location.reload()
})


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
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
    if ('naphour' in day_data) {
        document.getElementById('naphour').value = day_data.naphour
    }
    if ('napmin' in day_data) {
        document.getElementById('napmin').value = day_data.napmin
    }

}

main()
document.getElementById('waketime').addEventListener('change', updatesleep)
document.getElementById('sleeptime').addEventListener('change', updatesleep)