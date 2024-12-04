export function setupCartIconToggle() {
    const cartIcon = document.querySelector(".cart-icon")
    const cartDropdown = document.querySelector(".cart-dropdown")

    const firstFocusableElemet = cartDropdown.querySelector(".cart-item li") || cartDropdown

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

    cartIcon.addEventListener("click", () => {
        toggleCartDropdown()
    })

    cartIcon.addEventListener("keydown", (event) => {
        if(event.key === "Enter"){
            event.preventDefault()
            event.stopPropagation()
            toggleCartDropdown()
        }
    })

    document.addEventListener("keydown", (event) => {
        if(event.key === "Escape" && !cartDropdown.classList.contains("hidden")){
            cartDropdown.classList.add("hidden")
            cartIcon.setAttribute("aria-expanded", false)
            cartIcon.focus()
        }
    })
}