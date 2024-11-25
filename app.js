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

function showPaymentModal(){
    const orderButton = document.querySelector(".order-button")
    const paymentModal = document.querySelector(".payment-modal")
    const closeModal = document.querySelector(".close-modal")
    const confirmPayment = document.querySelector(".confirm-payment")
    
    orderButton.addEventListener("click", () => {
       paymentModal.classList.remove("hidden")
    })

    closeModal.addEventListener("click", () => {
        paymentModal.classList.add("hidden")
    })

    confirmPayment.addEventListener("click", () => {
        const selectedPaymentMethod = document.querySelector (
            `input[name="payment-method"]:checked`
        )

        if(selectedPaymentMethod){
           alert(`Payment confirmed with: ${selectedPaymentMethod.value}`)
           // reset the cart 
           cart.totalQuantity = 0
           cart.totalPrice = 0
           cart.items = {}
           updateCartDisplay()
           paymentModal.classList.add("hidden")
        }else {
            alert("Please select a payment method")
        }
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
showPaymentModal()
