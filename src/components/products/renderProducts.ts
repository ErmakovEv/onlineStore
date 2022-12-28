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

//отрисовка sidebar
import "/src/scss/_sidebar.scss";

//рендер фильтра
function renderFilters(app: HTMLDivElement, filtersCheckbox: IFiltersCheckbox, filters: IFilters) {
  app.innerHTML = `
    <div class="container">
      <div class="allFilters side-bar">
        <div class="containerOfFilters">
        <h3 class="caterogy-tittle  tittle">Category</h3>
                <hr>
                </div>
        <div class="containerOfSliders">
        <h3 class="price-tittle  tittle">Price</h3>
                <hr>
                </div>
        <div class="containerOfSearch">
          <input type="text" class="search" value=${filters.search}>
        </div>
        <label for="sort-select">Sort by...</label>
        <select class="sort-select" name="sort-variants">
            <option value="price-high-low" ${filters.sort === 0 ? "selected" : ""}>Price: High - Low</option>
            <option value="price-low-high" ${filters.sort === 1 ? "selected" : ""}>Price: Low - High</option>
            <option value="alphabetical" ${filters.sort === 2 ? "selected" : ""}>Alphabetical</option>
        </select>
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
import "/src/scss/_renderProd.scss";
import "/src/scss/_base.scss";
const createHTMLproduct = (prod: IProduct) => {
  return `
  <div class="card card-${prod.title}">
        <div class="product-item">
          <div class="product-photo">
             <img class="thumbnail" src="${prod.thumbnail}" alt="${prod.brand}">
          </div>  
          <div class="product-list">
            <h3 class="product product-name">${prod.title}</h3>
            <p class="product product-сategory">Category:${prod.category}</p>
            <p class="product product-brand">Brand:${prod.brand}</p>
            <p class="product product-discount">Discount:${prod.discountPercentage}</p>
            <p class="product product-raiting">Raiting:${prod.rating}</p>
            <p class="product product-price">Price:${prod.price}</p>
          </div>
        </div>  
      
        <a href="#/productCard/" class="ref" data-href="#/productCard/">Инфо</a>
        <button class="addCart">add</button>
      
      </div>
      `
}


//рендер продуктов
export function renderProducts(filters: IFilters) {

  let cntFilter = 0;
  for (const f in filters.state) {
    if (filters.state[f as keyof ISearch].length > 0) cntFilter++;
  }
  const prod = document.querySelector('.products');
  let productForRender: IProduct[] = products.filter(product => {
    let i = 0;
    for (const f in filters.state) {
      const value = product[f as keyof ISearch]
      if (filters.state[f as keyof ISearch].indexOf(value) >= 0) i++;
    }

    if (i === cntFilter) return true
    return false
  })

  productForRender = productForRender.filter(product => {
    if (product["price"] < filters.range.minPrice || product["price"] > filters.range.maxPrice) return false;
    return true;
  })

  productForRender = productForRender.filter(product => {
    if (product["title"].indexOf(filters.search) >= 0 ||
      product["description"].indexOf(filters.search) >= 0 ||
      product["brand"].indexOf(filters.search) >= 0 ||
      product["category"].indexOf(filters.search) >= 0) return true;
    return false;
  })

  console.log(filters)

  if (filters.sort === 1) {
    productForRender.sort((a: IProduct, b: IProduct) => a["price"] - b["price"]);
  } else if (filters.sort === 0) {
    productForRender.sort((a: IProduct, b: IProduct) => b["price"] - a["price"]);
  } else {
    productForRender.sort((a: IProduct, b: IProduct) => {
      if (a["title"] > b["title"]) return 1;
      else if (a["title"] < b["title"]) return -1;
      else return 0;
    })
  }

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
        if (keys === "category" || keys === "brand") {
          filters.state[keys] = value.split('↕');
        }
        else if (keys === "price") {
          filters.range["minPrice"] = +value.split('↕')[0];
          filters.range["maxPrice"] = +value.split('↕')[1];
        }
        else if (keys === "info") {
          filters.info = +value;
        }
        else if (keys === "search") {
          filters.search = value;
          console.log("search", value)
        }
        else if (keys === "sort") {
          filters.sort = +value;
        }
        else {
          console.log(404)
        }
      }
    }
    if (filters.range["minPrice"] === 0 && filters.range["maxPrice"] === 0) {
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