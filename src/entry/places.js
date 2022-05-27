import { doc, deleteField, getDoc, updateDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../firebaseInit.js'

var places
var selected = {
    '1': null,
    '2': null,
}

var sp = document.getElementById('searchPanel')
var search = document.getElementById('search')
var labels = document.getElementById('labels')

var url_query = processQuery()

async function submitform() {
    console.log('submitting form!!')
    let alert = document.getElementById('alert')
    alert.hidden = true

    console.log(selected)

    var saveday = {}
    var saveview = {}

    for (let col in selected) {
        if (selected[col] != null) {
            saveday['place' + col] = selected[col].id
            saveview['place' + col] = selected[col].id
        } else {
            saveday['place' + col] = deleteField()
        }
    }
    console.log(saveday)
    console.log(saveview)

    updateDoc(doc(db, "days", url_query['day']), saveday)
    if (Object.keys(saveview).length === 0) {
        console.log(1)
        saveview = deleteField()
    }
    await updateDoc(doc(db, 'views', 'places'), {
        [url_query['day']]: saveview
    })
    location.reload()
}

function createLabels() {
    var label = document.createElement('div')
    label.classList = ['columns']
    var l = document.createElement('div')
    l.classList = ['column is-3']
    l.innerText = 'Place 1\n\u00A0'
    label.appendChild(l)
    var field = document.createElement('div')
    label.appendChild(field)
    labels.appendChild(label)

    var label = document.createElement('div')
    label.classList = ['columns']
    var l = document.createElement('div')
    l.classList = ['column is-3']
    l.innerText = 'Place 2'
    label.appendChild(l)
    var field = document.createElement('div')
    label.appendChild(field)

    labels.appendChild(label)
}

function updateLabels() {
    for (let i = 1; i < 3; i++) {
        var field = labels.childNodes[i].childNodes[1]
        var place = selected[i.toString()]
        if (place != null) {
            field.classList = ['column notification is-success']
            field.innerText = place.name + '\n'
            for (let j in place.path) {
                field.innerText = field.innerText + '/' + place.path[j]
            }
            field.style['border-radius'] = '10pt'
            field.style['margin'] = '0.5rem'
            field.style['padding'] = '0.25rem'
            field.style['height'] = 'min-content'
            var button = document.createElement('button')
            button.classList = ['delete']
            button.onclick = function() {
                removeSelected(i)
            }
            field.appendChild(button)
        } else {
            labels.childNodes[i].replaceChild(document.createElement('div'), field)
        }
    }
}

function removeSelected(i) {
    selected[i.toString()].selected = false
    selected[i.toString()] = null

    if (i == 1) {
        selected['1'] = selected['2']
        selected['2'] = null
    }

    updateLabels()
    updateSearch()
}

function updateSearch() {
    let count = 1
    for (let place in places) {
        var match = false
        var nicknames = places[place].path
        var n = 0
        if (places[place].name.toLowerCase().includes(search.value.toLowerCase())) { match = true }
        while ((match == false) & (n < nicknames.length)) {
            if (nicknames[n].toLowerCase().includes(search.value.toLowerCase())) {
                match = true;
            }
            n++
        }
        if (match) {
            sp.childNodes[count].style['display'] = ''
        } else {
            sp.childNodes[count].style['display'] = 'none'
        }
        count++
    }
    console.log(selected)
}

function addLocation(place) {
    for (let i = 1; i < 3; i++) {
        if (selected[i.toString()] == null) {
            selected[i.toString()] = place
            place.selected = true
            console.log(selected)
            search.value = ''
            search.focus()
            updateSearch()
            updateLabels()
            return
        }
    }
    search.value = ''
    search.focus()
}

function addPanel(place) {
    var pb = document.createElement('a')
    pb.classList = ['panel-block']
    pb.style['text-decoration'] = 'none'
    pb.style['white-space'] = 'nowrap'
    pb.style['overflow'] = 'auto'

    var add = document.createElement('span')
    add.classList = ['panel-icon']
    var i = document.createElement('i')
    i.classList = ['fa-solid fa-plu']
    add.appendChild(i)
    pb.appendChild(add)

    pb.addEventListener('click', function() { addLocation(place) })

    var p = document.createElement('p')
    p.innerText = place.name
    pb.appendChild(p)

    var p = document.createElement('span')
    p.innerText = '\u00A0\u00A0'
    for (let i in place.path) {
        p.innerText = p.innerText + '/' + place.path[i]
    }
    p.style['color'] = '#999999'

    pb.appendChild(p)

    sp.append(pb)
}

async function addPanels() {
    places = await getDoc(doc(db, "searchs", 'places'))
    places = places.data()
    console.log(places)
    for (let place in places) {
        places[place].id = place
        places[place].selected = false
        addPanel(places[place])
    }
    search.addEventListener('input', updateSearch)
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
        if (!($close.id == 'new_place_submit')) {
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
    createLabels()
    addPanels()
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    document.getElementById('submit_button').addEventListener('click', submitform)
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'
    console.log(day_data)
    for (let i = 1; i < 11; i++) {
        var ind = i
        if (i > 7) { ind = 7 - i }
        if (day_data['place' + ind]) {
            console.log(places[day_data['place' + ind]])
            selected[ind.toString()] = places[day_data['place' + ind]];
        }
    }
    updateSearch()
    updateLabels()
    search.focus()
}

main()