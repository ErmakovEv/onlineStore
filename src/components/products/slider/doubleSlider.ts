import { ISearch } from "../../app/app";
import {controlFromInput, controlToInput, controlFromSlider, controlToSlider, getParsed, fillSlider, setToggleAccessible} from "./sliderFunction"


export default function renderSliders(state: ISearch) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const slidersContainerHTML = document.querySelector('.containerOfSliders')!;
  slidersContainerHTML.classList.add("range_container");
  slidersContainerHTML.innerHTML = `
    <div class="range_container">
    <div class="sliders_control">
        <input id="fromSlider" type="range" value="10" min="0" max="100"/>
        <input id="toSlider" type="range" value="40" min="0" max="100"/>
    </div>
    <div class="form_control">
        <div class="form_control_container">
            <div class="form_control_container__time">Min</div>
            <input class="form_control_container__time__input" type="number" id="fromInput" value="10" min="0" max="100"/>
        </div>
        <div class="form_control_container">
            <div class="form_control_container__time">Max</div>
            <input class="form_control_container__time__input" type="number" id="toInput" value="40" min="0" max="100"/>
        </div>
    </div>
  </div>
  `
  const fromSlider = document.querySelector<HTMLInputElement>('#fromSlider');
  const toSlider = document.querySelector<HTMLInputElement>('#toSlider');
  const fromInput = document.querySelector<HTMLInputElement>('#fromInput');
  const toInput = document.querySelector<HTMLInputElement>('#toInput');
  if(fromSlider && toSlider && fromInput && toInput) {
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);
    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
    fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
  }
  

}

