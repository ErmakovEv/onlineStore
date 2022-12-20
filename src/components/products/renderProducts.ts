
import products from "../db/shop.json";
import { ISearch } from "../app/app";

function makeQueryParamString(filtersState) {
  const path = window.location.pathname;
  const hash = window.location.hash;
  let tmpQuery = '';
  
  for(let filter in filtersState) {
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


//отрисовка фильтров
const createHTMLfilter = (str: string, state) => {
  return `
  <li class="filter">
    <input type="checkbox" class="checkbox" id=${str} ${state["category"].indexOf(str) >= 0 ? "checked" : ""}>
    <label for=${str}>${str}</label>
  </li>
  `
}

//отрисовка карточки продукта
const createHTMLproduct = (prod) => {
  return `
    <div class="card card-${prod.title}">
        <img src="${prod.images[0]}" alt="telephone">
        <h2>${prod.title}</h2>
        <p>${prod.title}</p>
    </div>
    `
}

//рендер продуктов
function renderProducts(state) {
    const prod = document.querySelector('.products');
    let productForRender;
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

//общий рендер страницы продуков (фильтры + продукты)
export default function renderProductsPage(
  state: ISearch | string,
  app: HTMLDivElement
) {
    //ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР СТРАНИЦЫ

    //ВСЕ фильтры (добавить/разбить по подмассивам)
    const filtersArray = ["smartphones", "smart-watch", "laptops", "ebook"];
    //вставка всех фильтров на страницу
    app.innerHTML = `
    <div class="container">
      <ul class="filters">
      ${ filtersArray.map(filter => createHTMLfilter(filter, state)).join("")}
      </ul>
      <div class="products"></div>
    </div>
    `;
    renderProducts(state);
    let pathQueryHash = makeQueryParamString(state);
    window.history.pushState({}, "", pathQueryHash);

  // ВЗАИМОДЕЙСТВИЕ СО СТРАНИЦЕЙ
  // захват фильтров
  const filtersHTMLelemets =
  document.querySelectorAll<HTMLInputElement>(".checkbox");
  //добавление выбранных фильтров в state
  filtersHTMLelemets.forEach(filt => filt.addEventListener("change", () => {
    const index = state["category"].indexOf(filt.id);
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
    pathQueryHash = makeQueryParamString(state);
    window.history.pushState({}, "", pathQueryHash);
  }))
  };