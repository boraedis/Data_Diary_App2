import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyC72egxTj840NsQUU5wtqcAmXwjVJektZ8",
    authDomain: "data-diary-1693.firebaseapp.com",
    projectId: "data-diary-1693",
    storageBucket: "data-diary-1693.appspot.com",
    messagingSenderId: "671002423805",
    appId: "1:671002423805:web:eb3c6d7fab1aec81ab6994",
    measurementId: "G-LBT0GQPND8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('signup').style.display = "none";
        document.getElementById('loginout').href = 'signout.html'
        document.getElementById('loginout').innerText = 'Log out'
        const uid = user.uid;
        // ...
    } else {
        document.getElementById('signup').style.display = "block";
        var loginout = document.getElementById('loginout')
        loginout.href = 'login.html'
        loginout.innerText('Log in')
    }
});

const db = getFirestore(app);

function processQuery() {
    var query = {}
    var parameters = location.search.substring(1).split("&")
    parameters.forEach((param) => {
        query[param.split('=')[0]] = param.split('=')[1]
    })
    return query
}

function createQuery(url_query) {
    var query = '?'
    for (let param in url_query) {
        query = query + param + '=' + url_query[param] + '&'
    }
    query = query.slice(0, -1)
    return query
}

export { db, app, auth, processQuery, createQuery }