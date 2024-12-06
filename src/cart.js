export const cart = {
    totalQuantity: 0,
    totalPrice: 0,
    items: {}
}

export function setupCartIconToggle() {
    //Get reference to the cart icon and dropdown menu
    const cartIcon = document.querySelector(".cart-icon")
    const cartDropdown = document.querySelector(".cart-dropdown")

    //Identify the first focusable element inside the dropdown, if no specific items exists, fallback to focusing on the dropdown itself
    const firstFocusableElemet = cartDropdown.querySelector(".cart-item li") || cartDropdown
    
    //Function to toggle the visibility of the cart dropdown
    function toggleCartDropdown() {
        const isHidden = cartDropdown.classList.contains("hidden")
        cartDropdown.classList.toggle("hidden")

        cartIcon.setAttribute("aria-expanded", !isHidden)

        if(!isHidden){
            firstFocusableElemet.focus()
        }else{
            cartIcon.focus()
        }   
    }

    //Attach event listener to toggle the dropdown on cart icon click
    cartIcon.addEventListener("click", () => {
        toggleCartDropdown()
    })
    
    //Handle keyboard interactions for accessibility
    cartIcon.addEventListener("keydown", (event) => {
        if(event.key === "Enter"){
            event.preventDefault()
            event.stopPropagation()
            toggleCartDropdown()
        }
    })
    
    //Handle closing the dropdown when pressing the "Esc" key
    document.addEventListener("keydown", (event) => {
        if(event.key === "Escape" && !cartDropdown.classList.contains("hidden")){
            cartDropdown.classList.add("hidden")
            cartIcon.setAttribute("aria-expanded", false)
            cartIcon.focus()
        }
    })
}

/*-----------------------------------------------------------------------------------------------------------------------
-----------------------Function for updating the UI to reflect current state of shopping cart----------------------------
-----------------------------------------------------------------------------------------------------------------------*/

export function refreshCartDetails (cart){
    //Select DOM elements for updating cart details
    const cartDonutValue = document.querySelector(".cart-donut-value")
    const cartDropdown = document.querySelector(".cart-dropdown")
    const cartItemsList = cartDropdown.querySelector(".cart-items")
    const cartTotalValue = cartDropdown.querySelector(".cart-total-value")
    
    //Update total quantity in cart icon, clear current list of cart items, Initialize variable to calculate total price
    cartDonutValue.innerHTML = cart.totalQuantity
    cartItemsList.innerHTML = ""
    let totalPrice = 0
    
    //Loop through each item in the cart
    Object.values(cart.items).forEach(item => {
        if (item.quantity > 0) {
            let itemTotalPrice = item.price * item.quantity
            
            //Apply discount if the quantity is 10 or more 
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
    
    //Enable keyboard nav for cart items
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
    
    //Update total price in cart obj and UI, ensure total quantity in the cart is accurate
    cart.totalPrice = totalPrice
    cartTotalValue.innerHTML = cart.totalPrice.toFixed(2)
    cartDonutValue.innerHTML = cart.totalQuantity
}