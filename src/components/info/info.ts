import { IFilters} from "../app/app";
import products from "../db/shop.json";
import locationResolver from "../app/router";


import "/src/scss/_info.scss";
import "/src/scss/_base.scss";

export default function infoLoader(filters: IFilters, app: HTMLDivElement,) {
  const elem = products.find(item => item["id"] === filters.info);

  app.innerHTML = `
  <div class="container">
  <div class="link-adress">
   <a>Store</a>
   >> 
   <a>${elem!.category}</a>
    >> 
   <a>${elem!.brand}</a>
   >> 
   <a>${elem!.title}</a>
  </div>
   <div class="product-page">
           <div class="product-tittle">
               <h1>${elem!.title}</h3>
           </div>
           <div class="product-data">
               <div class="product-photos">
                   <div class="products-photos-slides">
                       <img src="${elem!.images[0]}">
                       <img src="${elem!.images[1]}">
                       <img src="${elem!.images[2]}">
                   </div>
                   <div class="main-photo">
                       <img src="${elem!.thumbnail}">
                   </div>
                   
               </div>
               <div class="product-discription">
                   <div class="product-detail-item">
                       <h3>Description</h3>
                   <p>${elem!.description}</p>
                   </div>
                   <div class="product-detail-item">
                       <h3>Discount Percentage:</h3>
                   <p>${elem!.discountPercentage}</p>
                   </div>
                   <div class="product-detail-item">
                       <h3>Rating:</h3>
                   <p>${elem!.rating}</p>
                   </div>
                   <div class="product-detail-item">
                       <h3>Stock:</h3>
                   <p>${elem!.stock}</p>
                   </div>
                   <div class="product-detail-item">
                       <h3>Brand:</h3>
                   <p>${elem!.brand}</p>
                   </div>
                   <div class="product-detail-item">
                       <h3>Category:</h3>
                   <p>${elem!.category}</p>
                   </div>
               </div>
               <div class="product-add">
                   <h3 class="product-last-cost">${elem!.price}</h3>
                   <button class="custom-btn btn-7"><span>Add to card</span></button>
                   <a href="#/popup" class="ref buy-now-inf" data-href="#/popup">
                   <button class="custom-btn btn-7"><span>Buy now</span></button> 
                   </a>
               </div>
           </div>
       </div>
   </div>
</div>
`
loaderByuNowBtnInf(filters)
}


function loaderByuNowBtnInf(filters: IFilters) {
    const byuNowBtnInf = document.querySelector<HTMLLinkElement>(".buy-now-inf");
    byuNowBtnInf!.addEventListener("click", () => {
        console.log(byuNowBtnInf!.href);
        filters = locationResolver(filters, String(byuNowBtnInf!.dataset.href));
    });
}