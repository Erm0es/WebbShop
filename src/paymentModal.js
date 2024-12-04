import { createDonutCards } from "./createCards.js"
import { refreshCartDetails } from "../app.js"
import products from "./data.js"


//Function to validate input fields
const validateFormFields = (fields, confirmButton) => {
    let formIsValid = true

    //Clear any previous error messages
    const errorMessages = document.querySelectorAll(".error-message")
    errorMessages.forEach((message) => message.remove())

    //Loop through each field and check if valid
    fields.forEach(field => {
        const errorMessage = document.createElement("span")
        errorMessage.classList.add("error-message")
        errorMessage.style.color = "red"

        if (!field.input.value.trim() || field.input.value === field.input.defaultValue) {
            formIsValid = false
            errorMessage.textContent = `Please fill in ${field.name}`
            field.input.after(errorMessage)
            field.input.focus()
        }
    })

    //Enable/Disable button
    confirmButton.disabled = !formIsValid

    return formIsValid
}


//Function to display the payment modal
export function showPaymentModal(donutContainer, cart, finalTotalPrice, discountMessage, cartDonutValue, cartDropdown) {
    const paymentContent = document.querySelector(".payment-modal-container")
    const paymentModal = document.querySelector(".payment-modal")

    //Clear any existing content in the modal
    paymentContent.innerHTML = ""

    //Add modal title
    const title = document.createElement("h2")
    title.textContent = "Order Summary"
    paymentContent.appendChild(title)

    //Create and append input fields for user details
    const firstName = document.createElement("input")
    firstName.placeholder = "First Name"
    paymentContent.appendChild(firstName)

    const lastName = document.createElement("input")
    lastName.placeholder = "Last Name"
    paymentContent.appendChild(lastName)

    const address = document.createElement("input")
    address.placeholder = "Adress"
    paymentContent.appendChild(address)

    const zipCode = document.createElement("input")
    zipCode.placeholder = "ZIP Code"
    paymentContent.appendChild(zipCode)

    const locality = document.createElement("input")
    locality.placeholder = "Locality"
    paymentContent.appendChild(locality)

    const portCode = document.createElement("input")
    portCode.placeholder = "Port Code"
    paymentContent.appendChild(portCode)

    const phoneNumber = document.createElement("input")
    phoneNumber.placeholder = "Phone Number"
    paymentContent.appendChild(phoneNumber)

    const email = document.createElement("input")
    email.placeholder = "Email"
    paymentContent.appendChild(email)

    //Define requested fields
    const requiredFields = [
        { input: firstName, name: "First Name" },
        { input: lastName, name: "Last Name" },
        { input: address, name: "Adress" },
        { input: zipCode, name: "ZIP Code" },
        { input: locality, name: "Locality" },
        { input: phoneNumber, name: "Phone Number" },
        { input: email, name: "Email" },
    ]

    //Add event listers to trigger validation
    requiredFields.forEach(field => {
        field.input.addEventListener("input", () => {
            validateFormFields(requiredFields, confirmButton)

        })
    })

    //Vaidate ssn
    function validateSSN(ssn) {
        const ssnRegex = /^\d{10}$/; 
    
        if (!ssnRegex.test(ssn)) {
            alert("Please enter a valid Social Security Number (10 digits).");
            return false;
        }
        return true;
    }

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

    //Add payment options
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

    //Container for payment specific inputs
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

    //Add a close button to hide modal
    const closeButton = document.createElement("button")
    closeButton.textContent = "Close"
    closeButton.addEventListener("click", () => {
        paymentModal.classList.add("hidden")
    })
    paymentContent.appendChild(closeButton)

    //Add delete cart button
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
    paymentContent.appendChild(deleteCartItemsButton);

    //Add confirm payment button
    const confirmButton = document.createElement("button")
    confirmButton.textContent = "Confirm Payment"
    confirmButton.disabled = true;
    paymentContent.appendChild(confirmButton)

    confirmButton.addEventListener("click", () => {
        if (!validateFormFields(requiredFields, confirmButton)) {
            return
        }

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
                if (!validateSSN(ssn)) {
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
            createDonutCards(donutContainer, products, cart, refreshCartDetails)
            paymentModal.classList.add("hidden")
        } else {
            alert("Please select payment method")
        }

    })

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !paymentModal.classList.contains("hidden")) {
            paymentModal.classList.add("hidden")
            closeButton.focus()
        }
    })

    createDonutCards(donutContainer, products, cart)

    //Make modal visible
    paymentModal.classList.remove("hidden")
}