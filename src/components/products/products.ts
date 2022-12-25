import { IFilters} from "../app/app";
import renderProductsPage from "./renderProducts";
import eventWorker from "./productsWorker";

export default function productsLoader(
  filters: IFilters,
  app: HTMLDivElement,
) {
  filters = renderProductsPage(filters, app);
  filters = eventWorker(filters)
  return filters;
}
