import { collection, query, orderBy, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, app, auth } from "../firebaseInit.js";

async function main() {
    const today = new Date();
    document.getElementById('date').innerHTML = today.toDateString()
    var cats = await getDocs(collection(db, 'entry_structure'))
    var cols = []
    cats.forEach((cat) => {
        cat.data().fields.forEach((col) => { cols.push(col) })
    })
    const bday = new Date('2000/04/20')
    let daynum = Math.floor((today - bday) / (1000 * 60 * 60 * 24))
    var days = {}
    for (let d = daynum - 14; d < daynum; d++) {
        var day = await getDoc(doc(db, 'days', d.toString()))
        days[d] = day.data()
    }
    console.log(day)

}


main()