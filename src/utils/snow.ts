export default function makeSomeSnow() {
    const body = document.body;
    for (let i = 0; i < 50; i++) {
        const snowDiv = document.createElement('div');
        snowDiv.classList.add('snowflake');
        body.append(snowDiv);
    }
}