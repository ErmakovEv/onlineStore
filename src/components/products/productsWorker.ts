import { IFilters, ISearch } from "../app/app";
import {renderProducts} from "./renderProducts"
import products from "../db/shop.json"
import locationResolver from "../app/router"

export default function eventWorker(filters: IFilters) {  
  for (const param in filters.state) {
    const filtersCheckboxGroup =
      document.querySelector<HTMLDivElement>(`.${param}`);
    if (filtersCheckboxGroup) {
      filtersCheckboxGroup.addEventListener('click', e => {
        const checkbox = e.target as HTMLDivElement; //???
        if (checkbox.tagName === 'INPUT') {
          const index: number = filters.state[param as keyof ISearch].indexOf(checkbox.id);
          if (!filters.state[param as keyof ISearch].length || index === -1) {
            filters.state[param as keyof ISearch].push(checkbox.id);
          } else {
            const copy: string[] = [];
            for (let i = 0; i < filters.state[param as keyof ISearch].length; i++) {
              if (i !== index) copy.push(filters.state[param as keyof ISearch][i]);

            }
            filters.state[param as keyof ISearch] = copy;
          }
          console.log("eventWorker", filters)
          const pathQueryHash = makeQueryParamString(filters);
          window.history.pushState({}, "", pathQueryHash);
          renderProducts(filters);
        }
      })
    }
    const sliderPrice = document.querySelector<HTMLDivElement>(".range_container");
    if(sliderPrice) {
      sliderPrice.addEventListener('input', (e) => {
        if((e.target as HTMLInputElement).tagName === 'INPUT') {
          if((e.target as HTMLInputElement).id === 'fromSlider' || (e.target as HTMLInputElement).id === 'fromInput') {
            filters.range.minPrice = +(e.target as HTMLInputElement).value;
          }
          else {
            filters.range.maxPrice = +(e.target as HTMLInputElement).value;
          }
        }
        const pathQueryHash = makeQueryParamString(filters);
        window.history.pushState({}, "", pathQueryHash);
        renderProducts(filters);
      })
    }
  }

  const blockProduct = document.querySelector<HTMLDivElement>(".products");
  if(blockProduct) {
    blockProduct.addEventListener("click", (e) => {
      if ((e.target as HTMLLinkElement).tagName === "A") {
        const nameCurrentProduct = (e.target as HTMLLinkElement)!.parentElement!.children[0].textContent;
        const currentProduct = products.find(item => item["title"] === nameCurrentProduct)
        const targetId = currentProduct!["id"];
        filters.info = targetId
        console.dir(targetId)
        const pathQueryHash = makeQueryParamString(filters);
        window.history.pushState({}, "", pathQueryHash);
        filters = locationResolver(filters, e.target.dataset.href);
      }
    })
  }

  return filters;
}


function makeQueryParamString(filters: IFilters): string {
  const path = window.location.pathname;
  const hash = window.location.hash;
  let tmpQuery = '';
  const searchParams = new URLSearchParams();
  for (const filter in filters.state) {
    if (filters.state[filter as keyof ISearch].length) {
      let valueSearchParams = '';
      filters.state[filter as keyof ISearch].forEach((item, index) => {
        if (index === filters.state[filter as keyof ISearch].length - 1) {
          valueSearchParams += `${item}`
        }
        else {
          valueSearchParams += `${item}↕`
        }
      });
      
      searchParams.set(filter, valueSearchParams);

    }
  }

  let max = 0;
  products.forEach(product => {
    if (product["price"] > max) max = product["price"];
  })
  let min = max;
  products.forEach(product => {
    if (product["price"] < min) min = product["price"];
  })
  if ((filters.range.minPrice !== min) || (filters.range.maxPrice !== max)) {
    const priceQueryParams = `${filters.range.minPrice}↕${filters.range.maxPrice}`;
    searchParams.set("price", priceQueryParams);
  }

  if (filters.info) {
    const infoParam = `${filters.info}`;
    searchParams.set("info", infoParam);
  }

  tmpQuery = searchParams.toString();
  if (tmpQuery) {
    return path + '?' + tmpQuery + hash;
  }
  return path + hash;
}