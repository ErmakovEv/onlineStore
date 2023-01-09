import { IFilters} from "../app/app";
import products from "../db/shop.json"
import { IProduct } from "../products/renderProducts";
import locationResolver from "../app/router";


import "/src/scss/_popup.scss";
import "/src/scss/_base.scss";

export default function popUpLoader(filters: IFilters, app: HTMLDivElement,) {
    app.innerHTML=`
    <div class="popup">
        <div class="popup_content">
        <h2 class="form-name">Personal details</h2>
        <form class="popup-form personal_details" action="" novalidate >
            <div class="form__group">
                <input type="text" class="input input-name" name="name" placeholder="Name"  >
            </div>
            <div class="form__group">
                <input type="tel" class="input  input-phone" name="phone" placeholder="Phone" >
            </div>
            <div class="form__group">
                <input type="text" class="input input-adress " name="adress" placeholder="Delivery adress"  >
            </div>
            <div class="form__group">
                <input type="email" class="input input-email" name="email" placeholder="Email"  >
            </div>   
                 <h2 class="form-name">Card details</h2>
        <div class="bank-card">
            <!-- <form class="card-form"> -->
                <div class="card-firsline">
                    <div class="card-img">
                        <img class="card-img-logo" src="" alt="bank-logo">
                    </div>
                    <div class="card-number">
                        <input type="text" class="input  input-cardNumber" name="card-number" placeholder="Card number">
                    </div>
                </div>
               <div class="card-secondline">
                <div class="card-data">
                    <label>VALID:</label>
                    <input type="number" class="input  input-cartData" name="data" placeholder="Valid thru" required pattern="^\d{2}\/\d{2}$"  >
                </div>
                <div class="card-ccv">
                    <label>CCV:</label>
                    <input type="number" class="input  input-cardCvv" name="cvv" placeholder="CVV" >
                </div>
               </div>
            <!-- </form> -->
        </div>
        <div class="submit-btn">
        <a href="#/" class="ref submit-bnt" data-href="#/">
            <button class="btn" type="submit">
                CONFIRM
            </button>
        </a>
        </div>
    </div>                        
        </form>
   

    `
  submitToMain(filters);
}


function submitToMain(filters: IFilters) {
    const submitBtn = document.querySelector<HTMLLinkElement>(".submit-bnt");
    submitBtn!.addEventListener("click", () => {
        setTimeout(function(){
            filters = locationResolver(filters, String(submitBtn!.dataset.href))
}, 5 * 1000);
        console.log(submitBtn!.href);
        ;
    });
}