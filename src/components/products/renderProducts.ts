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
  const productForRender = filteredProduct(filters);
  //ВСЕ фильтры TODO реализация фильтров dual-slider
  const checkboxFilters = createCheckboxFilter();
  renderFilters(app, checkboxFilters, filters);
  renderSliders(filters.range);
  renderProducts(filters, productForRender);
  renderTotal(filters)

  // ВЗАИМОДЕЙСТВИЕ СО СТРАНИЦЕЙ
  // eventWorker(state)
  return filters;
}


//отрисовка фильтра
const createHTMLfilter = (str: string, item: string, filterInstate: string[]) => {
  return `
    <div class="filter">
      <input type="checkbox" class="checkbox" id=${str} ${filterInstate.indexOf(str) >= 0 ? "checked" : ""} data-state=${item} data-name=${str}>
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
    const liHtml: string = filtersCheckbox[item as keyof IFiltersCheckbox].map((i: string) => createHTMLfilter(i, item, filters.state[item as keyof ISearch])).join("");
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
        <div class="buttons-add">
        <a href="#/productCard/" class="ref details-btn" data-href="#/productCard/" data-title="${prod.title}">Details</a>
        <button class="addCart" data-title="${prod.title}">Add</button>
      </div>
      </div>
      `
}


//рендер продуктов
export function renderProducts(filters: IFilters, productForRender: IProduct[]) {
  const prod = document.querySelector('.products');
  if (prod) {
    prod.innerHTML = `
      ${productForRender.map(prod => createHTMLproduct(prod)).join("")}
  `
  }

  updFilters(filters, productForRender);

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
      const ans = rangePrice(products);
      filters.range["minPrice"] = ans["min"];
      filters.range["maxPrice"] = ans["max"];
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


export function filteredProduct(filters: IFilters): IProduct[] {
  let cntFilter = 0;
  for (const f in filters.state) {
    if (filters.state[f as keyof ISearch].length > 0) cntFilter++;
  }
  let productForRender: IProduct[]
  if(cntFilter) {
    productForRender= products.filter(product => {
      let i = -1;
      for (const f in filters.state) {
        const value = product[f as keyof ISearch]
        if (filters.state[f as keyof ISearch].indexOf(value) >= 0) i++;
      }
  
      if (i > -1) return true
      return false
    })
  }
  else {
    productForRender = products;
  }


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
  return productForRender;
}


function updFilters(filters: IFilters, productForRender: IProduct[]) {
  const checkboxFilters = document.querySelectorAll<HTMLInputElement>(".checkbox");

  checkboxFilters.forEach( checkbox => {

    let flagState = -1;
    let flagName = -1;
    if(checkbox.dataset.state === 'category') {
      flagState = productForRender.findIndex(product => product['category'] === checkbox.dataset.name);
    }
    else {
      flagName = productForRender.findIndex(product => product['brand'] === checkbox.dataset.name);
    }
    if(flagState === -1 && flagName === -1) {
      (checkbox.nextElementSibling as HTMLLabelElement).style.color = "grey"
    }
    else {
      (checkbox.nextElementSibling as HTMLLabelElement).style.color = "black"
    }
  })

  const fromSlider = document.querySelector<HTMLInputElement>('#fromSlider');
  const toSlider = document.querySelector<HTMLInputElement>('#toSlider');
  const minPrice = document.querySelector(".minPrice")
  const maxPrice = document.querySelector(".maxPrice")
  const ans = rangePrice(productForRender);
  fromSlider!.value = String(ans.min);
  toSlider!.value = String(ans.max);
  minPrice!.textContent = String(ans.min);
  maxPrice!.textContent = String(ans.max);


  
}

function rangePrice(products: IProduct[]) {
  let max = 0;
  products.forEach(product => {
    if (product["price"] > max) max = product["price"];
  })
  let min = max;
  products.forEach(product => {
    if (product["price"] < min) min = product["price"];
  })
  return {min, max}
}

export function renderTotal (filters: IFilters) {
  document.querySelector(".cart-count-tittle")!.textContent = `Cart total: ${filters.cart.reduce( (sum, product) => sum + product, 0)}`
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