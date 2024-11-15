import products from "./data.js"

function createCards() {
    const donutCard = document.querySelector(".donut-card")
    for (let i = 0; i < products.length; i++) {
        const array = [];
        let newCard = donutCard.cloneNode(true);
        donutCard.after(newCard);
        array.push(newCard);
    }
}
createCards()

products.forEach(async (e) => {
    console.log(e)

    document.getElementById("title").innerHTML = `${e.title}`
});        