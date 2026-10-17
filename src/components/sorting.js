import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      const sortButton = action.target;
      const currentState = sortButton.dataset.value || 'none';
      const nextState = sortMap[currentState];
      sortButton.dataset.value = nextState;
      field = sortButton.dataset.field;
      order = nextState === 'none' ? null : nextState;

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((colName) => {
        const otherButton = document.querySelector(`button[data-field="${colName}"]`);
        if (otherButton && otherButton !== sortButton) {
          otherButton.dataset.value = 'none';
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки (при загрузке)
      const allButtons = document.querySelectorAll('button[data-field]');
      const activeButton = Array.from(allButtons).find(
        btn => btn.dataset.value !== 'none'
      );
      if (activeButton) {
        field = activeButton.dataset.field;
        order = activeButton.dataset.value === 'none' ? null : activeButton.dataset.value;
        }
      }
    return sortCollection(data, field, order);
  };
}
