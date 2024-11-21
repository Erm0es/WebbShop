import products from "./data.js"

const donutCardTemplate = document.querySelector(".donut-card").content
const donutContainer = document.querySelector("#donut-container")
const cartDonutValue = document.querySelector(".cart-donut-value")

//tracks quantity per product id
const cart = {
    totalQuantity: 0,
    items: {}
}

function updateCartDisplay() {
    cartDonutValue.innerHTML = cart.totalQuantity
}

function createDonutCards() {
    if (!donutCardTemplate) {
        console.error("template not found: .donut-card");
        return;
    }
    if (!donutContainer) {
        console.error("Container not found: #donut-container")
    }

    products.forEach(product => {

        //cart item quantity
        if (!cart.items[product.id]) cart.items[product.id] = 0;

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
        input.value = cart.items[product.id]

        //Add button click handler
        addBtn.addEventListener("click", () => {
            cart.items[product.id]++
            cart.totalQuantity++
            input.value = cart.items[product.id]
            updateCartDisplay()
        })

        //Subtract button click handler
        subBtn.addEventListener("click", () => {
           if(cart.items[product.id] > 0){
            cart.items[product.id]--
            cart.totalQuantity--
            input.value = cart.items[product.id]
            updateCartDisplay()
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
            products.sort((a, b) => a.price - b.price)
        } else if (criteria === "rating") {
            products.sort((a, b) => b.rating - a.rating)
        } else if (criteria === "category") {
            products.sort((a, b) => a.category.localeCompare(b.category))
        } else {
            console.error("somethings wrong")
        }

        donutContainer.innerHTML = ""
        createDonutCards()
    })
}
donutCriteriaSort()
