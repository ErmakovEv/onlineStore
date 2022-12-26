import { IFilters, ISearch } from "../app/app";
import { renderProducts } from "./renderProducts"
import products from "../db/shop.json"
import locationResolver from "../app/router"

export default function eventWorker(filters: IFilters) {
  listenCheckboxFilters(filters);
  listenSlidersFilters(filters);
  listenButtonsInProductCard(filters);
  listenInputSearch(filters);
  listenChangeSortSelect(filters);
  return filters;
}


function listenCheckboxFilters(filters: IFilters) {
  for (const param in filters.state) {
    const filtersCheckboxGroup = document.querySelector<HTMLDivElement>(`.${param}`);
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
          changeQueryAndRenderProduct(filters);
        }
      })
    }
  }
}

function listenSlidersFilters(filters: IFilters) {
  const sliders = document.querySelectorAll<HTMLInputElement>(".slider");
  const minPrice = document.querySelector<HTMLDivElement>(".minPrice");
  const maxPrice = document.querySelector<HTMLDivElement>(".maxPrice");
  if (sliders) {
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.id === 'fromSlider' || target.id === 'fromInput') {
          filters.range.minPrice = +target.value;
          minPrice!.textContent = target.value;
        } else {
          filters.range.maxPrice = +target.value;
          maxPrice!.textContent = target.value;
        }
        changeQueryAndRenderProduct(filters);
      })
    })
  }
}

function listenButtonsInProductCard(filters: IFilters) {
  const blockProduct = document.querySelector<HTMLDivElement>(".products");
  if (blockProduct) {
    blockProduct.addEventListener("click", (e) => {
      if ((e.target as HTMLLinkElement).tagName === "A") {
        const nameCurrentProduct = (e.target as HTMLLinkElement)!.parentElement!.children[0].textContent;
        const currentProduct = products.find(item => item["title"] === nameCurrentProduct)
        const targetId = currentProduct!["id"];
        filters.info = targetId
        console.dir(targetId)
        const pathQueryHash = makeQueryParamString(filters);
        window.history.pushState({}, "", pathQueryHash);
        filters = locationResolver(filters, String((e.target as HTMLLinkElement).dataset.href));
      }
      else if ((e.target as HTMLButtonElement).tagName === "BUTTON") {
        const nameCurrentProduct = (e.target as HTMLLinkElement)!.parentElement!.children[0].textContent;
        const currentProduct = products.find(item => item["title"] === nameCurrentProduct)
        const targetId = currentProduct!["id"];
        const set = new Set(filters.cart);
        set.has(targetId) ? set.delete(targetId) : set.add(targetId)
        filters.cart = Array.from(set);
        console.log(filters);
      }
    })
  }
}

function listenInputSearch(filters: IFilters) {
  const search = document.querySelector<HTMLInputElement>(".search");
  if(search) {
    search.addEventListener("input", (e) => {
      filters.search = (e.target as HTMLInputElement).value;
      changeQueryAndRenderProduct(filters);
    })
  }
}

function listenChangeSortSelect(filters: IFilters) {
  const select = document.querySelector<HTMLSelectElement>(".sort-select");
  if(select) {
    select.addEventListener("change", (e) => {
      filters.sort = (e.target as HTMLSelectElement).options.selectedIndex;
      changeQueryAndRenderProduct(filters);
    })
  }
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

  if (filters.search) {
    const serParams = filters.search;
    searchParams.set("search", serParams);
  }

  if (filters.sort >= 0) {
    const sortParams = filters.sort;
    searchParams.set("search", String(sortParams));
  } 

  tmpQuery = searchParams.toString();
  if (tmpQuery) {
    return path + '?' + tmpQuery + hash;
  }
  return path + hash;
}

type cb = (filters: IFilters) => void

const changeQueryAndRenderProduct: cb = (filters: IFilters) => {
  const pathQueryHash = makeQueryParamString(filters);
  window.history.pushState({}, "", pathQueryHash);
  renderProducts(filters);
}