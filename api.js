import person, { createPagination, generateQueryParams } from "./utility.js";
import { currentPage, currentPageSize, queryString } from "./app.js";

const BASE_URL = "https://6300a18859a8760a757d441c.mockapi.io";

const productsTable = document.querySelector("#products tbody");
export const editModal = document.querySelector("#editModal");

export const controller = new AbortController();
const signal = controller.signal;

/////// CREATE ///////
export const createNewProduct = async (event) => {
  event.preventDefault();
  const newProduct = {
    name: event.target["name"].value,
    price: event.target["price"].value,
    countInStock: event.target["countInStock"].value,
  };
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const createdProduct = await res.json();
    // const formData = new FormData();
    // formData.append("image", event.target["file-input"].files[0]);
    // await fetch(`${BASE_URL}/upload`, { method: "POST", body: formData });
    let xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (event) {
      console.log(`Uploaded ${event.loaded} of ${event.total}`);
    };

    // track completion: both successful or not
    xhr.onloadend = function () {
      if (xhr.status == 200) {
        console.log("success");
      } else {
        console.log("error " + this.status);
      }
    };

    xhr.open("POST", `${BASE_URL}/upload`);
    xhr.send(event.target["file-input"].files[0]);

    addToDOM(createdProduct);
  } catch (error) {
    console.log(error.message);
  }
};

// READ
export const readProducts = async () => {
  const loadingSpinner = document.querySelector(".spinner-container");
  // alert(person.username);
  try {
    loadingSpinner.classList.toggle("d-none");
    const res = await fetch(
      `${BASE_URL}/products${generateQueryParams(
        currentPage,
        queryString,
        currentPageSize
      )}`,
      {
        signal,
      }
    );
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      const { products, count } = data;
      productsTable.innerHTML = "";
      products.forEach(addToDOM);
      createPagination(count);
    } else {
      throw new Error(res.statusText);
    }
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
  editButton.dataset.bsToggle = "modal";
  editButton.dataset.bsTarget = "#editModal";
  editButton.addEventListener("click", () => editProduct(product));

  const deleteButton = document.createElement("button");
  deleteButton.dataset.id = product.id;
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  deleteButton.title = "DELETE";
  deleteButton.className = "btn btn-danger btn-sm m-1";
  deleteButton.dataset.bsToggle = "modal";
  deleteButton.dataset.bsTarget = "#deleteModal";
  deleteButton.addEventListener("click", () => removeProduct(product.id));

  const actionCell = document.createElement("td");
  actionCell.appendChild(viewButton);
  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
  return { nameCell, priceCell, countCell, createDateCell, actionCell };
};

const editProduct = (product) => {
  editModal.querySelector("#name").value = product.name;
  editModal.querySelector("#price").value = product.price;
  editModal.querySelector("#countInStock").value = product.countInStock;
  editModal.querySelector("#description").value = product.description;
  editModal.querySelector("#department").value = product.department;
  editModal.querySelector("#material").value = product.material;
  editModal.querySelector("#confirm-edit-btn").dataset.id = product.id;
};

const removeProduct = (id) => {
  document.querySelector("#confirm-delete-btn").dataset.id = id;
};

export const gatherEditFormData = (e) => {
  return {
    name: e.target["name"].value,
    price: e.target["price"].value,
    countInStock: e.target["countInStock"].value,
    description: e.target["description"].value,
    department: e.target["department"].value,
    material: e.target["material"].value,
  };
};

/////// UPDATE ///////
export const updateProduct = async (e) => {
  e.preventDefault();
  const updatedProduct = gatherEditFormData(e);

  const id = e.target["confirm-edit-btn"].dataset.id;
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedProduct),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const product = await res.json();
    updateOnFrontEnd(product);
  } catch (error) {
    console.log(error.message);
  }
};

const updateOnFrontEnd = (product) => {
  const productRow = productsTable.querySelector(`tr[data-id="${product.id}"]`);
  productRow.innerHTML = "";
  const { nameCell, priceCell, countCell, createDateCell, actionCell } =
    generateTableCells(product);
  productRow.appendChild(nameCell);
  productRow.appendChild(priceCell);
  productRow.appendChild(countCell);
  productRow.appendChild(createDateCell);
  productRow.appendChild(actionCell);
};

/////// DELETE ///////
export const deleteProduct = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
    });
    await res.json();
    readProducts();
  } catch (error) {
    console.log(error.message);
  }
};
