import { ISearch } from "../app/app";
import {renderProducts} from "./renderProducts"

export default function eventWorker(state: ISearch) {
  for (const param in state) {
    const filtersCheckboxGroup =
      document.querySelector<HTMLDivElement>(`.${param}`);
    if (filtersCheckboxGroup) {
      filtersCheckboxGroup.addEventListener('click', e => {
        const checkbox = e.target as HTMLDivElement;
        if (checkbox.tagName === 'INPUT') {
          const index = state[param as keyof ISearch].indexOf(checkbox.id);
          if (!state[param as keyof ISearch].length || index === -1) {
            state[param as keyof ISearch].push(checkbox.id);
          } else {
            const copy: string[] = [];
            for (let i = 0; i < state[param as keyof ISearch].length; i++) {
              if (i !== index) copy.push(state[param as keyof ISearch][i]);

            }
            state[param as keyof ISearch] = copy;
          }
          console.log("eventWorker", state)
          const pathQueryHash = makeQueryParamString(state);
          window.history.pushState({}, "", pathQueryHash);
          renderProducts(state);
        }
      })
    }
  }
  return state;
}


function makeQueryParamString(state: ISearch): string {
  const path = window.location.pathname;
  const hash = window.location.hash;
  let tmpQuery = '';
  const searchParams = new URLSearchParams();
  for (const filter in state) {
    if (state[filter as keyof ISearch].length) {
      let valueSearchParams = '';
      state[filter as keyof ISearch].forEach((item, index) => {
        if (index === state[filter as keyof ISearch].length - 1) {
          valueSearchParams += `${item}`
        }
        else {
          valueSearchParams += `${item}↕`
        }
      });
      
      searchParams.set(filter, valueSearchParams);

    }
  }
  tmpQuery = searchParams.toString();
  if (tmpQuery) {
    return path + '?' + tmpQuery + hash;
  }
  return path + hash;
}