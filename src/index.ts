import "./styles/index.scss";

import { db } from "./db";
import { handleDataRefresh } from "./graph";

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

db.collection("expenses").onSnapshot(handleDataRefresh);
