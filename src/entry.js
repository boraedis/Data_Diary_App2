import { db, app, auth, processQuery } from "./firebaseInit.js";


var query = processQuery()

const today = new Date();
document.getElementById('date').innerHTML = today.toDateString()