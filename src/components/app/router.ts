import productsLoader from "../products/products";
import { IFilters } from "./app";

const app = document.querySelector<HTMLDivElement>("#app");

const locationResolver = (
  filters: IFilters,
  location: string | Window["location"]
) => {
  if (app) {
    if (location === "" ) {
      location = "#/";
    }
    switch (location) {
      case "#/":
        filters = productsLoader(filters, app, location);
        break;
      case "#/cart/":
        console.log('cart!!!')
        app.innerHTML = `
                  <h1>${location}</h1>
                  <p>Страница логина</p>
              `;
        break;
      case "#/productCard/":
        app.innerHTML = `
                  <h1>${location}</h1>
                  <p>Страница карточки продукта</p>
              `;
        break;
      default:
        app.innerHTML = `
            <p>Error</p>
            `;
        break;
    }
  }
  return filters;
};

export default locationResolver;
