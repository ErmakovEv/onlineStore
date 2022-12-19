import { ISearch } from "../app/app";
import products from "../db/shop.json";

export default function renderProductsPage(
  state: ISearch | string,
  app: HTMLDivElement
) {
  console.log(state);
    const filtersArray = ["smartphones", "smart watch", "laptops", "ebook"];
    app.innerHTML = `
    <div class="container">
      <ul class="filters">
      ${filtersArray.map((filter) => {
        return `
          <li class="filter">
          <input type="checkbox" class="checkbox" id=${filter} name=${filter}>
          <label for=${filter}>${filter}</label>
        </li>`})}
      </ul>
    </div>  
    `;
}

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