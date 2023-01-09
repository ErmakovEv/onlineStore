import productsLoader from "../products/products";
import infoLoader from "../info/info";
import { IFilters } from "./app";
import cartLoader from "../cart/cart";
import popUpLoader from "../cart/popup";

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
        filters = productsLoader(filters, app);
        break;
      case "#/cart/":
        cartLoader(filters, app);
        break;
      case "#/productCard/":
        //TODO проверка, если нет в массиве продуктов - 404
        // app.innerHTML = `
        //           <h1>${location}</h1>
        //           <p>Страница карточки продукта ${filters.info}</p>
        //       `;
        infoLoader(filters, app);
        case "#/popup":
          // app.innerHTML=`<p>lorem10<p>`;
        popUpLoader(filters, app);
        break;
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
