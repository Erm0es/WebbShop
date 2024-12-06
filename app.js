import products from "./src/data.js"
import { setupCartIconToggle, refreshCartDetails, cart } from "./src/cart.js"
import { createDonutCards, donutContainer } from "./src/createCards.js"
import { donutCriteriaSort } from "./src/criteriaSort.js"
import { setupOrderButton } from "./src/orderButton.js"


setupCartIconToggle()
donutCriteriaSort(products, donutContainer)
createDonutCards(donutContainer, products, cart, refreshCartDetails)
setupOrderButton()