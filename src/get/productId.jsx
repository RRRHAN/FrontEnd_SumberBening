import React from "react"
import { useParams } from "react-router-dom"

import Product from "../pages/product.jsx"

function ProductId() {
	const { id } = useParams()

	return (
		<div>
			<Product taskId={id} />
		</div>
	)
}

export default ProductId
