import "./css/App.css"
import React from "react"
import { Switch, Route } from "react-router-dom"
import Product_list from "./pages/products_list"
import Product from "./pages/product"
import Transaction from "./pages/transaction"
import TransactionList from "./pages/transactions_list"
import PaymentConfirmation from "./components/reactToPrint"

function App() {
	return (
		<Switch>
			<Route exact path='/' component={Product_list} />
			<Route exact path='/transaction' component={Transaction} />
			<Route exact path='/product' component={Product} />
			<Route exact path='/transactionList' component={TransactionList} />
		</Switch>
	)
}

export default App
