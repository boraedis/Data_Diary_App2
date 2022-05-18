import { doc, deleteField, getDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../firebaseInit.js'

var url_query = processQuery()

async function submitform() {
    console.log('submitting form!!')
    let alert = document.getElementById('alert')
    alert.hidden = true

    // IMPORTS
    let phonehour = document.getElementById('phonehour').value
    let phonemin = document.getElementById('phonemin').value
    let laptophour = document.getElementById('laptophour').value
    let laptopmin = document.getElementById('laptopmin').value

    // DATA VALIDATION

    if ((phonehour > 24) | (phonehour < 0)) {
        alert.innerText = "Phone Usage hours must be 0 to 24"
        alert.hidden = false
        return
    } else if ((phonemin > 59) | (phonemin < 0)) {
        alert.innerText = "Phone Usage minutes must be 0 to 59"
        alert.hidden = false
        return
    } else if ((laptophour > 24) | (laptophour < 0)) {
        alert.innerText = "Laptop Usage hours must be 0 to 24"
        alert.hidden = false
        return
    } else if ((laptopmin > 59) | (laptopmin < 0)) {
        alert.innerText = "Laptop Usage minutes must be 0 to 59"
        alert.hidden = false
        return
    }

    var delete_phone = false
    var delete_laptop = false

    if ((phonehour == "") & (phonemin == "")) {
        delete_phone = true
        phonehour = deleteField()
        phonemin = deleteField()
    } else {
        if (phonehour == '') { phonehour = 0 } else { phonehour = parseInt(phonehour) }
        if (phonemin == '') { phonemin = 0 } else { phonemin = parseInt(phonemin) }
    }

    if ((laptophour == "") & (laptopmin == "")) {
        delete_laptop = true
        laptophour = deleteField()
        laptopmin = deleteField()
    } else {
        if (laptophour == '') { laptophour = 0 } else { laptophour = parseInt(laptophour) }
        if (laptopmin == '') { laptopmin = 0 } else { laptopmin = parseInt(laptopmin) }
    }

    var date = document.getElementById('date').innerText
    var save_data = {}

    if (delete_phone) {
        save_data['phoneusage'] = deleteField()
    } else {
        save_data['phoneusage'] = {
            'hours': phonehour,
            'mins': phonemin
        }
    }
    if (delete_laptop) {
        save_data['laptopusage'] = deleteField()
    } else {
        save_data['laptopusage'] = {
            'hours': laptophour,
            'mins': laptopmin
        }
    }

    var day = doc(db, 'days', url_query['day'])
    console.log(save_data)
    console.log(url_query['day'])
    updateDoc(day, save_data)
    updateDoc(doc(db, 'views', 'phoneusage'), {
        [url_query['day']]: save_data['phoneusage']
    })
    await updateDoc(doc(db, 'views', 'laptopusage'), {
        [url_query['day']]: save_data['laptopusage']
    })
    location.reload()
}


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    document.getElementById('submit_button').addEventListener('click', submitform)
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'
    console.log(day_data)
    if ('phoneusage' in day_data) {
        document.getElementById('phonehour').value = day_data.phoneusage.hours
        document.getElementById('phonemin').value = day_data.phoneusage.mins
    }
    if ('laptopusage' in day_data) {
        document.getElementById('laptophour').value = day_data.laptopusage.hours
        document.getElementById('laptopmin').value = day_data.laptopusage.mins
    }

}

main()