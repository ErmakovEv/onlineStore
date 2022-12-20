import products from "../db/shop.json";
import { ISearch } from "../app/app";

interface IProduct {
  id: number;
  title: string;
  "description": string;
  "price": number,
  "discountPercentage": number;
  "rating": number;
  "stock": number;
  "brand": string;
  "category": string;
  "thumbnail": string;
  "images":string [];
}

//общий рендер страницы продуков (фильтры + продукты)
export default function renderProductsPage(
  state: ISearch,
  app: HTMLDivElement
) {
    //ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР СТРАНИЦЫ

    //считываем квери-параметры из URL и обновляем state
    state = readQueryAnd(state);

    //ВСЕ фильтры (добавить/разбить по подмассивам) 
    // TODO функция формирования массива фильтров и их отрисовка  
    const filtersArray = ["smartphones", "smart-watch", "laptops", "ebook"];
    renderFilters(app, filtersArray, state);
    renderProducts(state);

    // ВЗАИМОДЕЙСТВИЕ СО СТРАНИЦЕЙ
    eventWorker(state)
  }

  //
  function eventWorker(state: ISearch) {
    // захват фильтров со страницы
    const filtersHTMLelemets =
    document.querySelectorAll<HTMLInputElement>(".checkbox");
    //добавление выбранных фильтров в state
    filtersHTMLelemets.forEach(filt => filt.addEventListener("change", () => {
      const index: number = state["category"].indexOf(filt.id);
      console.log(filt.id, index)
      if(!state["category"].length ||  index === -1) {
        state["category"].push(filt.id);
      }
      else {
        const copy: string[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        for(let i = 0; i < state["category"].length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          if(i !== index) copy.push(state["category"][i]);
          console.log('else')
        }
        state["category"] = copy;
      }
      console.log(state["category"])
      renderProducts(state);
      const pathQueryHash = makeQueryParamString(state);
      window.history.pushState({}, "", pathQueryHash);
    }))
  }

  //функция формирования URL
  function makeQueryParamString(filtersState: ISearch): string {
    const path = window.location.pathname;
    const hash = window.location.hash;
    let tmpQuery = '';
    
    for(const filter in filtersState) {
        if(filtersState[filter].length) {
            let valueSearchParams = '';
            filtersState[filter].forEach((item, index) => {
                if(index === filtersState[filter].length - 1) {
                    valueSearchParams += `${item}`
                }
                else {
                    valueSearchParams += `${item}↕`
                }
            });
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set(filter, valueSearchParams);
            tmpQuery += searchParams.toString();
        }
    }
    if(tmpQuery) {
      return path + '?' + tmpQuery + hash;
    }
    return path + hash;
  }
  
  
  //отрисовка фильтра
  const createHTMLfilter = (str: string, state: ISearch) => {
    return `
    <li class="filter">
      <input type="checkbox" class="checkbox" id=${str} ${state["category"].indexOf(str) >= 0 ? "checked" : ""}>
      <label for=${str}>${str}</label>
    </li>
    `
  }

  //рендер фильтра
  function renderFilters(app: HTMLDivElement, filtersArray: string[], state: ISearch) {
    app.innerHTML = `
    <div class="container">
      <ul class="filters">
      ${filtersArray.map(filter => createHTMLfilter(filter, state)).join("")}
      </ul>
      <div class="products"></div>
    </div>
    `;
  }
  
  //отрисовка карточки продукта
  const createHTMLproduct = (prod: IProduct) => {
    return `
      <div class="card card-${prod.title}">
          <img src="${prod.images[0]}" alt="telephone">
          <h2>${prod.title}</h2>
          <p>${prod.title}</p>
      </div>
      `
  }

  //рендер продуктов
function renderProducts(state: ISearch) {
  const prod = document.querySelector('.products');
  let productForRender: IProduct [];
  if (!state["category"].length) {
    productForRender = products;
  }
  else {
    productForRender = products.filter(item => {
      if(state["category"].indexOf(item["category"]) >= 0) return true;
      return false;
    })
  }
  console.log("productForRender = ", productForRender)
  if(prod) {
    prod.innerHTML = `
    <div class="container">
      ${productForRender.map(prod => createHTMLproduct(prod)).join("")}
    </div>
  `
  } 
}

//считываем квери-параметры и обновляем state
function readQueryAnd(state: ISearch) {
  const params = new URLSearchParams(window.location.search)
  if (params.keys()) {
    console.log('start', state)
    state = {"category": []}
    console.log("params.entries()", params.entries())
    for (const [value] of params.entries()){
      if(typeof value === 'string') {
        state["category"] = value.split('↕');
      }
      else {
        console.log("XXXXXXXss")
      }

  }
  console.log('end', state)
  }
  return state;
}