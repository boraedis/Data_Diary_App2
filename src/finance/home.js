import { collection, query, orderBy, doc, getDocs, setDoc, getDoc, where } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, app, auth } from "../firebaseInit.js";

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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
    var percents = []
    day_docs.forEach((day) => {
        var d = day.id
        days[d] = day.data()
        days[d].count = 0
        for (let col in cols) {
            if (typeof(days[d][cols[col]]) != 'undefined') { days[d].count++ }
        }
        console.log(column.childNodes, index)
        percents[d] = days[d].count / cols.length
        column.childNodes[index].childNodes[0].childNodes[1].childNodes[0].value = days[d].count
        column.childNodes[index].childNodes[0].childNodes[1].childNodes[0].max = cols.length
        index++
    })
    return percents
}

async function populate_day_content(daynum, percents) {
    function make_cols(left, right) {
        var cols = document.createElement('div')
        cols.classList = ['columns']

        var col = document.createElement('div')
        col.classList = ['column']
        col.innerHTML = '<strong>' + left + '</strong>'
        col.style.padding = '0.25rem'
        cols.append(col)

        var col = document.createElement('div')
        col.classList = ['column']
        if (typeof(right) == 'object') {
            col.appendChild(right)
        } else {
            col.innerHTML = right
        }
        cols.append(col)
        col.style.padding = '0.25rem'
        return cols
    }
    var day_content = document.getElementById('day_content')
    day_content.appendChild(make_cols('Day', daynum))
    const start = new Date('2016/02/16')
    const today = new Date();
    let rownum = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    day_content.appendChild(make_cols('% of Life', Math.round(rownum / daynum * 1000) / 10 + '%'))
    let d = daynum
    let incomplete = 0
    while (percents[d] < 0.5) {
        incomplete++
        d--
    }
    day_content.appendChild(make_cols("Data missing", incomplete))

    var input = document.createElement('input')
    input.classList = ['input']
    input.type = 'date'

    var button = document.createElement('button')
    button.classList = ['button']
    button.style.width = '100%'
    button.innerText = "Go"
    button.addEventListener('click', function() {
        let date = input.value
        if (date != '') {
            const goto = new Date(date)
            const bday = new Date('2000/04/20');
            let day = Math.floor((goto - bday) / (1000 * 60 * 60 * 24))
            location = '/src/entry/entry_day.html?day=' + day
        }
    })

    day_content.appendChild(make_cols("Go to Date", input))
    day_content.appendChild(make_cols("", button))
}

async function createDays(bday, today, daynum) {
    var max_day = daynum
    var day_data = await getDoc(doc(db, "days", daynum.toString()))
    var day_cur = day_data
    console.log(max_day, day_cur.exists())
    var count = 0
        // if (!(day_data.exists)) {
    while (!(day_cur.exists())) {
        max_day--;
        day_cur = await getDoc(doc(db, "days", max_day.toString()))
        console.log(max_day, day_cur.exists())
        count++;
        if (count >= 100) {
            console.log(1)
            break
        }
    }
    console.log(max_day)
    var date_cur = new Date(day_cur.data().date)
    while (max_day != daynum) {
        max_day++
        date_cur.setDate(date_cur.getDate() + 1)
        setDoc(doc(db, 'days', max_day.toString()), {
            date: date_cur.toDateString(),
            day: max_day
        })
        console.log(max_day, date_cur)
        console.log('added')
    }
}

async function plaid_setup() {
    const express = require('express');
    const app = express();
    app.use(express.json());
    const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
    const configuration = new Configuration({
        basePath: PlaidEnvironments[process.env.PLAID_ENV],
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                'PLAID-SECRET': process.env.PLAID_SECRET,
            },
        },
    });
    const client = new PlaidApi(configuration);
}

async function main() {
    plaid_setup()
    const bday = new Date('2000/04/20')
    const today = new Date();
    let daynum = Math.floor((today - bday) / (1000 * 60 * 60 * 24))
    document.getElementById('date').innerHTML = today.toDateString()
}


main()