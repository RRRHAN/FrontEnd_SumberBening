import "./App.css"
import React from "react"
import { Switch, Route } from "react-router-dom"
import Product_list from "./pages/products_list"
import GetTransactionId from "./components/getTransactionId"
import GetProductId from "./components/getProductId"
import Transaction from "./pages/transaction"
import TransactionList from "./pages/transactions_list"

function App() {
	return (
		<Switch>
			<Route exact path='/' component={Product_list} />
			<Route exact path='/transaction' component={Transaction} />
			<Route exact path='/transaction/:id' component={GetTransactionId} />
			<Route exact path='/product/:id' component={GetProductId} />
			<Route exact path='/transactionList' component={TransactionList} />
		</Switch>
	)
}

export default App
