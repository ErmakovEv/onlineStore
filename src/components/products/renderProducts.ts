import products from "../db/shop.json";
import { ISearch } from "../app/app";

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

//общий рендер страницы продуков (фильтры + продукты)
export default function renderProductsPage(
  state: ISearch,
  app: HTMLDivElement
) {

  //ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР СТРАНИЦЫ

  //считываем квери-параметры из URL и обновляем state
  state = readQueryAnd(state);
  //ВСЕ фильтры TODO реализация фильтров dual-slider
  const checkboxFilters = createCheckboxFilter();
  renderFilters(app, checkboxFilters, state);
  renderProducts(state);

  // ВЗАИМОДЕЙСТВИЕ СО СТРАНИЦЕЙ
  eventWorker(state)
}

function eventWorker(state: ISearch) {
  for (const param in state) {
    const filtersCheckboxGroup =
      document.querySelector<HTMLDivElement>(`.${param}`);
    if (filtersCheckboxGroup) {
      filtersCheckboxGroup.addEventListener('click', e => {
        const checkbox = e.target as HTMLDivElement;
        if (checkbox.tagName === 'INPUT') {
          const index = state[param as keyof ISearch].indexOf(checkbox.id);
          if (!state[param as keyof ISearch].length || index === -1) {
            state[param as keyof ISearch].push(checkbox.id);
          } else {
            const copy: string[] = [];
            for (let i = 0; i < state[param as keyof ISearch].length; i++) {
              if (i !== index) copy.push(state[param as keyof ISearch][i]);
              console.log('else')
            }
            state[param as keyof ISearch] = copy;
          }
          console.log('eventWorker, state =', state)

          const pathQueryHash = makeQueryParamString(state);
          console.log(pathQueryHash)
          window.history.pushState({}, "", pathQueryHash);
          renderProducts(state);
        }
      })
    }
  }
}


function makeQueryParamString(state: ISearch): string {
  const path = window.location.pathname;
  const hash = window.location.hash;
  let tmpQuery = '';
  const searchParams = new URLSearchParams();
  for (const filter in state) {
    if (state[filter as keyof ISearch].length) {
      let valueSearchParams = '';
      state[filter as keyof ISearch].forEach((item, index) => {
        if (index === state[filter as keyof ISearch].length - 1) {
          valueSearchParams += `${item}`
        }
        else {
          valueSearchParams += `${item}↕`
        }
      });
      
      searchParams.set(filter, valueSearchParams);

    }
  }
  tmpQuery = searchParams.toString();
  console.log("makeQueryParamString", state)
  if (tmpQuery) {
    return path + '?' + tmpQuery + hash;
  }
  return path + hash;
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
      <div class="containerOfFilters"></div>
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
function renderProducts(state: ISearch) {
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
    console.log(i)
    if(i === cntFilter) return true
    return false
  })

  console.log(productForRender);
  if (prod) {
    prod.innerHTML = `
      ${productForRender.map(prod => createHTMLproduct(prod)).join("")}
  `
  }
}

//считываем квери-параметры и обновляем state
function readQueryAnd(state: ISearch) {
  const params = new URLSearchParams(window.location.search)
  console.log("params", params.keys())
  if (params.keys()) {
    state = { "category": [], "brand": [] }
    for (const [keys, value] of params.entries()) {
      console.log("keys = ", keys, "val = ", value);
      if (typeof value === 'string' && typeof keys === 'string') {
        state[keys] = value.split('↕');
      }
    }
  }
  console.log("state после readQuery", state)
  return state;
}



interface IFiltersCheckbox {
  "category": string[];
  "brand": string[];
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

