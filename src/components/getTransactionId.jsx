import React from "react"
import { useParams } from "react-router-dom"

import Transaction from "../pages/transaction.jsx"

function GettransactionId() {
	const { id } = useParams()

	return (
		<div>
			<Transaction transactionId={id} />
		</div>
	)
}

export default GettransactionId
