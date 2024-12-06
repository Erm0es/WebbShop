import products from "./src/data.js"
import { calculateFinalTotalPrice } from "./src/totalPrice.js"
import { showPaymentModal } from "./src/paymentModal.js"
import { setupCartIconToggle, refreshCartDetails, cart } from "./src/cart.js"
import { createDonutCards } from "./src/createCards.js"

const donutContainer = document.querySelector("#donut-container")


createDonutCards(donutContainer, products, cart)

function setupOrderButton() {
    const orderButton = document.querySelector(".order-button")

    orderButton.addEventListener("click", () => {
        const { finalTotalPrice, discountMessage } = calculateFinalTotalPrice(cart)
        showPaymentModal(donutContainer, cart, finalTotalPrice, discountMessage)
    })
}
//NAME
function donutCriteriaSort() {
    const sortCriteriaDropdown = document.querySelector(".sort-criteria")
    const sortButton = document.querySelector(".sort-button")

    sortButton.addEventListener("click", () => {
        let criteria = sortCriteriaDropdown.value
        if (criteria === "price") {
            products.sort((a, b) => a.price - b.price)
        } else if (criteria === "rating") {
            products.sort((a, b) => b.rating - a.rating)
        } else if (criteria === "category") {
            products.sort((a, b) => a.category.localeCompare(b.category))
        } else if(criteria === "title"){
            products.sort((a,b) => a.title.localeCompare(b.title))

        } else {
            console.error("somethings wrong")
        }

        createDonutCards(donutContainer, products, cart, refreshCartDetails)
    })
}

setupCartIconToggle()
donutCriteriaSort()
createDonutCards(donutContainer, products, cart, refreshCartDetails)
setupOrderButton()