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
  renderFilters(app, checkboxFilters, filters);
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
function renderFilters(app: HTMLDivElement, filtersCheckbox: IFiltersCheckbox, filters: IFilters) {
  app.innerHTML = `
    <div class="container">
      <div class="allFilters">
        <div class="containerOfFilters"></div>
        <div class="containerOfSliders"></div>
        <div class="containerOfSearch">
          <input type="text" class="search" value=${filters.search}>
        </div>
      </div>
      <div class="products"></div>
    </div>
    `;

  const filtersHTML = document.querySelector('.containerOfFilters');
  for (const item in filtersCheckbox) {
    const ul = document.createElement('ul');
    ul.classList.add(item);
    const liHtml: string = filtersCheckbox[item as keyof IFiltersCheckbox].map((i: string) => createHTMLfilter(i, filters.state[item as keyof ISearch])).join("");
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
          <h2>${prod.title}</h2>
          <img class="thumbnail" src="${prod.thumbnail}" alt="telephone">
          <h2>${prod.description}</h2>
          <p>${prod.price}</p>
          <a href="#/productCard/" class="ref" data-href="#/productCard/">Инфо</a>
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
      const value = product[f as keyof ISearch]
      if (filters.state[f as keyof ISearch].indexOf(value) >= 0) i++;  
    }

    if(i === cntFilter) return true
    return false
  })

  productForRender = productForRender.filter(product => {
    if(product["price"] < filters.range.minPrice || product["price"] > filters.range.maxPrice) return false;
    return true;
  })

  productForRender = productForRender.filter(product => {
    if(product["title"].indexOf(filters.search) >= 0 ||
       product["description"].indexOf(filters.search) >= 0 ||
       product["brand"].indexOf(filters.search) >= 0 ||
       product["category"].indexOf(filters.search) >= 0 ) return true;
       return false;
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
    filters.state = { "category": [], "brand": [] };
    filters.range = { "minPrice": 0, "maxPrice": 0 };
    filters.info = 0;

    for (const [keys, value] of params.entries()) {

      if (typeof value === 'string' && typeof keys === 'string') {
        if(keys === "category" || keys === "brand") {
          filters.state[keys] = value.split('↕');
        }
        else if (keys === "price") {
          filters.range["minPrice"] = +value.split('↕')[0];
          filters.range["maxPrice"] = +value.split('↕')[1];
        }
        else if (keys === "info") {
          filters.info = +value;
        }
        else {
          filters.search = value;
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

export interface IProduct {
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