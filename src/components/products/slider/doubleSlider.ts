import { IRange } from "../../app/app";
import products from "../../db/shop.json"
// import {controlFromInput, controlToInput, controlFromSlider, controlToSlider, getParsed, fillSlider, setToggleAccessible} from "./sliderFunction"


export default function renderSliders(range: IRange) {
  let max = 0;
  products.forEach(product => {
    if (product["price"] > max) max = product["price"];
  })
  let min = max;
  products.forEach(product => {
    if (product["price"] < min) min = product["price"];
  })

  const slidersContainerHTML = document.querySelector('.containerOfSliders');
  if(slidersContainerHTML) {
    slidersContainerHTML.classList.add("range_container");
    slidersContainerHTML.innerHTML = `
      <div class="sliders_control">
          <input class="slider" id="fromSlider" type="range" value="${range.minPrice}"  min="${min}" max="${max}"/>
          <input class="slider" id="toSlider" type="range" value="${range.maxPrice}"  min="${min}" max="${max}"/>
      </div>
    `
  }

  const fromSlider = document.querySelector<HTMLInputElement>('#fromSlider');
  const toSlider = document.querySelector<HTMLInputElement>('#toSlider');
  fromSlider?.addEventListener('change', e => {
    console.log((e.target as HTMLInputElement).value)
  })
  toSlider?.addEventListener('change', e => {
    console.log((e.target as HTMLInputElement).value)
  })
  // const fromInput = document.querySelector<HTMLInputElement>('#fromInput');
  // const toInput = document.querySelector<HTMLInputElement>('#toInput');
  // if(fromSlider && toSlider && fromInput && toInput) {
  //   fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  //   setToggleAccessible(toSlider);
  //   fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
  //   toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
  //   fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
  //   toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

  // }


}

