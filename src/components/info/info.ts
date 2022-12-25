import { IFilters} from "../app/app";
import products from "../db/shop.json"

export default function infoLoader(filters: IFilters, app: HTMLDivElement,) {
  const elem = products.find(item => item["id"] === filters.info);

  app.innerHTML = `
          <h1>${elem!.title}</h1>
`
}
