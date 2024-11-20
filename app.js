import products from "./data.js"

const donutCardTemplate = document.querySelector(".donut-card").content
const donutContainer = document.querySelector("#donut-container")

const sortCriteriaDropdown = document.querySelector(".sort-criteria")
const sortButton = document.querySelector(".sort-button")

sortButton.addEventListener("click", () => {
    let criteria = sortCriteriaDropdown.value
    console.log(criteria)
})

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

function donutQuantity() {
    const subBtn = document.querySelector(".subtract-button")
    const addBtn = document.querySelector(".add-button")
    const input = document.querySelector("#quantity")

    addBtn.addEventListener("click", () => {
        let currentValue = parseInt(input.value)
        input.value = currentValue + 1
    })

    subBtn.addEventListener("click", () => {
        let currentValue = parseInt(input.value)
        if (currentValue === 0) {
            input.value = 0;
        } else {
            input.value = currentValue - 1
        }
    })

}
donutQuantity()