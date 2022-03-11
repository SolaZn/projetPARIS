import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";

// Add Firebase products that you want to use
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

$(document).ready(function () {
  alert("hello");
});

const firebaseConfig = {
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

function handleLogin() {
  var email = $("#emailInput").text();
  var password = $("#pwdInput").text();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("user " + email + "créé");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

function handleSignUp() {
    var email = $("#emailInput").text();
    var password = $("#pwdInput").text();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("user " + email + "connecté");

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
