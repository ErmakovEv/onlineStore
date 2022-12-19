import productsLoader from "../products/products";
import { ISearch } from "./app";

const app = document.querySelector<HTMLDivElement>("#app");

const locationResolver = (
  state: ISearch | string,
  location: string | Window["location"]
) => {
  if (app) {
    if (typeof location !== "string") {
      location = "#/";
    }
    switch (location) {
      case "#/":
        state = productsLoader(state, app, location);
        break;
      case "#/cart/":
        app.innerHTML = `
                  <h1>${location}</h1>
                  <p>Страница логина</p>
              `;
        break;
      default:
        app.innerHTML = `
            <p>Error</p>
            `;
        break;
    }
  }
  return state;
};

export default locationResolver;
