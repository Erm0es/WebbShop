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

        //Buttons and input(inside cloned newCard)
        const subBtn = newCard.querySelector(".subtract-button")
        const addBtn = newCard.querySelector(".add-button")
        const input = newCard.querySelector("#quantity")
        const cartDonutValue = document.querySelector(".cart-donut-value")

        //change input and cart value
        addBtn.addEventListener("click", () => {
            let currentValue = parseInt(input.value)
            input.value = currentValue + 1
            cartDonutValue.innerHTML = currentValue +1
        })
        subBtn.addEventListener("click", () => {
            let currentValue = parseInt(input.value)
            if (currentValue === 0) {
                input.value = 0;
            } else {
                input.value = currentValue - 1
                cartDonutValue.innerHTML = currentValue -1
            }
        })
        //Insert newCard to donutContainer
        donutContainer.appendChild(newCard)
    })
}
createDonutCards()

function donutCriteriaSort() {
    const sortCriteriaDropdown = document.querySelector(".sort-criteria")
    const sortButton = document.querySelector(".sort-button")

    sortButton.addEventListener("click", () => {
        let criteria = sortCriteriaDropdown.value
        if (criteria === "price") {
            products.sort((a,b) => a.price - b.price)
        } else if (criteria === "rating") {
            products.sort((a,b) => b.rating - a.rating)
        } else if (criteria === "category") {
            products.sort((a,b) => a.category.localeCompare(b.category))
        } else {
            console.error("somethings wrong")
        }

        donutContainer.innerHTML = ""
        createDonutCards()
    })
}
donutCriteriaSort()



function cart(){

}
