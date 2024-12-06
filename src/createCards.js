export const donutContainer = document.querySelector("#donut-container")
const donutCardTemplate = document.querySelector(".donut-card").content

//Function to create and dispaly donut cards based on product data
export function createDonutCards(donutContainer, products, cart, refreshCartDetails) {
    donutContainer.innerHTML = ""
    
    //Iterate over the list of products to create a card for each one
    products.forEach(product => {
        if (!cart.items[product.id]) {
            cart.items[product.id] = { ...product, quantity: 0 };
        }

        let newCard = donutCardTemplate.cloneNode(true)

        //Set img for card
        const imageUrl = product.image?.url || "";
        const imageAlt = product.image?.alt || "Donut image"
        newCard.querySelector(".donut-image").src = imageUrl
        newCard.querySelector(".donut-image").alt = imageAlt

        //Set product title, price and rating
        newCard.querySelector(".donut-title").textContent = product.title
        newCard.querySelector(".donut-price").textContent = `${product.price} .-`
        newCard.querySelector(".donut-rating-value").textContent = product.rating
        
        //References to the quantity input, and add/subtract buttons
        const subBtn = newCard.querySelector(".subtract-button")
        const addBtn = newCard.querySelector(".add-button")
        const input = newCard.querySelector("#quantity")
        
        //Initialize the quantity input with the current quantity in the cart
        input.value = cart.items[product.id].quantity
        
        //Eventlisteners for add and subtract button
        addBtn.addEventListener("click", () => {
            cart.items[product.id].quantity++
            cart.totalQuantity++
            cart.totalPrice += product.price

            input.value = cart.items[product.id].quantity
            refreshCartDetails(cart)
        })

        subBtn.addEventListener("click", () => {
            if (cart.items[product.id].quantity > 0) {
                cart.items[product.id].quantity--
                cart.totalQuantity--
                cart.totalPrice -= product.price

                input.value = cart.items[product.id].quantity
                refreshCartDetails(cart)
            }
        })

       //Append newly created card to the container 
        donutContainer.appendChild(newCard)
    })
}