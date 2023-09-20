import { currentPage } from "./app.js";

export const DEFAULT_PAGE_SIZE = 5;

export const createPagination = (productCount) => {
  const pageCount = Math.ceil(productCount / DEFAULT_PAGE_SIZE);

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

export const generateQueryParams = (page = 1) => {
  let queryParams = `?page=${page}&limit=${DEFAULT_PAGE_SIZE}`;
  return queryParams;
};
