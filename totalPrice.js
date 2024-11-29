export function calculateFinalTotalPrice(cart) {
    const now = new Date()
    let discountMessage = ""
    let finalTotalPrice = cart.totalPrice

    if(isNaN(finalTotalPrice)){
        finalTotalPrice = 0
    }

    const day = now.getDay()
    const hour = now.getHours()

    finalTotalPrice = cart.totalPrice

    if (day === 1 && hour < 10) { // Monday and before 10:00
        finalTotalPrice *= 0.9
        discountMessage = "Monday Discount: 10% off your order"
    } else if (  // Between Friday 15:00 -> Monday 10:00
        (day === 5 && hour >= 15) ||
        day === 6 ||
        (day === 0 && hour < 3) ||
        (day === 1 && hour < 3)
    ) {
        finalTotalPrice *= 1.15
        discountMessage = "";
    }

    return {
        finalTotalPrice: finalTotalPrice.toFixed(2), 
        discountMessage
    }
}

