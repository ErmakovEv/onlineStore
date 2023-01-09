export default function snowSwitch() {
        let flag = true;
        const btnSnow = document.querySelector<HTMLDivElement>(".btnSnow");
        btnSnow!.addEventListener('click', () => {
        if(flag) {
            makeSomeSnow();
            flag = false;
        } else {
            flag = true;
            snowOff();
        }
    })
}


function makeSomeSnow() {
    const body = document.body;
    const snowContainer = document.createElement('div');
    snowContainer.classList.add('snow-container');
    for (let i = 0; i < 50; i++) {
        const snowDiv = document.createElement('div');
        snowDiv.classList.add('snowflake');
        snowContainer.append(snowDiv);
    }
    body.append(snowContainer);
}

function snowOff() {
    const snowContainer = document.querySelector<HTMLDivElement>('.snow-container')
    snowContainer!.remove();
}