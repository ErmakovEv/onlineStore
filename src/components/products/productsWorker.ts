import { IFilters, ISearch } from "../app/app";
import { filteredProduct, renderProducts, renderTotal } from "./renderProducts"
import products from "../db/shop.json"
import locationResolver from "../app/router"

export default function eventWorker(filters: IFilters) {
  listenCheckboxFilters(filters);
  listenSlidersFilters(filters);
  listenFilterButtons(filters)
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

export function addToCart(target: HTMLLinkElement | HTMLButtonElement, filters: IFilters) {
  const nameCurrentProduct = target.dataset.title;
  console.log("nameCurrentProduct", nameCurrentProduct)
  const currentProduct = products.find(item => item["title"] === nameCurrentProduct)
  const targetId = currentProduct!["id"];
  const set = new Set(filters.cart);
  set.has(targetId) ? set.delete(targetId) : set.add(targetId)
  filters.cart = Array.from(set);
  renderTotal(filters)
}

function listenButtonsInProductCard(filters: IFilters) {
  const blockProduct = document.querySelector<HTMLDivElement>(".products");
  if (blockProduct) {
    blockProduct.addEventListener("click", (e) => {
      if ((e.target as HTMLLinkElement).tagName === "A") {
        const nameCurrentProduct = (e.target as HTMLLinkElement)!.dataset.title;
        const currentProduct = products.find(item => item["title"] === nameCurrentProduct)
        const targetId = currentProduct!["id"];
        filters.info = targetId
        console.dir(targetId)
        const pathQueryHash = makeQueryParamString(filters);
        window.history.pushState({}, "", pathQueryHash);
        filters = locationResolver(filters, String((e.target as HTMLLinkElement).dataset.href));

      }
      else if ((e.target as HTMLButtonElement).tagName === "BUTTON") {
        // const nameCurrentProduct = (e.target as HTMLLinkElement)!.dataset.title;
        // const currentProduct = products.find(item => item["title"] === nameCurrentProduct)
        // const targetId = currentProduct!["id"];
        // const set = new Set(filters.cart);
        // set.has(targetId) ? set.delete(targetId) : set.add(targetId)
        // filters.cart = Array.from(set);
        // renderTotal(filters)
        addToCart(e.target as HTMLLinkElement, filters);
      }
    })
  }
}

function listenInputSearch(filters: IFilters) {
  const search = document.querySelector(".search");
  if(search instanceof HTMLInputElement) {
    search.addEventListener("input", (e) => {
      if (e.target instanceof HTMLInputElement) {
        filters.search = e.target.value;
        changeQueryAndRenderProduct(filters);
      }
    })
  }
}

function listenChangeSortSelect(filters: IFilters) {
  const select = document.querySelector(".sort-select");
  if (select instanceof HTMLSelectElement) {
    select.addEventListener("change", (e) => {
      if (e.target instanceof HTMLSelectElement)
      filters.sort = e.target.options.selectedIndex;
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
    searchParams.set("sort", String(sortParams));
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
  const productForRender = filteredProduct(filters);
  renderProducts(filters, productForRender);
}

export function reset(filters: IFilters) {
    filters.state['category'] = [];
    filters.state['brand'] = [];
    filters.range['minPrice'] = 0;
    filters.range['maxPrice'] = 0;
    filters.info = 0;
    filters.search = '';
    const pathQueryHash = makeQueryParamString(filters);
    window.history.pushState({}, "", pathQueryHash);
    locationResolver(filters, "#");
}

function listenFilterButtons(filters: IFilters) {
  const btnsForfilters = document.querySelectorAll('.filters-btn');
  btnsForfilters.forEach(btn => {
    btn.addEventListener('click', e => {
      const target = e.target;
      if(target instanceof HTMLButtonElement) {
        if(target.classList.contains('reset-btn')) {
          reset(filters);
        }
        else {
          navigator.clipboard.writeText(window.location.href)
          .then(() => {
              console.log('Text copied to clipboard');
          })
          .catch(err => {
              console.error('Error in copying text: ', err);
          });
        }
      }

    })
  })
}