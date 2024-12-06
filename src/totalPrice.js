//Function t ocalcualte final total price of the cart, including discounts, shipping and surcharges
export function calculateFinalTotalPrice(cart) {
    const now = new Date()

    let discountMessage = ""
    let finalTotalPrice = cart.totalPrice
    let shippingFee = 0
    
    //Define base shipping fee and get total number of donuts in cart
    const baseShippingFee = 25
    const totalDonuts = cart.totalQuantity
    
    //Error handling if price is not a number, default 0
    if (isNaN(finalTotalPrice)) {
        finalTotalPrice = 0
    }
    
    //Calculate shipping fee, free shipping if order has more than 15 donuts
    if (totalDonuts > 15) {
        shippingFee = 0
        discountMessage = "Free shipping for ordering more than 15 donuts.\n"
    } else {
        //Shipping fee is base fee + 10% of the total price 
        shippingFee = baseShippingFee + cart.totalPrice * 0.1
    }
    //Add to final total price 
    finalTotalPrice += shippingFee
    
    //Detemine current day and hour for discounts and surcharges
    const day = now.getDay()
    const hour = now.getHours()
    
    //Apply 10% discount for orders placed Monady before 10:00
    if (day === 1 && hour < 10) { 
        finalTotalPrice *= 0.9
        discountMessage = "Monday Discount: 10% off your order"
    }
    //Apply a 15% surcharge for orders placed between Friday 03:00 and Monday 03:00
    else if ( 
        (day === 5 && hour >= 15) ||
        day === 6 ||
        (day === 0 && hour < 3) ||
        (day === 1 && hour < 3)
    ) {
        finalTotalPrice *= 1.15
        discountMessage = "";
    }
    
    //Return the total price(rounded to two decimal places) and discound message
    return {
        finalTotalPrice: finalTotalPrice.toFixed(2),
        discountMessage
    }
}