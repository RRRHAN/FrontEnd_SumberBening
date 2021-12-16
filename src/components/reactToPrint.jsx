import React from "react"

const printIframe = (id) => {
	const iframe = document.frames
		? document.frames[id]
		: document.getElementById(id)
	const iframeWindow = iframe.contentWindow || iframe

	iframe.focus()
	iframeWindow.print()

	return false
}

class PaymentConfirmation extends React.Component {
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		isLoading: true,
	// 	}

	// 	this.handleMessage = this.handleMessage.bind(this)
	// }

	// componentWillMount() {
	// 	window.addEventListener("message", this.handleMessage)
	// }

	// componentWillUnmount() {
	// 	window.removeEventListener("message", this.handleMessage)
	// }

	// handleMessage(event) {
	// 	console.log("event")
	// 	if (event.data.action === "receipt-loaded") {
	// 		this.setState({
	// 			isLoading: false,
	// 		})
	// 	}
	// }

	render() {
		console.log(this.handleMessage)
		return (
			<>
				<iframe
					id='receipt'
					src='/receiptOfPayment.html?id=615535aa8297472fc87b0c29'
					style={{ display: "none" }}
					title='Receipt'
				/>
				<button onClick={() => printIframe("receipt")}>
					{/* {this.state.isLoading ? "Loading..." : "Print Receipt"} */}
					print
				</button>
			</>
		)
	}
}

export default PaymentConfirmation
