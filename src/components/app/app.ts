import locationResolver from "./router";

export interface ISearch {
  category: string[];
}

class App {
  state: ISearch = {
    category: []
  };

  start() {
    console.log(this.state);
    window.addEventListener("load", () => {
      const location = window.location;
      console.log("location", location)
      this.state = locationResolver(this.state, location.hash);
    });

    const refs = document.querySelectorAll(".ref");
    if (refs) {
      refs.forEach((ref) => {
        ref.addEventListener("click", () => {
          this.state = locationResolver(this.state, ref["dataset"].href);
        });
        console.log("state in App", this.state);
      });
    }
  }
}

export default App;
