import { collection, doc, updateDoc, getDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

import { db, app, auth, processQuery } from "../../firebaseInit.js";

var editing_mode = false
var person
var url = processQuery()

function edit() {
    if (editing_mode) {
        editing_mode = false
        if (person.gender) {
            document.getElementById('gender').value = person.gender
        }
        if (person.birthdate) {
            document.getElementById('birthdate').value = person.birthdate
        }
        document.getElementById('nicknames').value = person.nicknames
        document.getElementById('gender').readOnly = true
        document.getElementById('birthdate').readOnly = true
        document.getElementById('nicknames').readOnly = true
        document.getElementById('submit_button').readOnly = true
        document.getElementById('delete').readOnly = true
        document.getElementById('submit_button').disabled = true
        document.getElementById('delete').disabled = true
        document.getElementById('edit').childNodes[1].innerText = 'Edit'
    } else {
        editing_mode = true
        document.getElementById('gender').readOnly = false
        document.getElementById('birthdate').readOnly = false
        document.getElementById('birthdate').focus()
        document.getElementById('nicknames').readOnly = false
        document.getElementById('submit_button').readOnly = false
        document.getElementById('delete').readOnly = false
        document.getElementById('edit').childNodes[1].innerText = 'Cancel'
        document.getElementById('submit_button').disabled = false
        document.getElementById('delete').disabled = false
    }

}

async function submit_edit() {
    var save = {}
    var birthdate = document.getElementById('birthdate').value
    var gender = document.getElementById('gender').value
    var nicknames = document.getElementById('nicknames').value

    console.log(birthdate, gender, nicknames)

    if (!(birthdate == '')) { save['birthdate'] = birthdate } else { save['birthdate'] = deleteField() }
    if (!(gender == '')) { save['gender'] = gender } else { save['gender'] = deleteField() }
    if (!(nicknames == '')) {
        nicknames = nicknames.split(',')
        save['nicknames'] = []
        nicknames.forEach((nick) => {
            save['nicknames'].push(nick.trim())
        })
    } else {
        save['nicknames'] = []
    }
    await updateDoc(doc(db, 'people', url.id), save)
    await updateDoc(doc(db, 'searchs', 'people'), {
        [person.name]: {
            nicknames: save['nicknames'],
            path: doc(db, 'people', url.id)
        }
    })
    location.reload()
}

async function main() {
    person = await getDoc(doc(db, 'people', url.id))
    document.getElementById('edit').addEventListener('click', edit)
    document.getElementById('submit_button').addEventListener('click', submit_edit)

    person = person.data()
    console.log(person)
    document.getElementById('name').innerText = person.name
    if (person.gender) {
        document.getElementById('gender').value = person.gender
    }
    if (person.birthdate) {
        document.getElementById('birthdate').value = person.birthdate
    }
    document.getElementById('nicknames').value = person.nicknames
        // document.getElementById('submit_button').addEventListener('click', submitform)
        // document.getElementById('remove').addEventListener('click', remove)

    document.getElementById('gender').readOnly = true
    document.getElementById('birthdate').readOnly = true
    document.getElementById('nicknames').readOnly = true
    document.getElementById('submit_button').readOnly = true
    document.getElementById('delete').readOnly = true
}

main()