// firebaseConfig.js
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB96hkHegU1TtdiVPsowefygqEbWyzleXg",
  authDomain: "texttranslator-e5185.firebaseapp.com",
  projectId: "texttranslator-e5185",
  storageBucket: "texttranslator-e5185.appspot.com",
  messagingSenderId: "793731650574",
  appId: "1:793731650574:web:6228435417d6bc7283d85f",
  measurementId: "G-09ZQ485G56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
