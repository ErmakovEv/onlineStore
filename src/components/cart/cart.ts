import { IFilters} from "../app/app";
import products from "../db/shop.json"
import { IProduct } from "../products/renderProducts";

export default function cartLoader(filters: IFilters, app: HTMLDivElement,) {
    const elemsToCart: IProduct[] = [];
    
    for (const product of products) {
        if (filters.cart.indexOf(product["id"]) >= 0) {
            elemsToCart.push(product);
        }
    }
  
    const html: string = elemsToCart.map((prod: IProduct) => {
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
  }).join("");

  app.innerHTML = html;
}