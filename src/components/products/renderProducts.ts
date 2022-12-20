
import products from "../db/shop.json";
import { ISearch } from "../app/app";


//отрисовка фильтров
const createHTMLfilter = (str: string, state) => {
  return `
  <li class="filter">
    <input type="checkbox" class="checkbox" id=${str} ${state["category"].indexOf(str) >= 0 ? "checked" : ""}>
    <label for=${str}>${str}</label>
  </li>
  `
}

const createHTMLproduct = (prod) => {
  return `
    <div class="card card-${prod.title}">
        <img src="${prod.images[0]}" alt="telephone">
        <h2>${prod.title}</h2>
        <p>${prod.title}</p>
    </div>
    `
}

function renderProducts(state) {
    //рендер продуктов
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

//общий рендер страницы продуков
export default function renderProductsPage(
  state: ISearch | string,
  app: HTMLDivElement
) {

    //выбранные фильтры
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
  }))
  };


// function createFilters() {
//   const cat: string[] = [];
//   const filtersArray: Set<string>[] = [];
//   products.forEach(product => {
//     let { category } = product;
//     cat.push(category);
//   });
//   const set: Set<string> = new Set(cat);
//   filtersArray.push(set);
//   return filtersArray;
// };