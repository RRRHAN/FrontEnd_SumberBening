import React, { useState, useEffect } from "react"
import Navbar from "../components/navbar"
import { base_url } from "../js/config"
import axios from "axios"
import TransactionList from "../components/transactionList"
import ModalDetailTransaction from "../components/modalDetailTransaction"
import $ from "jquery"

const Transaction_list = () => {
	const [state_message, set_state_message] = useState("")
	const [state_transactions, set_state_transactions] = useState([
		{
			customer: {
				name: "",
				phone: "",
				address: "",
			},
			_id: "",
			products: [
				{
					name: "",
					price: 0,
					product_id: "",
					amount: 0,
				},
			],
			date: "",
		},
	])
	const [state_transaction, set_state_transaction] = useState({
		customer: {
			name: "",
			phone: "",
			address: "",
		},
		_id: "",
		products: [
			{
				name: "",
				price: 0,
				product_id: "",
				amount: 0,
			},
		],
		date: "",
	})

	const getTransaction = () => {
		let url = base_url + "/transaction"
		axios
			.get(url)
			.then((response) => {
				set_state_transactions(response.data.transactions)
				console.log(response.data)
			})
			.catch((error) => {
				console.error(error)
			})
	}
	const showDetail = (i) => {
		$("#modalDetail").modal("show")
		set_state_transaction(state_transactions[i] )
	}
	const getMessage = () => {
		const message = sessionStorage.getItem("message")
		if (message) {
			set_state_message(message)
			sessionStorage.removeItem("message")
		}
	}
	useEffect(() => {
		getTransaction()
		getMessage()
		document.title = "List Transaksi"
	})

	return (
		<div>
			<Navbar active='2' />
			<h3 className='text-bold text-info m-2 ml-5'>Daftar Transaksi</h3>
			{(() => {
				if (state_message != "") {
					return (
						<div className='container mt-2'>
							<div className='row'>
								<div className='col-6'>
									<div
										class='alert alert-primary alert-dismissible'
										role='alert'
									>
										{state_message}
										<button
											type='button'
											class='close'
											data-dismiss='alert'
											aria-label='Close'
										>
											<span aria-hidden='true'>&times;</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					)
				}
			})()}
			<div className='container'>
				{state_transactions.map((item, i) => (
					<TransactionList
						name={item.customer.name}
						address={item.customer.address}
						phone={item.customer.phone}
						products={item.products}
						date={item.date}
						detail={() => showDetail(i)}
					/>
				))}
			</div>
			<ModalDetailTransaction
				transaction={state_transaction}
				deleteTransaction={(message) => {
					set_state_message(message) 
					getTransaction()
					$("#modalDetail").modal("hide")
				}}
			/>
		</div>
	)
}

export default Transaction_list
