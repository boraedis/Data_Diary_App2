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
    let insta_followers = document.getElementById('insta_followers').value
    let insta_following = document.getElementById('insta_following').value

    // DATA VALIDATION


    if (insta_followers < 0) {
        alert.innerText = "Instagram Followers must be between 0 to 100"
        alert.hidden = false
        return
    }
    if (insta_following < 0) {
        alert.innerText = "Instagram Following must be between 0 to 100"
        alert.hidden = false
        return
    }

    var date = document.getElementById('date').innerText
    var save_data = {}
    if (insta_followers == "") {
        save_data['insta_followers'] = deleteField()
    } else {
        save_data['insta_followers'] = parseInt(insta_followers)
    }
    if (insta_following == "") {
        save_data['insta_following'] = deleteField()
    } else {
        save_data['insta_following'] = parseInt(insta_following)
    }

    var day = doc(db, 'days', url_query['day'])
    console.log(save_data)
    updateDoc(day, save_data)
    updateDoc(doc(db, 'views', 'insta_followers'), {
        [url_query['day']]: save_data['insta_followers']
    })
    await updateDoc(doc(db, 'views', 'insta_following'), {
        [url_query['day']]: save_data['insta_following']
    })
    location.reload()
})


async function main() {
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'

    if ('insta_followers' in day_data) {
        document.getElementById('insta_followers').value = day_data.insta_followers
    }
    if ('insta_following' in day_data) {
        document.getElementById('insta_following').value = day_data.insta_following
    }
}

main()