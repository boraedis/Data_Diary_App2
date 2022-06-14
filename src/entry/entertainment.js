import { doc, deleteField, getDoc, updateDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../firebaseInit.js'

var media
var adde = {
    'movies': [],
    'tvshows': []
}
var sp = document.getElementById('searchPanel')
var search = document.getElementById('search')
var labels = document.getElementById('labels')
const API_KEY = 'd265e7636af0e8e0cf7331741181f511'

var url_query = processQuery()

async function submitform() {
    // console.log('submitting form!!')
    // let alert = document.getElementById('alert')
    // alert.hidden = true

    // console.log(selected)

    // var saveday = {}
    // var saveview = {}

    // for (let col in selected) {
    //     if (selected[col] != null) {
    //         saveday['person' + col] = selected[col].name
    //         saveview['person' + col] = selected[col].name
    //     } else {
    //         saveday['person' + col] = deleteField()
    //     }
    // }

    // updateDoc(doc(db, "days", url_query['day']), saveday)
    // if (Object.keys(saveview).length === 0) {
    //     console.log(1)
    //     saveview = deleteField()
    // }
    // await updateDoc(doc(db, 'views', 'people'), {
    //     [url_query['day']]: saveview
    // })
    // location.reload()
}

function createLabels() {
    // for (let i = 1; i < 11; i++) {
    //     var label = document.createElement('div')
    //     label.classList = ['columns']

    //     var l = document.createElement('div')
    //     l.classList = ['column is-4']
    //     if (i <= 7) {
    //         l.innerText = 'Person(+) ' + i
    //     } else {
    //         l.innerText = 'Person(-) ' + (7 - i)
    //     }
    //     label.appendChild(l)
    //     var field = document.createElement('div')
    //     label.appendChild(field)

    //     labels.appendChild(label)

    // }
}

function updateLabels() {
    // for (let i = 1; i < 11; i++) {
    //     var ind = i
    //     var field = labels.childNodes[i].childNodes[1]
    //     if (i > 7) { ind = 7 - i }
    //     if (selected[ind.toString()] != null) {
    //         if (i > 7) { field.classList = ['column notification is-danger'] } else { field.classList = ['column notification is-success'] }
    //         field.innerText = selected[ind.toString()].name
    //         field.style['border-radius'] = '10pt'
    //         field.style['margin'] = '0.5rem'
    //         field.style['padding'] = '0.25rem'
    //         field.style['height'] = 'min-content'
    //         var button = document.createElement('button')
    //         button.classList = ['delete']
    //         button.onclick = function() {
    //             removeSelected(i)
    //         }
    //         field.appendChild(button)
    //     } else {
    //         labels.childNodes[i].replaceChild(document.createElement('div'), field)
    //     }
    // }
}

function removeSelected(i) {
    // var ind = i
    // if (i > 7) { ind = 7 - i }
    // selected[ind.toString()].selected = false
    // selected[ind.toString()] = null

    // for (let p = 1; p < 7; p++) {
    //     if (selected[p.toString()] == null) {
    //         selected[p.toString()] = selected[(p + 1).toString()]
    //         selected[(p + 1).toString()] = null
    //     }
    // }

    // for (let p = -1; p > -3; p--) {
    //     if (selected[p.toString()] == null) {
    //         selected[p.toString()] = selected[(p - 1).toString()]
    //         selected[(p - 1).toString()] = null
    //     }
    // }

    // updateLabels()
    // updateSearch()
}

function updateSearch() {
    // let count = 1
    // for (let person in people) {
    //     var match = false
    //     if (people[person].selected) {
    //         match = false
    //     } else {
    //         people[person].nicknames.forEach((nick) => {
    //             if (nick.toLowerCase().includes(search.value.toLowerCase())) {
    //                 match = true
    //             }
    //         })
    //     }
    //     if (match) {
    //         sp.childNodes[count].style['display'] = ''
    //     } else {
    //         sp.childNodes[count].style['display'] = 'none'
    //     }
    //     count++
    // }
    // console.log(selected)
}

function addMedia(media) {
    // for (let i = 1; i < 8; i++) {
    //     if (selected[i.toString()] == null) {
    //         selected[i.toString()] = person
    //         person.selected = true
    //         console.log(selected)
    //         search.value = ''
    //         search.focus()
    //         updateSearch()
    //         updateLabels()
    //         return
    //     }
    // }
    // search.value = ''
    // search.focus()
}

function addPanel(person) {
    // var pb = document.createElement('a')
    // pb.classList = ['panel-block']
    // pb.style['text-decoration'] = 'none'

    // var add = document.createElement('span')
    // add.classList = ['panel-icon']
    // var i = document.createElement('i')
    // i.classList = ['fa-solid fa-plu']
    // add.appendChild(i)
    // pb.appendChild(add)

    // var add = document.createElement('span')
    // add.classList = ['panel-icon']
    // var i = document.createElement('i')
    // i.classList = ['fa-solid fa-plus']
    // i.addEventListener('click', function() { addPositive(person) })
    // add.appendChild(i)
    // pb.appendChild(add)

    // var sub = document.createElement('span')
    // sub.classList = ['panel-icon']
    // var i = document.createElement('i')
    // i.classList = ['fa-solid fa-minus']
    // i.addEventListener('click', function() { addNegative(person) })
    // sub.appendChild(i)
    // pb.appendChild(sub)

    // var p = document.createElement('p')
    // p.innerText = person.name
    // pb.appendChild(p)

    // sp.append(pb)
}

async function addPanels() {
    // people = await getDoc(doc(db, "searchs", 'people'))
    // people = people.data()
    // for (let person in people) {
    //     people[person].name = person
    //     people[person].selected = false
    //     people[person].nicknames.push(person)
    //     addPanel(people[person])
    // }
    // search.addEventListener('input', updateSearch)
}

async function searchAPI() {
    var modal_body = document.getElementById('modal_content')
    modal_body.innerHTML = ''
    var searchbar = document.getElementById('search')
    console.log(searchbar.value)
    const response = await fetch('https://api.themoviedb.org/3/search/multi?api_key=' + API_KEY + '&language=en-US&query=' + searchbar.value + '&page=1&include_adult=false')
    var data = await response.json()
    console.log(data)
    for (let r in data.results) {
        var button = document.createElement('button')
        button.classList = ['button is-fullwidth is-secondary']
        button.onclick = function() {
            createMedia(data.results[r])
        }
        button.style.textAlign = 'left'
        button.style.justifyContent = 'left'
        if (data.results[r].media_type == 'movie') {
            var title = document.createElement('p')
            title.innerHTML = 'Movie : ' + '<strong>' + data.results[r].title + '</strong>'
            button.appendChild(title)
        } else if (data.results[r].media_type == 'tv') {
            var title = document.createElement('p')
            title.innerHTML = 'TV Show : ' + '<strong>' + data.results[r].name + '</strong>'
            button.appendChild(title)
        } else {
            var title = document.createElement('p')
            title.innerHTML = 'Unknown Media Type : ' + data.results[r].media_type
            button.appendChild(title)
        }
        modal_body.appendChild(button)

    }
    document.getElementById('APIsearchModal').classList.add('is-active')
}

async function createMedia(med) {
    console.log(med)
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
    document.getElementById('APIsearch').addEventListener('click', searchAPI)
}

main()