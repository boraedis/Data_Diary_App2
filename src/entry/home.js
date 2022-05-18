import { collection, query, orderBy, doc, getDocs, getDoc, where } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, app, auth } from "../firebaseInit.js";

function createTab(name, ref) {
    var link = document.createElement('a')
    link.href = 'entry_day.html?day=' + ref
    link.style['padding-bottom'] = '1.5rem'
    link.style['text-decoration'] = 'none'
        // tab.setAttribute('onclick', 'entry/' + name + '.html')
        // tab.onclick = function(event) {
        //     window.location = 'index.html'
        // }
    var incols = document.createElement('div')
    incols.classList = ['columns']
    incols.style['width'] = '100%'

    var incol1 = document.createElement('div')
    incol1.classList = ['column is-4']
    var p1 = document.createElement('p')
    p1.classList = ['subtitle']
    p1.innerText = name
    incol1.appendChild(p1)
    incols.appendChild(incol1)


    var incol2 = document.createElement('div')
    incol2.classList = ['column']
    var prog = document.createElement('progress')
    prog.classList = ['progress is-info is-large']
    prog.id = name + '-progress'
    incol2.appendChild(prog)
    incols.appendChild(incol2)

    link.appendChild(incols)
    return link
}

async function calculate2weeks(daynum, cols) {
    var days = {}
    var column = document.getElementsByName('col')[0]
    var index = 1
    var day_docs = await getDocs(query(collection(db, 'days'), where('day', '>', daynum - 14), orderBy('day')))
    day_docs.forEach((day) => {
        var d = day.id
        days[d] = day.data()
        days[d].count = 0
        for (let col in cols) {
            if (typeof(days[d][cols[col]]) != 'undefined') { days[d].count++ }
        }
        console.log(column.childNodes, index)
        column.childNodes[index].childNodes[0].childNodes[1].childNodes[0].value = days[d].count
        column.childNodes[index].childNodes[0].childNodes[1].childNodes[0].max = cols.length
        index++
    })
}

async function main() {
    const bday = new Date('2000/04/20')
    const today = new Date();
    let daynum = Math.floor((today - bday) / (1000 * 60 * 60 * 24))
    document.getElementById('date').innerHTML = today.toDateString()
    var datecur = new Date()
    datecur.setDate(datecur.getDate() - 13)
    for (let i = 0; i < 14; i++) {
        var shortdate = (datecur.getMonth() + 1) + '/' + datecur.getDate() + '/' + (datecur.getYear() - 100)
        document.getElementsByName('col')[0].appendChild(createTab(shortdate, daynum - 13 + i))
        datecur.setDate(datecur.getDate() + 1)
    }
    var cats = await getDocs(collection(db, 'entry_structure'))
    var cols = []
    cats.forEach((cat) => {
        cat.data().fields.forEach((col) => { cols.push(col) })
    })

    document.getElementsByName('col')[0].childNodes[14].style['padding-bottom'] = '0rem'
    calculate2weeks(daynum, cols)
}


main()