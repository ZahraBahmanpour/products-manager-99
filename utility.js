import { currentPage, currentPageSize } from "./app.js";

const DEFAULT_PAGE_SIZE = 5;

const createPagination = (productCount) => {
  const pageCount = Math.ceil(productCount / currentPageSize);

  let lis = `<li class="page-item ${
    Number(currentPage) === 1 ? "disabled no-events" : ""
  }" id="previous">
                <a class="page-link" href="#" aria-label="Previous">&laquo;</a>
              </li>`;

  for (let i = 1; i <= pageCount; i++) {
    lis += `<li id="page-${i}" class="page-item ${
      i === Number(currentPage) ? "active" : ""
    }"><a href="#" class="page-link">${i}</a></li>`;
  }

  lis += `<li class="page-item ${
    Number(currentPage) === pageCount ? "disabled no-events" : ""
  }" id="next" data-page-count="${pageCount}">
              <a class="page-link" href="#" aria-label="Next">&raquo;</a>
            </li>`;
  document.querySelector("ul.pagination").innerHTML = lis;
};

const generateQueryParams = (page = 1, queryString = "", pageSize) => {
  let queryParams = `?page=${page}&limit=${pageSize}`;
  if (queryString !== "") {
    queryParams += `&name=${queryString}`;
  }
  return queryParams;
};

const updateURLParam = (key, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState(undefined, undefined, url);
};

const debounce = (cb, delay = 1000) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb(...args), delay);
  };
};

const person = { username: "Admin", password: "12345" };
export default person;

export {
  DEFAULT_PAGE_SIZE,
  createPagination,
  generateQueryParams,
  updateURLParam,
  debounce,
};
