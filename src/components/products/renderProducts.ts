import products from "../db/shop.json";
import { IFilters, ISearch } from "../app/app";
import renderSliders from "./slider/doubleSlider";

//общий рендер страницы продуков (фильтры + продукты)
export default function renderProductsPage(
  filters: IFilters,
  app: HTMLDivElement
) {

  //ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР СТРАНИЦЫ
  //считываем квери-параметры из URL и обновляем state
  filters = readQueryAndUpdateFilters(filters);

  //ВСЕ фильтры TODO реализация фильтров dual-slider
  const checkboxFilters = createCheckboxFilter();
  renderFilters(app, checkboxFilters, filters.state);
  renderSliders(filters.range);
  renderProducts(filters);

  // ВЗАИМОДЕЙСТВИЕ СО СТРАНИЦЕЙ
  // eventWorker(state)
  return filters;
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
          <h2>${prod.description}</h2>
          <p>${prod.price}</p>
          <button class="more-info">info</button>
          <button class="addCart">add</button>
      </div>
      `
}

//рендер продуктов
export function renderProducts(filters: IFilters) {

  let cntFilter = 0;
  for(const f in filters.state) {
    if (filters.state[f as keyof ISearch].length > 0) cntFilter++;  
  }
  const prod = document.querySelector('.products');
  let productForRender: IProduct[] = products.filter( product => {
    let i = 0;
    for(const f in filters.state) {
      if (filters.state[f as keyof ISearch].indexOf(product[f]) >= 0) i++;  
    }

    if(i === cntFilter) return true
    return false
  })

  productForRender = productForRender.filter(product => {
    if(product["price"] < filters.range.minPrice || product["price"] > filters.range.maxPrice) return false;
    return true;
  })

  if (prod) {
    prod.innerHTML = `
      ${productForRender.map(prod => createHTMLproduct(prod)).join("")}
  `
  }
}

//считываем квери-параметры и обновляем state
function readQueryAndUpdateFilters(filters: IFilters) {
  const params = new URLSearchParams(window.location.search)

  if (params.keys()) {
    filters.state = { "category": [], "brand": [] }
    filters.range = { "minPrice": 0, "maxPrice": 0 }

    for (const [keys, value] of params.entries()) {

      if (typeof value === 'string' && typeof keys === 'string') {
        if(keys === "category" || keys === "brand") {
          filters.state[keys] = value.split('↕');
        }
        else {
          filters.range["minPrice"] = +value.split('↕')[0];
          filters.range["maxPrice"] = +value.split('↕')[1];
        }
      }
    }
    if(filters.range["minPrice"] === 0 && filters.range["maxPrice"] === 0) {
      let max = 0;
      products.forEach(product => {
        if (product["price"] > max) max = product["price"];
      })
      let min = max;
      products.forEach(product => {
        if (product["price"] < min) min = product["price"];
      })
      filters.range["minPrice"] = min;
      filters.range["maxPrice"] = max;
    }
  }

  return filters;
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