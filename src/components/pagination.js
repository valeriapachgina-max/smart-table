import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер

  let pageTemplate = null;
  if (pages.firstElementChild) {
    pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();
  }

  return (data, state, action) => {

    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы

    const rowsPerPage = state.rowsPerPage;
    const pageCount = Math.ceil(data.length / rowsPerPage);
    let page = state.page;

    // @todo: #2.6 — обработать действия

    if (action) {
      let actionName = "";
      if (action.name) {
        actionName = action.name;
      } else if (action.tagName) {
        actionName = action.getAttribute("name") || "";
        if (!actionName) {
          actionName = action.dataset.action || "";
        }
      }
      switch (actionName) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
        default:
          break;
      }
    }

    // @todo: #2.4 — получить список видимых страниц и вывести их

    const visiblePages = getPages(page, pageCount, 5);
    if (pageTemplate) {
      pages.replaceChildren(
        ...visiblePages.map((pageNumber) => {
          const el = pageTemplate.cloneNode(true);
          return createPage(el, pageNumber, pageNumber === page);
        }),
      );
    } else {
      pages.replaceChildren();
    }

    // @todo: #2.5 — обновить статус пагинации

    fromRow.textContent = (page - 1) * rowsPerPage + 1;
    toRow.textContent = Math.min(page * rowsPerPage, data.length);
    totalRows.textContent = data.length;

    // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    const skip = (page - 1) * rowsPerPage;
    return data.slice(skip, skip + rowsPerPage);
  };
};
