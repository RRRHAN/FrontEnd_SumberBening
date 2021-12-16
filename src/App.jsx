import "./css/App.css"
import React from "react"
import { Switch, Route } from "react-router-dom"
import Product_list from "./pages/products_list"
import TransactionId from "./get/transactionId"
import ProductId from "./get/productId"
import Transaction from "./pages/transaction"
import TransactionList from "./pages/transactions_list"
import PaymentConfirmation from "./components/reactToPrint"

function App() {
	return (
		<Switch>
			<Route exact path='/' component={Product_list} />
			<Route exact path='/transaction' component={Transaction} />
			<Route exact path='/transaction/:id' component={TransactionId} />
			<Route exact path='/product/:id' component={ProductId} />
			<Route exact path='/transactionList' component={TransactionList} />
			<Route exact path='/1' component={PaymentConfirmation} />
		</Switch>
	)
}

export default App
