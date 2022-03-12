import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";

// Add Firebase products that you want to use
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

$(document).ready(function () {
});

const firebaseConfig = {
  apiKey: "AIzaSyDKsFiB5uuXcrz-HLIb6f0Rmw-NC0wjbqA",
  authDomain: "mapper-79aaa.firebaseapp.com",
  projectId: "mapper-79aaa",
  storageBucket: "mapper-79aaa.appspot.com",
  messagingSenderId: "843554686656",
  appId: "1:843554686656:web:7b047819ac47f6c3884f25",
  measurementId: "G-EQ5KRFWFC8",
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

export {handleLogin, handleSignUp};
