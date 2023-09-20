const DEFAULT_PAGE_SIZE = 5;

export const createPagination = (productCount) => {
  const pageCount = Math.ceil(productCount / DEFAULT_PAGE_SIZE);

  let lis = `<li class="page-item" id="previous">
                <a class="page-link" href="#" aria-label="Previous">&laquo;</a>
              </li>`;

  for (let i = 1; i <= pageCount; i++) {
    lis += `<li id="page-${i}" class="page-item"><a href="#" class="page-link">${i}</a></li>`;
  }

  lis += `<li class="page-item" id="next" data-page-count="${pageCount}">
              <a class="page-link" href="#" aria-label="Next">&raquo;</a>
            </li>`;
  document.querySelector("ul.pagination").innerHTML = lis;
};
