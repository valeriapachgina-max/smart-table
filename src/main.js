import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

import { initPagination } from './components/pagination.js';

import { initSorting } from './components/sorting.js'

// @todo: подключение

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */

function collectState() {
  const appRoot = document.querySelector("#app");
  const formElement = appRoot.querySelector('form');
  const state = processFormData(new FormData(formElement));
  const rowsPerPage = parseInt(state.rowsPerPage) || 10; 
  const page = parseInt(state.page ?? 1); 

  return {
    ...state,
    rowsPerPage,
    page,
  };
} 

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения
  // @todo: использование
  result = applySorting(result, state, action);
  result = applyPagination(result, state, action);


  sampleTable.render(result);
}

const tableTmpl = document.querySelector('#table');
const rowTmpl = document.querySelector('#row');
const searchTmpl = document.querySelector('#search');
const headerTmpl = document.querySelector('#header');
const filterTmpl = document.querySelector('#filter');
const paginationTmpl = document.querySelector('#pagination');


const sampleTable = initTable(
  {
    tableTemplate: tableTmpl,
    rowTemplate: rowTmpl,
    search: searchTmpl,      
    header: headerTmpl,     
    filter: filterTmpl,      
    pagination: paginationTmpl, 
    before: ['search', 'header', 'filter'], 
    after: ['pagination'],
  },
  render,
);

// @todo: инициализация


const applyPagination = initPagination(
  { 
    pages: sampleTable.pagination.elements.pages, 
    fromRow: sampleTable.pagination.elements.fromRow, 
    toRow: sampleTable.pagination.elements.toRow, 
    totalRows: sampleTable.pagination.elements.totalRows 
  }, 
  (el, page, isCurrent) => {
    const input = el.querySelector('input');
    const label = el.querySelector('span');
    
    if (input) {
      input.value = page;
      input.checked = isCurrent;
    }
    if (label) {
      label.textContent = page;
    }
    return el;
  }
); 

const applySorting = initSorting(['date', 'total']);

const appRoot = document.querySelector("#app");
if (appRoot) {
    appRoot.appendChild(sampleTable.container);
    render();
} 
