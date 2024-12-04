import products from "./src/data.js"
import { calculateFinalTotalPrice } from "./src/totalPrice.js"
import { showPaymentModal } from "./src/paymentModal.js"
import { setupCartIconToggle } from "./src/cart.js"
import { createDonutCards } from "./src/createCards.js"

const donutContainer = document.querySelector("#donut-container")

const cart = {
    totalQuantity: 0,
    totalPrice: 0,
    items: {}
}

export const refreshCartDetails = () => {
    const cartDonutValue = document.querySelector(".cart-donut-value")
    const cartDropdown = document.querySelector(".cart-dropdown")

    const cartItemsList = cartDropdown.querySelector(".cart-items")
    const cartTotalValue = cartDropdown.querySelector(".cart-total-value")

    cartDonutValue.innerHTML = cart.totalQuantity
    cartItemsList.innerHTML = ""
    let totalPrice = 0

    Object.values(cart.items).forEach(item => {
        if (item.quantity > 0) {
            let itemTotalPrice = item.price * item.quantity

            if (item.quantity >= 10) {
                itemTotalPrice *= 0.9
            }

            totalPrice += itemTotalPrice

            const li = document.createElement("li")
            li.setAttribute("tabindex", "0")
            li.innerHTML = `
            <span>${item.title} x ${item.quantity}</span>
            <span>${itemTotalPrice.toFixed(2)}.-</span>
            `
            cartItemsList.appendChild(li)
        }
    })

    cartItemsList.addEventListener("keydown", (event) => {
        const focusableItems = Array.from(cartItemsList.querySelectorAll("li"))
        const currentIndex = focusableItems.indexOf(document.activeElement)

        if (event.key === "ArrowDown" && currentIndex < focusableItems.length - 1) {
            focusableItems[currentIndex + 1].focus()
            event.preventDefault()
        } else if (event.key === "ArrowUp" && currentIndex > 0) {
            focusableItems[currentIndex - 1].focus()
            event.preventDefault()
        }
    })

    cart.totalPrice = totalPrice
    cartTotalValue.innerHTML = cart.totalPrice.toFixed(2)
    cartDonutValue.innerHTML = cart.totalQuantity

}

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