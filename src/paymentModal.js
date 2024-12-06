import { createFormFields, createPaymentOptions, createCloseButton, createDeleteButton, createConfirmButton, showErrorPopup, validateFormFields } from "./paymentUtils.js"
import { createDonutCards } from "./createCards.js"
import products from "./data.js"

/*---------------------------------------------------------------------------------------------------------------------
-------------------------------------Function to display and create the payment modal----------------------------------
----------------------------------------------------------------------------------------------------------------------*/

export function showPaymentModal(donutContainer, cart, finalTotalPrice, discountMessage, cartDonutValue, cartDropdown) {
    const paymentContent = document.querySelector(".payment-modal-container")
    const paymentModal = document.querySelector(".payment-modal")

    //Clear any existing content in the modal
    paymentContent.innerHTML = ""

    //Add modal title
    const title = document.createElement("h2")
    title.textContent = "Order Summary"
    paymentContent.appendChild(title)

    //create form fields dynamically
    const formFields = createFormFields(paymentContent)

    //Create payment options dynamically
    const paymentOptions = createPaymentOptions(paymentContent)

    //Container fpr payment-specific inputs
    const paymentDetailsContainer = document.createElement("div")
    paymentDetailsContainer.className = "payment-details"
    paymentContent.appendChild(paymentDetailsContainer)

    //Event listener to display additional inputs
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





    // //Vaidate ssn
    // function validateSSN(ssn) {
    //     const ssnRegex = /^\d{10}$/; 
    // 
    //     if (!ssnRegex.test(ssn)) {
    //         showErrorPopup("Please enter a valid Social Security Number (10 digits).");
    //         return false;
    //     }
    //     return true;
    // }

    //Display cart item list
    const itemList = document.createElement("ul")
    itemList.style.listStyle = "none"
    itemList.style.padding = "0"

    //Loop through cart items and add to list
    Object.values(cart.items).forEach(item => {
        if (item.quantity > 0) {
            const listItem = document.createElement("li")
            listItem.textContent = `${item.title} x ${item.quantity} - ${item.price * item.quantity}.-`
            itemList.appendChild(listItem)
        }
    })

    paymentContent.appendChild(itemList)

    //Display total price
    const totalPrice = document.createElement("p")
    totalPrice.textContent = `Total price ${finalTotalPrice}.-`
    totalPrice.style.fontWeight = "bold"
    paymentContent.appendChild(totalPrice)

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !paymentModal.classList.contains("hidden")) {
            paymentModal.classList.add("hidden")
            closeButton.focus()
        }
    })
    

    const closeButton = createCloseButton(paymentModal)
    const deleteCartItemsButton = createDeleteButton(cart, donutContainer, cartDonutValue, cartDropdown, paymentModal, paymentContent) 
    const confirmButton = createConfirmButton(paymentContent, formFields, paymentDetailsContainer, cart, finalTotalPrice, discountMessage, closeButton)
    createDonutCards(donutContainer, products, cart)

    //Make modal visible
    paymentModal.classList.remove("hidden")
}
