import products from "../db/shop.json";
import { ISearch } from "../app/app";
import renderSliders from "./slider/doubleSlider";

//общий рендер страницы продуков (фильтры + продукты)
export default function renderProductsPage(
  state: ISearch,
  app: HTMLDivElement
) {

  //ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР СТРАНИЦЫ
  //считываем квери-параметры из URL и обновляем state
  state = readQueryAndUpdateState(state);
  //ВСЕ фильтры TODO реализация фильтров dual-slider
  const checkboxFilters = createCheckboxFilter();
  renderFilters(app, checkboxFilters, state);
  renderSliders(state);
  renderProducts(state);

  // ВЗАИМОДЕЙСТВИЕ СО СТРАНИЦЕЙ
  // eventWorker(state)
  return state;
}


//отрисовка фильтра
const createHTMLfilter = (str: string, filterInstate: string[]) => {
  return `
    <div class="filter">
      <input type="checkbox" class="checkbox" id=${str} ${filterInstate.indexOf(str) >= 0 ? "checked" : ""}>
      <label for=${str}>${str}</label>
    </div>
    `
}

//рендер фильтра
function renderFilters(app: HTMLDivElement, filtersCheckbox: IFiltersCheckbox, state: ISearch) {
  app.innerHTML = `
    <div class="container">
      <div class="allFilters">
        <div class="containerOfFilters"></div>
        <div class="containerOfSliders"></div>
      </div>
      <div class="products"></div>
    </div>
    `;

  const filtersHTML = document.querySelector('.containerOfFilters');
  for (const item in filtersCheckbox) {
    const ul = document.createElement('ul');
    ul.classList.add(item);
    const liHtml: string = filtersCheckbox[item as keyof IFiltersCheckbox].map((i: string) => createHTMLfilter(i, state[item as keyof ISearch])).join("");
    ul.innerHTML = liHtml;
    if (filtersHTML) {
      filtersHTML.append(ul);
    }
  }
}

//отрисовка карточки продукта
const createHTMLproduct = (prod: IProduct) => {
  return `
      <div class="card card-${prod.title}">
          <img class="thumbnail" src="${prod.thumbnail}" alt="telephone">
          <h2>${prod.title}</h2>
          <p>${prod.title}</p>
      </div>
      `
}

//рендер продуктов
export function renderProducts(state: ISearch) {

  let cntFilter = 0;
  for(const f in state) {
    if (state[f as keyof ISearch].length > 0) cntFilter++;  
  }
  const prod = document.querySelector('.products');
  const productForRender: IProduct[] = products.filter( product => {
    let i = 0;
    for(const f in state) {
      if (state[f as keyof ISearch].indexOf(product[f]) >= 0) i++;  
    }

    if(i === cntFilter) return true
    return false
  })


  if (prod) {
    prod.innerHTML = `
      ${productForRender.map(prod => createHTMLproduct(prod)).join("")}
  `
  }
}

//считываем квери-параметры и обновляем state
function readQueryAndUpdateState(state: ISearch) {
  const params = new URLSearchParams(window.location.search)

  if (params.keys()) {
    state = { "category": [], "brand": [] }
    for (const [keys, value] of params.entries()) {

      if (typeof value === 'string' && typeof keys === 'string') {
        state[keys] = value.split('↕');
      }
    }
  }

  return state;
}

function genUniqArr(arr: IProduct[], filter: "category" | "brand") {
  const copy = arr.map(item => {
    return item[filter];
  })
  const set = new Set(copy);
  return Array.from(set);
}

function createCheckboxFilter(): IFiltersCheckbox {
  return {
    "category": genUniqArr(products, "category"),
    "brand": genUniqArr(products, "brand")
  }
}



/////////
interface IFiltersCheckbox {
  "category": string[];
  "brand": string[];
}

interface IProduct {
  "id": number;
  "title": string;
  "description": string;
  "price": number,
  "discountPercentage": number;
  "rating": number;
  "stock": number;
  "brand": string;
  "category": string;
  "thumbnail": string;
  "images": string[];
}