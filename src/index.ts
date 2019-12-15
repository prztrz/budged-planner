import m from "materialize-css";
import "./styles/index.scss";
import fb from "firebase";

console.log(process.env.API_KEY);
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

const db = fb.firestore();

window.addEventListener("load", () => {
  const form = document.querySelector<HTMLFormElement>("form");
  const name = document.querySelector<HTMLInputElement>("#name");
  const cost = document.querySelector<HTMLInputElement>("#cost");
  const error = document.querySelector<HTMLParagraphElement>("#error");
  const info = document.querySelector<HTMLParagraphElement>("#info");
  const submit = document.querySelector<HTMLButtonElement>("#submit");

  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();

    if (name.value && cost.value) {
      error.textContent = "";
      info.textContent = "submitting";
      submit.disabled = true;

      const item = {
        name: name.value,
        cost: Number(cost.value)
      };

      db.collection("expenses")
        .add(item)
        .then(
          () => {
            name.value = "";
            cost.value = "";
            info.textContent = "";
            submit.disabled = false;
          },
          (err: Error) => {
            console.error(err);
            submit.disabled = false;
            info.textContent = "";
            error.textContent = err.message;
          }
        );
    } else {
      error.textContent = "Enter both  values!";
    }
  });
});
