import {createDonutCards} from "./createCards.js"
import { refreshCartDetails } from "../app.js"
import products from "./data.js"

export function showPaymentModal(donutContainer, cart,finalTotalPrice,discountMessage) {
    const paymentContent = document.querySelector(".payment-modal-container")
    const paymentModal = document.querySelector(".payment-modal")

    paymentContent.innerHTML = ""

    const title = document.createElement("h2")
    title.textContent = "Order Summary"
    paymentContent.appendChild(title)

    const itemList = document.createElement("ul")
    itemList.style.listStyle = "none"
    itemList.style.padding = "0"

    Object.values(cart.items).forEach(item => {
        if (item.quantity > 0) {
            const listItem = document.createElement("li")
            listItem.textContent = `${item.title} x ${item.quantity} - ${item.price * item.quantity}.-`
            itemList.appendChild(listItem)
        }
    })

    paymentContent.appendChild(itemList)

    const totalPrice = document.createElement("p")
    totalPrice.textContent = `Total price ${finalTotalPrice}.-`
    totalPrice.style.fontWeight = "bold"
    paymentContent.appendChild(totalPrice)

    const paymentOptions = document.createElement("div")
    paymentOptions.innerHTML = `
    <h3>Select Payment Method</h3>
    <label>
        <input type="radio" name="payment-method" value="Credit Card" tabindex="0">
        Credit Card
    </label>
    <label>
        <input type="radio" name="payment-method" value="Invoice" tabindex="0">
        Invoice
    </label>    
    `
    paymentContent.appendChild(paymentOptions)

    const paymentDetailsContainer = document.createElement("div")
    paymentDetailsContainer.className = "payment-details"
    paymentContent.appendChild(paymentDetailsContainer)

    paymentOptions.addEventListener("click", (event) => {
        const selectedMethod = event.target.value
        paymentDetailsContainer.innerHTML = ""

        if (selectedMethod === "Credit Card") {
            const cardNUmberInput = document.createElement("input")
            cardNUmberInput.type = "text"
            cardNUmberInput.placeholder = "Card Number"
            cardNUmberInput.required = true

            const cardExpiryInput = document.createElement("input")
            cardExpiryInput.type = "text"
            cardExpiryInput.placeholder = "Expiry Date (MM/YY)"
            cardExpiryInput.required = true

            const cardCvcInput = document.createElement("input")
            cardCvcInput.type = "text"
            cardCvcInput.placeholder = "CVC"
            cardCvcInput.required = true

            paymentDetailsContainer.appendChild(cardNUmberInput)
            paymentDetailsContainer.appendChild(cardExpiryInput)
            paymentDetailsContainer.appendChild(cardCvcInput)
        } else if (selectedMethod === "Invoice") {
            const ssnInput = document.createElement("input")
            ssnInput.type = "text"
            ssnInput.placeholder = "Social Security Number"
            ssnInput.required = true

            paymentDetailsContainer.appendChild(ssnInput)
        }
    })

    const closeButton = document.createElement("button")
    closeButton.textContent = "Close"
    closeButton.addEventListener("click", () => {
        paymentModal.classList.add("hidden")
    })
    paymentContent.appendChild(closeButton)

    const deleteCartItemsButton = document.createElement("button")
    deleteCartItemsButton.textContent = "Delete order"
    deleteCartItemsButton.addEventListener("click", () => {
        cart.totalQuantity = 0
        cart.totalPrice = 0
        cart.items = {}

        refreshCartDetails(cart, cartDonutValue,cartDropdown)
        createDonutCards(donutContainer,products,cart,refreshCartDetails)
        paymentModal.classList.add("hidden")

    })
    paymentContent.appendChild(deleteCartItemsButton);

    const confirmButton = document.createElement("button")
    confirmButton.textContent = "Confirm Payment"
    confirmButton.addEventListener("click", () => {
        const selectMethod = document.querySelector(`input[name="payment-method"]:checked`)

        if (selectMethod) {
            const selectedMethodValue = selectMethod.value

            if (selectedMethodValue === "Invoice" && finalTotalPrice > 800) {
                alert("You can not pay with Invoice for orders above 800.-")
                return
            }

            if (selectedMethodValue === "Credit Card") {
                const cardNumber = paymentDetailsContainer.querySelector("input[placeholder='Card Number']").value
                const cardExpiry = paymentDetailsContainer.querySelector("input[placeholder='Expiry Date (MM/YY)']").value
                const cardCvc = paymentDetailsContainer.querySelector("input[placeholder='CVC'").value

                if (!cardNumber || !cardExpiry || !cardCvc) {
                    alert("please fill in card details!")
                    return
                }
            } else if (selectedMethodValue === "Invoice") {
                const ssn = paymentDetailsContainer.querySelector("input[placeholder='Social Security Number']").value

                if (!ssn) {
                    alert("Please enter your Social Security Number")
                    return
                }
            }

            let cartSummary = "Order Summary:\n"
            Object.values(cart.items).forEach(item => {
                if (item.quantity > 0) {
                    cartSummary += `-${item.title} x ${item.quantity} = ${item.price * item.quantity}.-\n`
                }
            })

            cartSummary += `\nTotal: ${finalTotalPrice}.-`

            alert(`${discountMessage}\n\nThank you for your order\n\n${cartSummary}\n\nYour gottis will arrive in 2-4h.`)
            cart.totalPrice = 0
            cart.totalQuantity = 0
            cart.items = {}

            refreshCartDetails()
            createDonutCards(donutContainer,products,cart,refreshCartDetails)
            paymentModal.classList.add("hidden")
        } else {
            alert("Please select payment method")
        }
    })

    document.addEventListener("keydown", (event) => {
        if(event.key === "Escape" && !paymentModal.classList.contains("hidden")){
            paymentModal.classList.add("hidden")
            closeButton.focus()
        }
    })

    paymentContent.appendChild(confirmButton)

    createDonutCards(donutContainer, products, cart)
    paymentModal.classList.remove("hidden")
}