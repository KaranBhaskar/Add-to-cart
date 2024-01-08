import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const appSettings = {
  databaseURL: "https://shoppinglist-3156b-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartItemsInDB = ref(database, "shoppingList");
// console.log(app);

// let items = [];
const inputFieldEl = document.getElementById("input-field");
const listEl = document.getElementById("list-el");
const buttonEl = document.getElementById("add-button");

onValue(cartItemsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let databaseValues = Object.entries(snapshot.val());

    let child = listEl.lastElementChild;
    while (child) {
      listEl.removeChild(child);
      child = listEl.lastElementChild;
    }
    for (let i = 0; i < databaseValues.length; i++) {
      let currentItem = databaseValues[i];
      render(currentItem);
    }
  } else {
    listEl.innerHTML = "";
  }
});

function render(array) {
  let currentItem = array;
  let currentItemId = currentItem[0];
  let currentItemValue = currentItem[1];

  let newEL = document.createElement("li");
  newEL.textContent = currentItemValue;

  newEL.addEventListener("click", function () {
    let locationInDB = ref(database, `shoppingList/${currentItemId}`);
    remove(locationInDB);
  });

  listEl.appendChild(newEL);
}

buttonEl.addEventListener("click", function () {
  if (inputFieldEl.value != "") {
    push(cartItemsInDB, inputFieldEl.value);
    inputFieldEl.value = "";
  }
});

inputFieldEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && inputFieldEl.value != "") {
    // items.push(inputFieldEl.value);
    push(cartItemsInDB, inputFieldEl.value);
    inputFieldEl.value = "";
  }
});
