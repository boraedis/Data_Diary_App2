import { collection, query, orderBy, limit, doc, getDocs, documentId, where, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

import { db, app, auth, processQuery } from "./../firebaseInit.js";

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

document.getElementById('yesterday').addEventListener('click', yesterday)
document.getElementById('tomorrow').addEventListener('click', tomorrow)

function createTab(name, max) {
    var tab = document.createElement('div')
    tab.classList = ['tile notification is-primary']
    tab.style['border-radius'] = '10pt'
    tab.style['padding-right'] = '0'
    tab.style['margin-bottom'] = '1.5rem'
    var link = document.createElement('a')
    link.href = name + '.html' + location.search
    link.appendChild(tab)
        // tab.setAttribute('onclick', 'entry/' + name + '.html')
        // tab.onclick = function(event) {
        //     window.location = 'index.html'
        // }
    var incols = document.createElement('div')
    incols.classList = ['columns']
    incols.style['width'] = '100%'

    var incol1 = document.createElement('div')
    incol1.classList = ['column is-3']
    var p1 = document.createElement('p')
    p1.classList = ['subtitle']
    p1.innerText = name
    incol1.appendChild(p1)
    incols.appendChild(incol1)


    var incol2 = document.createElement('div')
    incol2.classList = ['column is-7']
    var prog = document.createElement('progress')
    prog.classList = ['progress is-info is-large']
    prog.max = max
    prog.id = name + '-progress'
    incol2.appendChild(prog)
    incols.appendChild(incol2)

    var incol3 = document.createElement('div')
    incol3.classList = ['column is-2']
    var p3 = document.createElement('p')
    p3.classList = ['subtitle']
    p3.innerText = ''
    p3.id = name + '-label'
    incol3.appendChild(p3)
    incols.appendChild(incol3)

    tab.appendChild(incols)
    return link

}

async function main() {
    var cols = document.getElementsByName('cols')[0].childNodes
    var count = 0
    var structure = await getDocs(query(collection(db, "entry_structure"), orderBy('rank')))
    structure.forEach((cat) => {
        var tab = createTab(cat.id, cat.data().fields.length)
        if (count % 2 == 0) {
            cols[1].appendChild(tab)
        } else {
            cols[3].appendChild(tab)
        }
        count++
    })
    var day_data

    var day_data = await getDoc(doc(db, "days", url_query['day']))
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    console.log(day_data)
    count = 0
    structure.forEach((cat) => {
        let entered = 0
        cat.data().fields.forEach((col) => {
            if (typeof(day_data[col]) != 'undefined') {
                entered++
            }
        })
        console.log(cat.id, entered)
        var prog = document.getElementById(cat.id + '-progress')
        prog.value = entered
        document.getElementById(cat.id + '-label').innerText = entered / prog.max * 100 + '%'
        count++
    })
}


main()