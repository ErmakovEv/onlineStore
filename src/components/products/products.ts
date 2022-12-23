import { ISearch } from "../app/app";
import renderProductsPage from "./renderProducts";
import eventWorker from "./productsWorker";

export default function productsLoader(
  state: ISearch,
  app: HTMLDivElement,
  location: Window["location"] | string
) {
  state = renderProductsPage(state, app);
  state = eventWorker(state)
  return state;
}
