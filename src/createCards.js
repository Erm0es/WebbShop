

const donutCardTemplate = document.querySelector(".donut-card").content

export function createDonutCards(donutContainer, products, cart, refreshCartDetails) {
    donutContainer.innerHTML = ""

    products.forEach(product => {
        if (!cart.items[product.id]) {
            cart.items[product.id] = { ...product, quantity: 0 };
        }

        let newCard = donutCardTemplate.cloneNode(true)

        const imageUrl = product.image?.url || "";
        const imageAlt = product.image?.alt || "Donut image"

        newCard.querySelector(".donut-image").src = imageUrl
        newCard.querySelector(".donut-image").alt = imageAlt
        newCard.querySelector(".donut-title").textContent = product.title
        newCard.querySelector(".donut-price").textContent = `${product.price} .-`
        newCard.querySelector(".donut-rating-value").textContent = product.rating

        const subBtn = newCard.querySelector(".subtract-button")
        const addBtn = newCard.querySelector(".add-button")
        const input = newCard.querySelector("#quantity")

        input.value = cart.items[product.id].quantity

        addBtn.addEventListener("click", () => {
            cart.items[product.id].quantity++
            cart.totalQuantity++
            cart.totalPrice += product.price

            input.value = cart.items[product.id].quantity
            refreshCartDetails()
        })

        subBtn.addEventListener("click", () => {
            if (cart.items[product.id].quantity > 0) {
                cart.items[product.id].quantity--
                cart.totalQuantity--
                cart.totalPrice -= product.price

                input.value = cart.items[product.id].quantity
                refreshCartDetails()
            }
        })

        donutContainer.appendChild(newCard)
    })
}