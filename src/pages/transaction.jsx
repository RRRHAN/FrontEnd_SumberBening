import React, { Component } from "react"
import Navbar from "../components/navbar"
import HiddenInput from "../components/hiddenInput"
import price from "../js/price"
import { base_url } from "../js/config"
import axios from "axios"
import deleteTransaction from "../js/deleteTransaction"

export class transaction extends Component {
	constructor() {
		super()
		this.state = {
			name: "",
			address: "",
			phone: "",
			products: [],
			message: "",
		}
	}
	getData = () => {
		if (this.props.transactionId) {
			let url = `${base_url}/transaction/${this.props.transactionId}`
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
				this.setState({ products: [{ name: "", price: 0, amount: 0 }] })
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
			tempProducts[index].price = value
		}
		if (tempProducts[index].product_id && type != "amount") {
			tempProducts[index].product_id = null
		}
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
				tempProducts.push({ name: "", price: 0, amount: 0 })
			}
			this.saveProducts(tempProducts)
		}
	}
	saveProducts = (products) => {
		this.setState({ products })
		if (!this.props.transactionId) {
			localStorage.products = JSON.stringify(products)
		}
	}
	amount = (operation, index) => {
		let tempProducts = this.state.products
		if (operation === "increment") tempProducts[index].amount++
		else if (operation === "decrement") tempProducts[index].amount--
		this.saveProducts(tempProducts)
	}
	saveCustomer = (customer) => {
		this.setState({
			name: customer.name,
			address: customer.address,
			phone: customer.phone,
		})
		if (!this.props.transactionId) {
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
		tempProducts.push({ name: "", price: 0, amount: 0 })
		this.saveProducts(tempProducts)
	}
	saveTransaction = () => {
		let data = {
				name: this.state.name,
				address: this.state.address,
				phone: this.state.phone,
				products: JSON.stringify(this.state.products),
			},
			url = base_url + "/transaction"
		if (this.props.transactionId) {
			data.transaction_id = this.props.transactionId
			axios
				.put(url, data)
				.then((response) => {
					this.setState({
						message: response.data.message,
					})
					this.getData()
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
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}
	deleteTransaction = async () => {
		if (this.props.transactionId) {
			deleteTransaction(this.props.transactionId)
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
	componentDidMount() {
		this.getData()
	}
	render() {
		return (
			<div>
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
									<span class='input-group-text'>Nama</span>
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
											type='number'
											col='price'
											value={price(item.price == 0 ? "" : item.price)}
											change={(ev) =>
												this.setProducts(ev.target.value, "price", index)
											}
										/>
									</td>
									<td>
										{price(
											item.amount * item.price == 0
												? ""
												: item.amount * item.price
										)}
									</td>
								</tr>
							))}
							<tr>
								<td colspan='4' style={{ textAlign: "right" }}>
									<div style={{ float: "right" }}>
										<button
											className='btn btn-success btn-lg p-1'
											onClick={() => this.addNewRow()}
											title='Hapus Baris Ini'
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
									<strong>{price(this.totalPrice())}</strong>
								</td>
							</tr>
						</tbody>
					</table>
					<div className='row justify-content-around'>
						<div className='col-3 d-flex justify-content-center'>
							<button
								type='button'
								class='btn btn-info'
								onClick={() => this.saveTransaction()}
							>
								Simpan
							</button>
						</div>
						{/* {(() => {
							if (this.props.transactionId) {
								return ( */}
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
						{/* )
							}
						})()} */}
						<div className='col-3 d-flex justify-content-center'>
							<button type='button' class='btn btn-secondary'>
								Info
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default transaction
