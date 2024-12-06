import { calculateFinalTotalPrice } from "./totalPrice.js"
import { showPaymentModal } from "./paymentModal.js"
import { cart } from "./cart.js"
import {donutContainer} from "../app.js"

export function setupOrderButton() {
    const orderButton = document.querySelector(".order-button")

    orderButton.addEventListener("click", () => {
        const { finalTotalPrice, discountMessage } = calculateFinalTotalPrice(cart)
        showPaymentModal(donutContainer, cart, finalTotalPrice, discountMessage)
    })
}