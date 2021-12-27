import React, { Component, useEffect } from "react"
import Navbar from "../components/navbar"
import HiddenInput from "../components/hiddenInput"
import price from "../js/price"
import printReceiptOfPayment from "../js/printReceiptOfPayment"
import getParameter from "../js/getParameter"
import { base_url } from "../js/config"
import axios from "axios"
import deleteTransaction from "../js/deleteTransaction"
import { Prompt } from "react-router"
import $ from "jquery"

// const printReceiptOfPayment = async () => {
// 	const iframe = document.frames
// 		? document.frames["receiptOfPayment"]
// 		: document.getElementById("receiptOfPayment")
// 	const iframeWindow = iframe.contentWindow || iframe

// 	iframe.focus()
// 	iframeWindow.print()

// 	return false
// }
export class transaction extends Component {
	constructor() {
		super()
		this.state = {
			name: "",
			address: "",
			phone: "",
			products: [],
			message: "",
			change: false,
			transactionId: getParameter('id'),
			print: false,
		}
	}
	getData = () => {
		if (this.state.transactionId) {
			let url = `${base_url}/transaction/${this.state.transactionId}`
			axios
				.get(url)
				.then((response) => {
					this.setState({
						name: response.data.transactionData.customer.name,
						address: response.data.transactionData.customer.address,
						phone: response.data.transactionData.customer.phone,
						products: response.data.transactionData.products,
					})
				})
				.catch((err) => console.error(err))
		} else {
			const products = localStorage.products
			if (products != "[]" && products != undefined) {
				this.setState({ products: JSON.parse(localStorage.products) })
			} else {
				this.setState({ products: [{ name: "", price: 0, amount: 1 }] })
			}
			const customer = localStorage.customer
			if (customer != "{}" && customer != undefined) {
				this.saveCustomer(JSON.parse(customer))
			}
		}
	}
	setProducts = (value, type, index) => {
		let tempProducts = this.state.products
		if (type === "name") {
			tempProducts[index].name = value
		} else if (type === "amount") {
			tempProducts[index].amount = value
		} else if (type === "price") {
			tempProducts[index].price = Number(value)
		}
		if (tempProducts[index].product_id && type != "amount") {
			tempProducts[index].product_id = null
		}
		this.setchange()
		this.saveProducts(tempProducts)
	}
	selectItem = (item, index) => {
		let tempProducts = this.state.products,
			data = {
				name: item.name,
				price: item.price,
				product_id: item._id,
			},
			amount = tempProducts[index].amount
		if (amount) {
			data.amount = amount
		} else {
			data.amount = 1
		}
		tempProducts.splice(index, 1, data)
		this.saveProducts(tempProducts)
	}
	deleteProduct = (index) => {
		if (window.confirm("Apakah Anda Yakin Menghapus Baris Ini?")) {
			let tempProducts = this.state.products
			tempProducts.splice(index, 1)
			if (tempProducts.length === 0) {
				tempProducts.push({ name: "", price: 0, amount: 1 })
			}
			this.saveProducts(tempProducts)
		}
	}
	saveProducts = (products) => {
		this.setState({ products })
		if (!this.state.transactionId) {
			localStorage.products = JSON.stringify(products)
		}
	}
	amount = (operation, index) => {
		let tempProducts = this.state.products
		if (operation === "increment") tempProducts[index].amount++
		else if (operation === "increment" && tempProducts[index].amount <= 0)
			tempProducts[index].amount = 1
		else if (operation === "decrement" && tempProducts[index].amount >= 2)
			tempProducts[index].amount--
		this.saveProducts(tempProducts)
	}
	saveCustomer = (customer) => {
		this.setState({
			name: customer.name,
			address: customer.address,
			phone: customer.phone,
		})
		if (!this.state.transactionId) {
			localStorage.customer = JSON.stringify(customer)
		}
	}
	setCustomer = (key, value) => {
		let data = {
			name: this.state.name,
			address: this.state.address,
			phone: this.state.phone,
		}
		if (key === "name") data.name = value
		else if (key === "address") data.address = value
		else if (key === "phone") data.phone = value
		this.setchange()
		this.saveCustomer(data)
	}
	totalPrice = () => {
		let total = 0
		this.state.products.forEach((item) => {
			total += item.amount * item.price
		})
		return total
	}
	addNewRow = () => {
		let tempProducts = this.state.products
		tempProducts.push({ name: "", price: 0, amount: 1 })
		this.saveProducts(tempProducts)
	}
	saveTransaction = (print) => {
		let data = {
				name: this.state.name,
				address: this.state.address,
				phone: this.state.phone,
				products: JSON.stringify(this.state.products),
			},
			url = base_url + "/transaction"
		if (this.state.transactionId) {
			data.transaction_id = this.state.transactionId
			axios
				.put(url, data)
				.then((response) => {
					this.setState({
						message: response.data.message,
					})
					this.getData()
					if (print) this.print()
					this.setState({ change: false })
				})
				.catch((error) => {
					console.error(error)
				})
		} else {
			axios
				.post(url, data)
				.then((response) => {
					this.setState({
						name: "",
						address: "",
						phone: "",
						products: [{ name: "", price: 0, amount: 0 }],
						message: response.data.message,
					})
					localStorage.removeItem("customer")
					localStorage.removeItem("products")
					if (print) this.print(response.data.data._id)
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}
	deleteTransaction = async () => {
		if (this.state.transactionId) {
			deleteTransaction(this.state.transactionId)
				.then((response) => {
					sessionStorage.message = response.data.message
					window.location = "/transactionList"
				})
				.catch((err) => console.error(err))
		} else {
			this.setState({
				name: "",
				address: "",
				phone: "",
				products: [{ name: "", price: 0, amount: 0 }],
			})
			localStorage.removeItem("customer")
			localStorage.removeItem("products")
		}
	}
	setchange = () => {
		if (this.state.transactionId) {
			this.setState({ change: true })
		}
	}
	print = async (transactionId) => {
		if (transactionId) await this.setState({ transactionId })
		this.setState({ print: true })
	}
	componentDidMount() {
		console.log(this.state.transactionId)
		window.onmessage = (event) => {
			if (event.data === "afterprint") {
				this.setState({ print: false })
			} else if (event.data === "documentReady") {
				printReceiptOfPayment()
			}
		}
		this.getData()
		if (this.state.transactionId)
			this.setState({ transactionId: this.state.transactionId })
		document.title = 'Transaksi'
	}

	render() {
		console.log(process.env.NODE_ENV)
		return (
			<div className='mb-3'>
				{(() => {
					if (this.state.print) {
						return (
							<iframe
								id='receiptOfPayment'
								src={`${process.env.PUBLIC_URL}/receiptOfPayment.html?id=${this.state.transactionId}&print=${process.env.NODE_ENV == 'production'}`}
								style={{ display: "none" }}
								title='Receipt'
								onLoad={()=>console.log('print',this.state.print)}
							/>
						)
					}
				})()}

				<Prompt
					when={this.state.change}
					message='Data Belum Di Simpan, Yakin Ingin Meninggalkan Halaman Ini?'
				/>
				<Navbar active='1' />
				<h3 className='text-bold text-info mt-2 ml-5'>Transaksi</h3>
				<div className='container'>
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
					<div className='row'>
						<div className='col-4'>
							<div class='input-group mb-3'>
								<div class='input-group-prepend'>
									<span class='input-group-text'>Name</span>
								</div>
								<input
									type='text'
									class='form-control'
									placeholder='Nama Pelanggan'
									value={this.state.name}
									onChange={(ev) => this.setCustomer("name", ev.target.value)}
								/>
							</div>
						</div>
						<div className='col-4'>
							<div class='input-group mb-3'>
								<div class='input-group-prepend'>
									<span class='input-group-text'>Alamat</span>
								</div>
								<input
									type='text'
									class='form-control'
									placeholder='Alamat Pelanggan'
									value={this.state.address}
									onChange={(ev) =>
										this.setCustomer("address", ev.target.value)
									}
								/>
							</div>
						</div>
						<div className='col-4'>
							<div class='input-group mb-3'>
								<div class='input-group-prepend'>
									<span class='input-group-text'>Nomer</span>
								</div>
								<input
									type='text'
									class='form-control'
									placeholder='Nomer Pelanggan'
									value={this.state.phone}
									onChange={(ev) => this.setCustomer("phone", ev.target.value)}
								/>
							</div>
						</div>
					</div>
					<table class='table table-striped table-light text-center'>
						<thead>
							<tr>
								<th scope='col'>Hapus</th>
								<th scope='col'>#</th>
								<th scope='col'>Nama Barang</th>
								<th scope='col'>Jumlah</th>
								<th scope='col'>Harga Satuan</th>
								<th scope='col'>Harga Total</th>
							</tr>
						</thead>
						<tbody>
							{this.state.products.map((item, index) => (
								<tr>
									<td>
										<button
											className='btn btn-danger btn-sm p-1'
											onClick={() => this.deleteProduct(index)}
											title='Hapus Baris Ini'
										>
											<img
												src={process.env.PUBLIC_URL + "/trash.svg"}
												alt='trash'
												style={{ objectFit: "cover" }}
											/>
										</button>
									</td>
									<th scope='row'>{index + 1}</th>
									<td
										style={{
											minHeight: "2rem",
											minWidth: "2rem",
											width: "40%",
										}}
									>
										<HiddenInput
											type='text'
											col='name'
											value={item.name}
											change={(ev) =>
												this.setProducts(ev.target.value, "name", index)
											}
											selectItem={(item) => this.selectItem(item, index)}
										/>
									</td>
									<td style={{ minHeight: "2rem", minWidth: "2rem" }}>
										<HiddenInput
											type='number'
											col='amount'
											value={item.amount == 0 ? "" : item.amount}
											change={(ev) =>
												this.setProducts(ev.target.value, "amount", index)
											}
											amountDecrement={() => this.amount("decrement", index)}
											amountIncrement={() => this.amount("increment", index)}
										/>
									</td>
									<td>
										<HiddenInput
											type='text'
											col='price'
											value={price(item.price.toString())}
											change={(ev) =>
												this.setProducts(
													price(ev.target.value, true),
													"price",
													index
												)
											}
										/>
									</td>
									<td>{price((item.amount * item.price).toString())}</td>
								</tr>
							))}
							<tr>
								<td colspan='4' style={{ textAlign: "right" }}>
									<div style={{ float: "right" }}>
										<button
											className='btn btn-success btn-lg p-1'
											onClick={() => this.addNewRow()}
											title='Tambah Baris'
										>
											Tambah Baris{" "}
											<img
												src={process.env.PUBLIC_URL + "/plus.svg"}
												alt='trash'
												className='mb-1'
												style={{ objectFit: "cover" }}
											/>
										</button>
									</div>
								</td>
								<td>
									<strong>JUMLAH</strong>
								</td>
								<td>
									<strong>{price(this.totalPrice().toString())}</strong>
								</td>
							</tr>
						</tbody>
					</table>
					<div className='row justify-content-around mt-4'>
						<div className='col-3 d-flex justify-content-center'>
							<button
								type='button'
								class='btn btn-secondary'
								onClick={() => this.saveTransaction(false)}
							>
								Simpan
								<img
									src={process.env.PUBLIC_URL + "/save.svg"}
									alt='trash'
									style={{ objectFit: "cover" }}
									className='ml-2'
								/>
							</button>
						</div>
						<div className='col-3 d-flex justify-content-center'>
							<button
								type='button'
								class='btn btn-danger'
								onClick={() => {
									if (
										window.confirm(
											"apakah anda yakin akan Menghapus Transaksi ini?"
										)
									)
										this.deleteTransaction()
								}}
							>
								Hapus Transaksi
								<img
									src={process.env.PUBLIC_URL + "/trash.svg"}
									alt='trash'
									style={{ objectFit: "cover" }}
									className='ml-2'
								/>
							</button>
						</div>
						<div className='col-3 d-flex justify-content-center'>
							<button
								type='button'
								class='btn btn-info'
								onClick={() => this.saveTransaction(true)}
							>
								Simpan Dan Cetak
								<img
									src={process.env.PUBLIC_URL + "/printer.svg"}
									alt='trash'
									style={{ objectFit: "cover" }}
									className='ml-2'
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default transaction
