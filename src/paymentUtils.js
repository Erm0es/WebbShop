import { refreshCartDetails } from "./cart.js"
import { createDonutCards } from "./createCards.js"
import products from "./data.js"

/*-----------------------------------Utility to create form fields---------------------------------------------*/
export function createFormFields(paymentContent) {
    const requiredFields = []

    const placeholders = [
        { name: "First Name" },
        { name: "Last Name" },
        { name: "Adress" },
        { name: "ZIP Code" },
        { name: "Locality" },
        { name: "Door Code" },
        { name: "Phone Number" },
        { name: "Email" }
    ]

    placeholders.forEach(field => {
        const inputField = document.createElement("input")
        inputField.placeholder = field.name
        inputField.required = true;
        paymentContent.appendChild(inputField)
        requiredFields.push({ input: inputField, name: field.name })
    })
    return requiredFields
}


/*----------------------------------------Utility to create payment option----------------------------------------------------*/
export function createPaymentOptions(paymentContent) {
    const paymentOptions = document.createElement("div")
    paymentOptions.innerHTML = `
        <h3>Select Payment Method</h3>
        <label>
            <input type="radio" name="payment-method" value="Credit Card" tabindex="0">
            Credit Card
        </label>
        <label>
            <input type="radio" name="payment-method" value="Invoice">
            Invoice
        </label>    
    `
    paymentContent.appendChild(paymentOptions)
    return paymentOptions
}

/*-----------------------------Utility to create personal data and newsletter-------------------------*/
export function createOptions(paymentContent){
    const options = document.createElement("div")
    options.className = "radio-group"
    options.innerHTML = `
        <label>
            <input type="checkbox" name="personal-data" value="agree" required>
            Do you agree that we use your personal data?
        </label>
        <br>
        <label>
            <input type="checkbox" name="news-letter" value="subscribe" checked>
            Do you want to subscribe to our newsletter?
        </label>
    `
    paymentContent.appendChild(options)
    return options
}

/*------------------------------------------Utility to create close button----------------------------------------------------*/
export function createCloseButton(paymentModal) {
    const closeButton = document.createElement("button")
    closeButton.textContent = "Close"
    closeButton.addEventListener("click", () => {
        paymentModal.classList.add("hidden")
    })

    paymentModal.querySelector(".payment-modal-container").appendChild(closeButton)
    return closeButton
}

/*-----------------------------------------Utility to create delete button-----------------------------------------------------*/
export function createDeleteButton(cart, donutContainer, cartDonutValue, cartDropdown, paymentModal, paymentContent) {
    const deleteCartItemsButton = document.createElement("button")
    deleteCartItemsButton.textContent = "Delete order"

    deleteCartItemsButton.addEventListener("click", () => {
        //Reset cart details
        cart.totalQuantity = 0
        cart.totalPrice = 0
        cart.items = {}

        //Refresh cart and hide modal
        refreshCartDetails(cart, cartDonutValue, cartDropdown)
        createDonutCards(donutContainer, products, cart, refreshCartDetails)
        paymentModal.classList.add("hidden")
    })

    paymentContent.appendChild(deleteCartItemsButton)
    return deleteCartItemsButton
}

/*-----------------------------------------Utility to create confirm payment button-------------------------------------------*/
export function createConfirmButton(
    paymentContent,
    formFields,
    paymentDetailsContainer,
    cart,
    finalTotalPrice,
    discountMessage,
    donutContainer,
    products,
    paymentModal
) {
    const confirmButton = document.createElement("button")
    confirmButton.textContent = "Confirm Payment"
    confirmButton.disabled = true;


    formFields.forEach(field => {
        field.input.addEventListener("input", () => {
            validateFormFields(formFields, confirmButton)
        })
    })

    confirmButton.addEventListener("click", () => {
        if (!validateFormFields(formFields, confirmButton)) {
            return
        }

        const selectedMethod = document.querySelector(`input[name="payment-method"]:checked`)
        if (!selectedMethod) {
            showErrorPopup("Please select payment method")
            return
        }
        const selectedMethodValue = selectedMethod.value

        if (selectedMethodValue === "Invoice" && finalTotalPrice > 800) {
            showErrorPopup("You can't pay with Invoice for orders above 800.-")
            return
        }

        if (selectedMethodValue === "Credit Card") {
            const cardNumber = paymentDetailsContainer.querySelector("input[placeholder='Card Number']")?.value?.trim()
            const cardExpiry = paymentDetailsContainer.querySelector("input[placeholder='Expiry Date (MM/YY)']")?.value?.trim()
            const cardCvc = paymentDetailsContainer.querySelector("input[placeholder='CVC']")?.value?.trim()

            if (!cardNumber || !cardExpiry || !cardCvc) {
                showErrorPopup("please fill in card details!")
                return
            }

        } else if (selectedMethodValue === "Invoice") {
            const ssn = paymentDetailsContainer.querySelector("input[placeholder='Social Security Number']")?.value?.trim()

            function validateSSN(ssn) {
                const ssnRegex = /^\d{10}$/
                if (!ssnRegex.test(ssn)) {
                    showErrorPopup("Please enter a valid Social Security Number (10 digits).");
                    return false;
                }
                return true;
            }

            if (!ssn) {
                showErrorPopup("Please enter your Social Security Number")
                return
            }
            if (!validateSSN(ssn)) {
                return
            }
        }
        closeButton.focus()

        //process payment
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

        
        refreshCartDetails(cart)
        createDonutCards(donutContainer, products, cart, refreshCartDetails)
        paymentModal.classList.add("hidden")
    })

    paymentContent.appendChild(confirmButton)
    return confirmButton
}
/*-----------------------------------------------Utility to show error popup-------------------------------------------------*/
export function showErrorPopup(message) {
    const modalContainer = document.createElement("div")
    modalContainer.classList.add("error-popup-container")

    const modalContent = document.createElement("div")
    modalContent.classList.add("error-popup-content")

    const errorMessage = document.createElement("p")
    errorMessage.textContent = message
    modalContent.appendChild(errorMessage)

    const closeButtonError = document.createElement("button")
    closeButtonError.textContent = "OK"
    closeButtonError.classList.add("error-popup-close")

    closeButtonError.addEventListener("click", () => {
        modalContainer.remove()
    })

    modalContent.appendChild(closeButtonError)
    modalContainer.appendChild(modalContent)
    document.body.appendChild(modalContainer)
}

/*----------------------------------------------------------Utility to validate form fields--------------------------------*/
export function validateFormFields(requiredFields, confirmButton) {
    let formIsValid = true
    let firstInvalidField = null

    //Loop through each field and check if valid
    requiredFields.forEach(field => {
        const existingError = field.input.nextElementSibling
        if (existingError && existingError.classList.contains("error-message-field")) {
            existingError.remove()
        }

        const errorMessageField = document.createElement("span")
        errorMessageField.classList.add("error-message-field")
        errorMessageField.style.color = "red"

        if (!field.input.value.trim()) {
            formIsValid = false
            errorMessageField.textContent = `Please fill in ${field.name}`
            field.input.after(errorMessageField)

            if (!firstInvalidField) {
                firstInvalidField = field.input
            }
        }
    })

    if (firstInvalidField) {
        firstInvalidField.focus()
    }

    //Enable/Disable button
    confirmButton.disabled = !formIsValid
    console.log("form validity", formIsValid)
    return formIsValid
}
