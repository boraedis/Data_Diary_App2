import { collection, updateDoc, doc, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

import { db } from "./../../firebaseInit.js";

var searchbar = document.getElementById('search')
searchbar.addEventListener('input', updateSearch)
var table = document.getElementById('table')
var people

function updateSearch() {
    let count = 1
    for (let person in people) {
        console.log(table.childNodes[count], person)
        var match = false
        if (people[person].selected) {
            match = false
        } else {
            people[person].nicknames.forEach((nick) => {
                if (nick.toLowerCase().includes(search.value.toLowerCase())) {
                    match = true
                }
            })
        }
        if (match) {
            table.childNodes[count].style['display'] = ''
        } else {
            table.childNodes[count].style['display'] = 'none'
        }
        count++
    }
}


async function submitNewPerson() {
    var alert = document.getElementById('new_person_alert')
    alert.hidden = true
    var save = {}
    var fullname = document.getElementById('fullname').value.trim()
    var birthdate = document.getElementById('birthdate').value
    var gender
    if (document.getElementById('gender-male').checked) {
        save['gender'] = 'Male'
    } else if (document.getElementById('gender-female').checked) {
        save['gender'] = 'Female'
    } else if (document.getElementById('gender-other').checked) {
        save['gender'] = document.getElementById('other').value
    }
    var nicknames = document.getElementById('nicknames').value

    if (fullname in people) {
        alert.innerText = fullname + 'is already in the database'
        alert.hidden = false
        return
    } else {
        save['name'] = fullname
    }
    if (!(birthdate == '')) { save['birthdate'] = birthdate }
    if (!(nicknames == '')) {
        nicknames = nicknames.split(', ')
        save['nicknames'] = []
        nicknames.forEach((nick) => {
            save['nicknames'].push(nick.trim())
        })
    } else {
        save['nicknames'] = []
    }
    var names = await getDoc(doc(db, 'searchs', 'people'))

    var ref = await addDoc(collection(db, 'people'), save)
    updateDoc(doc(db, 'searchs', 'people'), {
        [save['name']]: {
            nicknames: save['nicknames'],
            path: ref
        }
    })
    location.reload()
}

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
        if (!($close.id == 'new_person_submit')) {
            $close.addEventListener('click', () => {
                closeModal($target);
            });
        }
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});

async function main() {
    people = await getDoc(doc(db, "searchs", 'people'))
    document.getElementById('new_person_submit').addEventListener('click', submitNewPerson)
    people = people.data()
    for (let person in people) {
        people[person].name = person
        people[person].selected = false
        people[person].nicknames.push(person)
        var label = document.createElement('a')
        label.classList = ['tile notification is-primary']
        label.style['text-decoration'] = 'none'
        label.style['color'] = 'white'
        label.style['padding'] = '0.5rem'
        label.innerText = person
        console.log(person)
        label.href = 'person.html?id=' + people[person].path._key.path.toString().split('/')[1]
        console.log(label.href)
        table.appendChild(label)
    }
    updateSearch()

}

main()