import React, { Component } from "react"
import Navbar from "../components/navbar"
import { base_url } from "../js/config"
import axios from "axios"
import TransactionList from "../components/transactionList"
import ModalDetailTransaction from "../components/modalDetailTransaction"
import $ from "jquery"

export class transaction_list extends Component {
	constructor() {
		super()
		this.state = {
			message: "",
			transactions: [
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
			],
			transaction: {
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
		}
	}
	getTransaction = () => {
		let url = base_url + "/transaction"
		axios
			.get(url)
			.then((response) => {
				this.setState({ transactions: response.data.transactions })
				console.log(response.data)
			})
			.catch((error) => {
				console.error(error)
			})
	}
	showDetail = (i) => {
		$("#modalDetail").modal("show")
		this.setState({ transaction: this.state.transactions[i] })
	}
	getMessage = () => {
		const message = sessionStorage.getItem("message")
		if (message) {
			this.setState({ message })
			sessionStorage.removeItem("message")
		}
	}
	componentDidMount() {
		this.getTransaction()
		this.getMessage()
		document.title = 'List Transaksi'
	}

	render() {
		return (
			<div>
				<Navbar active='2' />
				<h3 className='text-bold text-info m-2 ml-5'>Daftar Transaksi</h3>
				{(() => {
					if (this.state.message != "") {
						return (
							<div className='container mt-2'>
								<div className='row'>
									<div className='col-6'>
										<div
											class='alert alert-primary alert-dismissible'
											role='alert'
										>
											{this.state.message}
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
					{this.state.transactions.map((item, i) => (
						<TransactionList
							name={item.customer.name}
							address={item.customer.address}
							phone={item.customer.phone}
							products={item.products}
							date={item.date}
							detail={() => this.showDetail(i)}
						/>
					))}
				</div>
				<ModalDetailTransaction
					transaction={this.state.transaction}
					deleteTransaction={(message) => {
						this.setState({ message })
						this.getTransaction()
						$("#modalDetail").modal("hide")
					}}
				/>
			</div>
		)
	}
}

export default transaction_list
