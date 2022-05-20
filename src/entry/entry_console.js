import { processQuery } from '../firebaseInit.js'

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

function groups() {
    location = 'entry_day.html' + location.search
}

fetch('entry_console.html')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.getElementById("console")
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
        document.getElementById('yesterday').addEventListener('click', yesterday)
        document.getElementById('tomorrow').addEventListener('click', tomorrow)
        document.getElementById('clear').addEventListener('click', clear)
        document.getElementById('groups').addEventListener('click', groups)
    })