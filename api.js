import { createPagination, generateQueryParams } from "./utility.js";
import { currentPage, currentPageSize } from "./app.js";

const BASE_URL = "https://6300a18859a8760a757d441c.mockapi.io";

const productsTable = document.querySelector("#products tbody");

export const controller = new AbortController();
const signal = controller.signal;

// READ
export const readProducts = async () => {
  const loadingSpinner = document.querySelector(".spinner-container");
  try {
    loadingSpinner.classList.toggle("d-none");
    const res = await fetch(
      `${BASE_URL}/products${generateQueryParams(
        currentPage,
        currentPageSize
      )}`,
      {
        signal,
      }
    );
    const data = await res.json();
    const { products, count } = data;
    productsTable.innerHTML = "";
    products.forEach(addToDOM);
    createPagination(count);
  } catch (error) {
    console.log(error.message);
  } finally {
    loadingSpinner.classList.toggle("d-none");
  }
};

// UPDATE DOM
const addToDOM = (product) => {
  const productRow = document.createElement("tr");
  productRow.dataset.id = product.id;
  const { nameCell, priceCell, countCell, createDateCell, actionCell } =
    generateTableCells(product);

  productRow.appendChild(nameCell);
  productRow.appendChild(priceCell);
  productRow.appendChild(countCell);
  productRow.appendChild(createDateCell);
  productRow.appendChild(actionCell);

  productsTable.appendChild(productRow);
};

const generateTableCells = (product) => {
  const nameCell = document.createElement("td");
  nameCell.innerHTML = product.name;
  nameCell.title = product.name;

  const priceCell = document.createElement("td");
  priceCell.innerHTML = product.price;
  priceCell.title = product.price;

  const countCell = document.createElement("td");
  countCell.innerHTML = product.countInStock;
  countCell.title = product.countInStock;

  const createDateCell = document.createElement("td");
  const date = new Date(product.createdAt).toDateString();
  createDateCell.innerHTML = date;
  createDateCell.title = date;

  const viewButton = document.createElement("button");
  viewButton.dataset.id = product.id;
  viewButton.innerHTML = '<i class="bi bi-eye"></i>';
  viewButton.title = "VIEW";
  viewButton.className = "btn btn-warning btn-sm m-1 text-white";

  const editButton = document.createElement("button");
  editButton.dataset.id = product.id;
  editButton.innerHTML = '<i class="bi bi-pen"></i>';
  editButton.title = "UPDATE";
  editButton.className = "btn btn-primary btn-sm";

  const deleteButton = document.createElement("button");
  deleteButton.dataset.id = product.id;
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  deleteButton.title = "DELETE";
  deleteButton.className = "btn btn-danger btn-sm m-1";

  const actionCell = document.createElement("td");
  actionCell.appendChild(viewButton);
  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
  return { nameCell, priceCell, countCell, createDateCell, actionCell };
};
