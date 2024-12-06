import { createDonutCards } from "./createCards.js"
import {cart, refreshCartDetails} from "./cart.js"

export function donutCriteriaSort(products, donutContainer) {
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
        } else if(criteria === "title"){
            products.sort((a,b) => a.title.localeCompare(b.title))

        } else {
            console.error("somethings wrong")
        }

        createDonutCards(donutContainer, products, cart, refreshCartDetails)
    })
}