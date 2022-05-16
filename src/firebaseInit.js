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

async function getDB(coll, sortby = null, reverse = false) {
    var table = []
    var querySnapshot = await collection(db, coll)

    querySnapshot.forEach((doc) => {
        let item = doc.data()
        item.id = doc.id
        table.push(item)
    })
    if (!(sortby === null)) {
        table.sort(function(a, b) {
            let out = 0;
            if (a[sortby] < b[sortby]) {
                out = 1
            }
            if (a[sortby] > b[sortby]) {
                out = -1
            }
            if (reverse) {
                return out * -1
            } else {
                return out
            }
        })
    }
    return table
}

export { db, app, auth, getDB }