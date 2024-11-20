import products from "./data.js"

const donutCardTemplate = document.querySelector(".donut-card").content
const donutContainer = document.querySelector("#donut-container")

function createDonutCards() {
    if (!donutCardTemplate) {
        console.error("template not found: .donut-card");
        return;
    }
    if (!donutContainer) {
        console.error("Container not found: #donut-container")
    }

    products.forEach(product => {
        //clone donut card template
        let newCard = donutCardTemplate.cloneNode(true)

        const imageUrl = product.image?.url || "";
        const imageAlt = product.image?.alt || "Donut image"

        //Insert newCard data with product data
        newCard.querySelector(".donut-image").src = imageUrl
        newCard.querySelector(".donut-image").alt = imageAlt
        newCard.querySelector(".donut-title").textContent = product.title
        newCard.querySelector(".donut-price").textContent = `${product.price} .-`
        newCard.querySelector(".donut-rating-value").textContent = product.rating

        //Insert newCard to donutContainer
        donutContainer.appendChild(newCard)
    })
}
createDonutCards()

const subBtn = document.querySelector(".subtract-button")
const addBtn = document.querySelector(".add-button")
let input = document.querySelector("#quantity")

addBtn.addEventListener("click", function(){
    console.log("add")
    input.value = "add"
})

subBtn.addEventListener("click", function(){
    console.log("sub")
    input.value = "sub"

})