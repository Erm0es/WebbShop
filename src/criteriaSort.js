import { createDonutCards } from "./createCards.js"
import {cart, refreshCartDetails} from "./cart.js"

//Function to sort the choosen criteria
export function donutCriteriaSort(products, donutContainer) {
    const sortCriteriaDropdown = document.querySelector(".sort-criteria")
    const sortButton = document.querySelector(".sort-button")
    
    //Add event listener to the sort button to trigger sorting when called
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

        //After sorting, update the displayed donut cards with the new order
        createDonutCards(donutContainer, products, cart, refreshCartDetails)
    })
}