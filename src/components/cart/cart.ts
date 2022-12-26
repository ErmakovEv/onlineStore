import { IFilters} from "../app/app";
import products from "../db/shop.json"
import { IProduct } from "../products/renderProducts";

import "/src/scss/_cart.scss";
import "/src/scss/_base.scss";

export default function cartLoader(filters: IFilters, app: HTMLDivElement,) {
    const elemsToCart: IProduct[] = [];
    
    for (const product of products) {
        if (filters.cart.indexOf(product["id"]) >= 0) {
            elemsToCart.push(product);
        }
    }
  
    const html: string = elemsToCart.map((prod: IProduct) => {
        return `
        <section class="cart-page">
    <div class="container">
        <div class="product-in-cart">
            <div class="cart-header">
                <h2>${prod.title}</h2>
                <div class="cart-header-control">
                    <div class="cart-items">
                        <span>Items:</span>
                        <input type="text" class="cart-item-num">
                    </div>
                    <div class="cart-pages">
                        <span>Pages:</span>
                        <button class="crt-btn-sides"> &lt; </button>
                        <span class="crt-btn-sides-num">1</span>
                        <button class="crt-btn-sides"> &gt; </button>
                    </div>
                </div>
            </div>
            <div class="cart-product">
                <div class="item-num">1</div>
                <div class="item-img">
                    <img src="${prod.thumbnail}" alt="${prod.category}">
                </div>
                <div class="item-info">
                    <div class="item-info-title">
                        <h2 class ="item-tittel">${prod.title}</h2>
                    </div>
                    <div class="item-info-description">${prod.description}</div>
                    <div class="item-info-details">
                        <div class="item-rating">Rating:${prod.rating}</div>
                        <div class="item-discount">Discount:${prod.discountPercentage}</div>
                    </div>
                </div>
                <div class="number-control">
                    <div class="stock-num">
                        Stock:${prod.stock}
                    </div>
                    <div class="change-amount">
                        <button class="btn-change-amount"> + </button>
                        <span class="">1</span>
                        <button class="btn-change-amount"> - </button>
                    </div>
                    <div class="amount-sum">$</div>
                </div>

            </div>
        </div>
        <div class="sum">
            <div class="sum-tittle">
                <h2>Summary</h2>
            </div>

        </div>
</section>
        `
  }).join("");

  app.innerHTML = html;
}

// <div class="card card-${prod.title}">
//         <h2>${prod.title}</h2>
//         <img class="thumbnail" src="${prod.thumbnail}" alt="telephone">
//         <h2>${prod.description}</h2>
//         <p>${prod.price}</p>
//         <a href="#/productCard/" class="ref" data-href="#/productCard/">Инфо</a>
//         <button class="addCart">add</button>
//     </div>