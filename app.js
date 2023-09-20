import {
  readProducts,
  controller,
  createNewProduct,
  updateProduct,
} from "./api.js";
import { DEFAULT_PAGE_SIZE, debounce } from "./utility.js";

export let currentPage = 1;
export let currentPageSize = DEFAULT_PAGE_SIZE;
export let queryString;

const productForm = document.querySelector("#create-product");
const editProductForm = document.querySelector("#edit-product");

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

document.querySelector("#page-size").addEventListener("change", async (e) => {
  currentPageSize = e.target.value;
  currentPage = 1;
  await readProducts();
});

const debouncedReadProducts = debounce(readProducts);
document
  .querySelector("#searchBox")
  .addEventListener("input", async (event) => {
    queryString = event.target.value.toLowerCase();
    await debouncedReadProducts();
  });

document.querySelector("#refresh-btn").addEventListener("click", readProducts);

productForm.addEventListener("submit", createNewProduct);

const preventDragDefault = (e) => {
  e.stopPropagation();
  e.preventDefault();
};
document
  .querySelector(".image-selector")
  .addEventListener("dragover", (e) => preventDragDefault(e));
document
  .querySelector(".image-selector")
  .addEventListener("dragenter", (e) => preventDragDefault(e));

document.querySelector(".image-selector").addEventListener("drop", (e) => {
  preventDragDefault(e);
  if (e.dataTransfer.files) {
    document.querySelector("#product-display").src = URL.createObjectURL(
      e.dataTransfer.files[0]
    );
    document.getElementById("file-input").files = e.dataTransfer.files;
  }
});

document.getElementById("file-input").addEventListener("change", (e) => {
  if (e.target.files) {
    document.querySelector("#product-display").src = URL.createObjectURL(
      e.target.files[0]
    );
  }
});

editProductForm.addEventListener("submit", updateProduct);
