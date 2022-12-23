import locationResolver from "./router";

export interface ISearch {
  category: string[];
  brand: string[];
}

class App {
  state: ISearch = {
    category: [],
    brand: []
  };

  start() {
    window.addEventListener("load", () => {
      const location = window.location;
      this.state = locationResolver(this.state, location.hash);
    });
    const refs = document.querySelectorAll(".ref");
    if (refs) {
      refs.forEach((ref) => {
        ref.addEventListener("click", () => {
          this.state = locationResolver(this.state, ref["dataset"].href);
        });
      });
    }
  }
}

export default App;
