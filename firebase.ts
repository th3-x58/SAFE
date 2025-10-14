
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1SUZL7_DNCorldZMgkgjTppUJH0ZzQUc",
  authDomain: "safe-40bfa.firebaseapp.com",
  projectId: "safe-40bfa",
  storageBucket: "safe-40bfa.firebasestorage.app",
  messagingSenderId: "966364914035",
  appId: "1:966364914035:web:227429bab9f37b2da5a506",
  measurementId: "G-TFBMRM9T4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Firebase config loaded and initialized.");
