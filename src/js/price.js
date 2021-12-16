export default (price, normalizeNumber) => {
    if (price === null || price === "") {
        return price
    }
    let arrPrice = []
    for (var i = 0; i < price.length; i++) {
        arrPrice.push(price[i])
    }
    let res = ""
    price = []
    if (normalizeNumber === false || normalizeNumber == undefined) {
        arrPrice = arrPrice.reverse()
        let loop = 0

        arrPrice.forEach((element) => {
            if (loop === 3) {
                price.push(".")
                loop = 0
            }
            price.push(element)
            loop++
        })
        price.reverse()
        price.forEach((element) => {
            res += element.toString()
        })
        return res
    } else if (normalizeNumber === true) {
        arrPrice.forEach((element) => {
            if (element != ".") {
                price.push(element)
            }
        })
        price.forEach((element) => {
            res += element.toString()
        })
        return Number(res)
            // return res
    }
}