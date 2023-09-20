import { readProducts, controller } from "./api.js";

export let currentPage = 1;

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  readProducts();
});

document.querySelector("#cancel-request").addEventListener("click", () => {
  controller.abort();
});

document
  .querySelector("ul.pagination")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    if (event.target.className.includes("pagination")) {
      return;
    }
    const lis = document.querySelectorAll(".page-item");
    lis.forEach((li) => li.classList.remove("active"));
    if (event.target.parentElement.id === "previous") {
      const page = currentPage - 1;
      currentPage = page === 0 ? 1 : page;
      event.currentTarget
        .querySelector(`#page-${currentPage}`)
        .classList.add("active");
    } else if (event.target.parentElement.id === "next") {
      const page = currentPage + 1;
      currentPage =
        page > event.target.parentElement.dataset.pageCount
          ? event.target.parentElement.dataset.pageCount
          : page;
      event.currentTarget
        .querySelector(`#page-${currentPage}`)
        .classList.add("active");
    } else {
      event.target.parentElement.classList.add("active");
      currentPage = Number(event.target.innerText);
    }
    await readProducts();
    window.scrollTo({ top: document.body.scrollHeight });
  });
