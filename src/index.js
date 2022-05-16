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
        document.getElementById('signup').hide
        document.getElementById('loginout').attr('href', 'signout.html').text('Log out')
        const uid = user.uid;
        // ...
    } else {
        document.getElementById('signup').hidden = false
        var loginout = document.getElementById('loginout')
        loginout.href = 'login.html'
        loginout.innerText('Log in')
    }
});

const db = getFirestore(app);


var query = await getDocs(collection(db, 'entry_structure'))
query.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
})


export { db, app, auth }