import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

import { db, app, auth } from './firebaseInit.js'


document.getElementById('submit').addEventListener('click', function() {
    var email = document.getElementById('emailField').value
    var password = document.getElementById('passwordField').value
    console.log(email, password)
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        var user = userCredential.user;
        console.log(user);
        location.href = 'index.html'
    }).catch((error) => {
        var errorCode = error.code
        var errorMessage = error.message
        console.error(errorCode, errorMessage)
        if (errorCode === 'auth/wrong-password') {
            document.getElementById('notification').innerText = "Wrong Password"
        } else {
            document.getElementById('notification').innerText = "This is user is not in our system"
        }
        document.getElementById('notification').hidden = false
    })
})

document.getElementById('submit').addEventListener('click', function() {
    var email = document.getElementById('emailField').value
    var password = document.getElementById('passwordField').value
    var password2 = document.getElementById('passwordField2').value
    console.log(email, password, password2)
    if (password === password2) {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            var user = userCredential.user;
            location.href = 'index.html'
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode, errorMessage)
            document.getElementById('notification').innerText = errorMessage
            document.getElementById('notification').style.display = "none";
        });
    } else {
        document.getElementById('notification').innerText = "Passwords must match"
        document.getElementById('notification').style.display = "none";
    }

})