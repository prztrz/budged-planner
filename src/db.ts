import fb from "firebase";

fb.initializeApp({
  apiKey: "AIzaSyCI9oXKxM8FQOqWmtsrMc-L5xp7ebT6PJU",
  authDomain: "udemy-d3-firebase-cd6fb.firebaseapp.com",
  databaseURL: "https://udemy-d3-firebase-cd6fb.firebaseio.com",
  projectId: "udemy-d3-firebase-cd6fb",
  storageBucket: "udemy-d3-firebase-cd6fb.appspot.com",
  messagingSenderId: "698710848187",
  appId: "1:698710848187:web:09b71d0f2cfdef3bce6f9e",
  measurementId: "G-JLHWTJM0JW"
});

export const db = fb.firestore();
