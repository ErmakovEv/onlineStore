import productsLoader from "../products/products";
import { ISearch } from "./app";

const app = document.querySelector<HTMLDivElement>("#app");

const locationResolver = (
  state: ISearch,
  location: string | Window["location"]
) => {
  if (app) {
    if (location === "" ) {
      location = "#/";
    }
    switch (location) {
      case "#/":
        state = productsLoader(state, app, location);
        break;
      case "#/cart/":
        console.log('cart!!!')
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
