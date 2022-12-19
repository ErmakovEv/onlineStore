import { ISearch } from "../app/app";
import renderProductsPage from "./renderProducts";

export default function productsLoader(
  state: ISearch | string,
  app: HTMLDivElement,
  location: Window["location"] | string
) {
  // console.log("state in productsLoader", state);
  // console.log("app", app);
  // console.log(location);
  renderProductsPage(state, app);

  // <div class="container">
  //   <div class="filters">    //       <div class="filter">
  //         <input type="checkbox" class="checkbox" id="phone" name="phone">
  //         <label for="phone">Phones</label>
  //       </div>
    
  //       <div class="filter">
  //         <input type="checkbox" class="checkbox" id="laptop" name="laptop">
  //         <label for="laptop">Laptops</label>
  //       </div>
    
  //       <div class="filter">
  //         <input type="checkbox" class="checkbox" id="tablet" name="tablet">
  //         <label for="tablet">Tablets</label>
  //       </div>
  //   </div>
    
  //   <div class="products">
  //       <div id="category" class="phone">
  //           <div class="card card-phone">
  //               <img src="./img/phone.jpg" alt="telephone">
  //               <h2>Iphone</h2>
  //               <p>999</p>
  //           </div>
  //           <div class="card card-phone">
  //               <img src="./img/phone.jpg" alt="telephone">
  //               <h2>Iphone</h2>
  //               <p>999</p>
  //           </div>
  //           <div class="card card-phone">
  //               <img src="./img/phone.jpg" alt="telephone">
  //               <h2>Iphone</h2>
  //               <p>999</p>
  //           </div>
  //       </div>
  // `;

  //   let filtersState = {
  //     category: [],
  //   };

  //   const filters = document.querySelectorAll(".filter");
  //   filters.forEach((filter) => {
  //     filter.addEventListener("change", (e) => {
  //       //0. изменить объект filtersState
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //       filtersState = toggleFiltersProps(filtersState, e.target.name);
  //       //1. создать новую квери строку и изменить url
  //       const pathQueryHash = makeQueryParamString(filtersState);
  //       window.history.pushState({}, "", pathQueryHash);
  //       //2. отрендерить фрагмент страницы
  //       renderProductsPage(filtersState);
  //     });
  //   });
  // }

  // function toggleFiltersProps(filtersState, key) {
  //   if (filtersState.category.indexOf(key) >= 0) {
  //     filtersState.category = filtersState.category.filter((item) =>
  //       item === key ? false : true
  //     );
  //   } else {
  //     filtersState.category.push(key);
  //   }
  //   return filtersState;
  // }

  // function makeQueryParamString(filtersState) {
  //   const path = window.location.pathname;
  //   const hash = window.location.hash;
  //   let tmpQuery = "";

  //   for (const filter in filtersState) {
  //     if (filtersState[filter].length) {
  //       let valueSearchParams = "";
  //       filtersState[filter].forEach((item, index) => {
  //         if (index === filtersState[filter].length - 1) {
  //           valueSearchParams += `${item}`;
  //         } else {
  //           valueSearchParams += `${item}↕`;
  //         }
  //       });
  //       const searchParams = new URLSearchParams(window.location.search);
  //       searchParams.set(filter, valueSearchParams);
  //       tmpQuery += searchParams.toString();
  //     }
  //   }
  //   if (tmpQuery) {
  //     return path + "?" + tmpQuery + hash;
  //   }
  //   return path + hash;
  // }

  // function renderProductsPage(filtersState) {
  //   const products = document.querySelectorAll("#category");
  //   products.forEach((product) => {
  //     if (filtersState.category.indexOf(product.className) < 0) {
  //       product.style.display = "none";
  //     } else {
  //       product.style.display = "flex";
  //     }
  //   });
  return state;
}
