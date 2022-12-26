import locationResolver from "./router";

export interface IRange {
  minPrice: number;
  maxPrice: number;
}

export interface ISearch {
  category: string[];
  brand: string[];
}

export interface IFilters {
  state: ISearch,
  range: IRange,
  info: number,
  cart: number [],
  search: string
} 

class App {

  filters: IFilters = {
    state: {
      category: [],
      brand: []
    },

    range: {
      minPrice: 0,
      maxPrice: 0
    },

    info: 0,

    cart: [],

    search: ""

  }


  start() {
    window.addEventListener("load", () => {
      const location = window.location;
      this.filters = locationResolver(this.filters, location.hash);
    });
    const refs = document.querySelectorAll<HTMLAnchorElement>(".ref");
    if (refs) {
      refs.forEach((ref) => {
        ref.addEventListener("click", () => {
          this.filters = locationResolver(this.filters, String(ref.dataset.href));
        });
      });
    }
  }
}

export default App;
