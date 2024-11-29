import products from "./data.js"

const donutCardTemplate = document.querySelector(".donut-card").content
let donutContainer = document.querySelector("#donut-container")

//tracks quantity per product id
const cart = {
    totalQuantity: 0,
    totalPrice: 0,
    items: {}
}

function updateCartDisplay() {
    const cartDonutValue = document.querySelector(".cart-donut-value")
    const cartDropdown = document.querySelector(".cart-dropdown")
    const cartItemsList = cartDropdown.querySelector(".cart-items")
    const cartTotalValue = cartDropdown.querySelector(".cart-total-value")

    //Updates cart icon quantity
    cartDonutValue.innerHTML = cart.totalQuantity

    //Clears dropdown list
    cartItemsList.innerHTML = ""

    //Updates dropdown items
    Object.values(cart.items).forEach(item => {
        if (item.quantity > 0) {
            const li = document.createElement("li")
            li.innerHTML = `
            <span>${item.title} x ${item.quantity}</span>
            <span>${item.price * item.quantity}.-</span>
            `
            cartItemsList.appendChild(li)
        }
    })

    //Update total price
    cartTotalValue.innerHTML = cart.totalPrice
}

function showPaymentModal() {
    const paymentContent = document.querySelector(".payment-modal-container")
    const paymentModal = document.querySelector(".payment-modal")

    paymentContent.innerHTML = ""

    //Add title
    const title = document.createElement("h2")
    title.textContent = "Order Summary"
    paymentContent.appendChild(title)

    //Display cart items
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
    totalPrice.textContent = `Total price ${cart.totalPrice}.-`
    totalPrice.style.fontWeight = "bold"
    paymentContent.appendChild(totalPrice)

    //Add payment options
    const paymentOptions = document.createElement("div")
    paymentOptions.innerHTML = `
    <h3>Select Payment Method</h3>
    <label>
        <input type="radio" name="payment-method" value="Credit Card">
        Credit Card
    </label>
    <label>
        <input type="radio" name="payment-method" value="Invoice">
        Invoice
    </label>    
    `
    paymentContent.appendChild(paymentOptions)

    //Add container for payment details
    const paymentDetailsContainer = document.createElement("div")
    paymentDetailsContainer.className = "payment-details"
    paymentContent.appendChild(paymentDetailsContainer)

    //Change payment method
    paymentOptions.addEventListener("change", (event) => {
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

    //Add close button
    const closeButton = document.createElement("button")
    closeButton.textContent = "Close"
    closeButton.addEventListener("click", () => {
        paymentModal.classList.add("hidden")
    })
    paymentContent.appendChild(closeButton)

    //Add delete cart items
    const deleteCartItemsButton = document.createElement("button")
    deleteCartItemsButton.textContent = "Delete order"
    deleteCartItemsButton.addEventListener("click", () => {
        cart.totalQuantity = 0
        cart.totalPrice = 0
        cart.items = {}

        updateCartDisplay()
        createDonutCards()
        paymentModal.classList.add("hidden")

    })
    paymentContent.appendChild(deleteCartItemsButton);


    //Add confirm payment button
    const confirmButton = document.createElement("button")
    confirmButton.textContent = "Confirm Payment"
    confirmButton.addEventListener("click", () => {
        const selectMethod = document.querySelector(`input[name="payment-method"]:checked`)

        if (selectMethod) {
            const selectedMethodValue = selectMethod.value

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
                if(item.quantity > 0){
                    cartSummary += `-${item.title} x ${item.quantity} = ${item.price * item.quantity}.-\n`
                }
            })

            cartSummary += `\nTotal: ${cart.totalPrice}.-`
            alert(`Thank you for your order\n\n${cartSummary}\n\nYour gottis will arrive in 2-4h.`)

            // Reset Cart
            cart.totalPrice = 0
            cart.totalQuantity = 0
            cart.items = {}
            updateCartDisplay ()
            createDonutCards()
            paymentModal.classList.add("hidden")
        } else {
            alert("Pleace select payment method")
        }
    })


    paymentContent.appendChild(confirmButton)
    paymentModal.classList.remove("hidden")
}

function setupOrderButton() {
    const orderButton = document.querySelector(".order-button")

    orderButton.addEventListener("click", () => {
        showPaymentModal()
    })
}


//Cart dropdown event
function setupCartIconToggle() {
    const cartIcon = document.querySelector(".cart-icon")
    if (cartIcon) {
        cartIcon.addEventListener("click", () => {
            const cartDropdown = document.querySelector(".cart-dropdown")
            cartDropdown.classList.toggle("hidden")
        })
    }
}

function createDonutCards() {
    donutContainer.innerHTML = ""
    products.forEach(product => {
        //cart item quantity 
        if (!cart.items[product.id]) {
            cart.items[product.id] = { ...product, quantity: 0 };
        }

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

        //Set input to current product quantity 
        input.value = cart.items[product.id].quantity

        //Add button click handler
        addBtn.addEventListener("click", () => {
            cart.items[product.id].quantity++
            cart.totalQuantity++
            cart.totalPrice += product.price

            input.value = cart.items[product.id].quantity
            updateCartDisplay()
        })

        //Subtract button click handler
        subBtn.addEventListener("click", () => {
            if (cart.items[product.id].quantity > 0) {
                cart.items[product.id].quantity--
                cart.totalQuantity--
                cart.totalPrice -= product.price

                input.value = cart.items[product.id].quantity
                updateCartDisplay()
            }
        })

        //Insert newCard to donutContainer
        donutContainer.appendChild(newCard)
    })
}


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

        createDonutCards()
    })
}

setupCartIconToggle()
donutCriteriaSort()
createDonutCards()
setupOrderButton()