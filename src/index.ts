import "./style.scss";
import App from "./components/app/app";
import makeSomeSnow from "./utils/snow"

const app = new App();
app.start();
makeSomeSnow();


//  Добавляю консоль
console.log('Hello from Jenya!!!')
