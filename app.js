import { readProducts, controller } from "./api.js";
// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  readProducts();
});

document.querySelector("#cancel-request").addEventListener("click", () => {
  controller.abort();
});
