// send massage to parent window after prnting or cancel printing
window.onafterprint = () => {
    window.parent.postMessage("afterprint")
}

// function to get parameter from URL
getParameter = (parameterName) => {
    let parameters = new URLSearchParams(window.location.search)
    return parameters.get(parameterName) // Returns null if the query string is empty or the parameter is not found.
}

// variable
let transactionId = getParameter("id"),
    fetch_url = `http://localhost:7070/transaction/${transactionId}`,
    tBody = document.querySelector("tbody")

// qrcode
let qrcode = new QRCode(document.getElementById("qrcode"), {
    text: this.getParameter("id"),
    width: 150,
    height: 150,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
})

// fill blank p tag below barcode with transaction id
document.querySelector("#transactionId p").innerHTML = transactionId

// function to give point(.) in price
// example turn 17000 into 17.000
price = (price) => {
    if (price === null || price === "") {
        return price
    }
    let arrPrice = String(price).match(/-?\d/g).map(Number).reverse(),
        loop = 0,
        res = ""
    price = []
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
}

fetch(fetch_url)
    .then((res) => res.json())
    .then((res) => {
        setReceipt(res.transactionData)
    })
    .catch((err) => console.error(err))

// set the item in receipt
setReceipt = (transactionData) => {
    // total price initialization
    let totalPrice = 0
    console.log(transactionData)

    // get and set product list
    transactionData.products.forEach((product) => {
        let tr = document.createElement("tr"),
            TotalAmount = product.amount * product.price,
            tdName = document.createElement("td"),
            textNodeName = document.createTextNode(product.name),
            tdAmount = document.createElement("td"),
            textNodeAmount = document.createTextNode(product.amount),
            tdPrice = document.createElement("td"),
            textNodePrice = document.createTextNode(price(product.price)),
            tdTotalAmount = document.createElement("td"),
            textNodeTotalAmount = document.createTextNode(price(TotalAmount))
        tdName.appendChild(textNodeName)
        tdPrice.appendChild(textNodePrice)
        tdAmount.appendChild(textNodeAmount)
        tdTotalAmount.appendChild(textNodeTotalAmount)
        tr.append(tdName, tdAmount, tdPrice, tdTotalAmount)
        tBody.appendChild(tr)

        // get total Price
        totalPrice += TotalAmount
    })

    // set total Price
    document.getElementById("totalPrice").innerHTML = price(totalPrice)

    // get and set datetime
    let date = new Date(transactionData.date)
    document.getElementById("dateTime").innerHTML = `${date.getDate()}/${
		Number(date.getMonth()) + 1
	}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    // send message when document is ready to print
    window.parent.postMessage("documentReady")
}