import { IFilters, ISearch, IRange } from "../app/app";
import renderProductsPage from "./renderProducts";
import eventWorker from "./productsWorker";

export default function productsLoader(
  filters: IFilters,
  app: HTMLDivElement,
  location: Window["location"] | string
) {
  filters = renderProductsPage(filters, app);
  filters = eventWorker(filters)
  return filters;
}
