import React, { useState } from "react"
import Navbar from "../components/navbar"
import HiddenInput from "../components/hiddenInput"
import ConfirmModal from "../components/ConfirmModal"
import price from "../js/price"
import getParameter from "../js/getParameter"
import { base_url } from "../js/config"
import axios from "axios"
import deleteTransaction from "../js/deleteTransaction"
import { Prompt } from "react-router"
import $ from "jquery"

const Transaction = () => {
	const [transactionId, setTransactionId] = useState(getParameter("id"))
	const [message, setMessage] = useState("")
	const [state_products, setStateProducts] = useState([])
	const [phone, setPhone] = useState("")
	const [address, setAddress] = useState("")
	const [name, setName] = useState("")
	const [change, setChange] = useState(false)
	const [print, setStatePrint] = useState(false)
	const [state_confirm_modal, set_state_confirm_modal] = useState({})

	const getData = () => {
		if (transactionId) {
			let url = `${base_url}/transaction/${transactionId}`
			axios
				.get(url)
				.then((response) => {
					setName(response.data.transactionData.customer.name)
					setAddress(response.data.transactionData.customer.address)
					setPhone(response.data.transactionData.customer.phone)
					setStateProducts(response.data.transactionData.products)
				})
				.catch((err) => console.error(err))
		} else {
			const products = localStorage.products
			if (products != "[]" && products != undefined) {
				setStateProducts(JSON.parse(localStorage.products))
			} else {
				setStateProducts([{ name: "", price: 0, amount: 1 }])
			}
			const customer = localStorage.customer
			if (customer != "{}" && customer != undefined) {
				saveCustomer(JSON.parse(customer))
			}
		}
	}
	const setProducts = (value, type, index) => {
		let tempProducts = state_products.slice()
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
		setchange()
		saveProducts(tempProducts)
	}
	const selectItem = (item, index) => {
		let tempProducts = state_products.slice(),
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
		saveProducts(tempProducts)
	}
	const deleteProduct = (index) => {
		let tempProducts = state_products.slice()
		tempProducts.splice(index, 1)
		if (tempProducts.length === 0) {
			tempProducts.push({ name: "", price: 0, amount: 1 })
		}
		saveProducts(tempProducts)
	}
	const saveProducts = (products) => {
		setStateProducts(products)
		if (!transactionId) {
			localStorage.products = JSON.stringify(products)
		}
	}
	const amount = (operation, index) => {
		let tempProducts = state_products.slice()
		if (operation === "increment") tempProducts[index].amount++
		else if (operation === "increment" && tempProducts[index].amount <= 0)
			tempProducts[index].amount = 1
		else if (operation === "decrement" && tempProducts[index].amount >= 2)
			tempProducts[index].amount--
		saveProducts(tempProducts)
	}
	const saveCustomer = (customer) => {
		setName(customer.name)
		setAddress(customer.address)
		setPhone(customer.phone)
		if (!transactionId) {
			localStorage.customer = JSON.stringify(customer)
		}
	}
	const setCustomer = (key, value) => {
		let data = {
			name: name,
			address: address,
			phone: phone,
		}
		if (key === "name") data.name = value
		else if (key === "address") data.address = value
		else if (key === "phone") data.phone = value
		setchange()
		saveCustomer(data)
	}
	const totalPrice = () => {
		let total = 0
		state_products.forEach((item) => {
			total += item.amount * item.price
		})
		return total
	}
	const addNewRow = () => {
		let tempProducts = state_products.slice()
		tempProducts.push({ name: "", price: 0, amount: 1 })
		saveProducts(tempProducts)
	}
	const saveTransaction = (print) => {
		let data = {
				name: name,
				address: address,
				phone: phone,
				products: JSON.stringify(state_products),
			},
			url = base_url + "/transaction"
		if (transactionId) {
			data.transaction_id = transactionId
			axios
				.put(url, data)
				.then((response) => {
					setMessage(response.data.message)
					getData()
					if (print) setPrint()
					setChange(false)
				})
				.catch((error) => {
					console.error(error)
				})
		} else {
			axios
				.post(url, data)
				.then((response) => {
					setName("")
					setAddress("")
					setPhone("")
					setStateProducts([{ name: "", price: 0, amount: 0 }])
					setMessage(response.data.message)
					localStorage.removeItem("customer")
					localStorage.removeItem("products")
					if (print) setPrint(response.data.data._id)
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}
	const delTransaction = async () => {
		if (transactionId) {
			deleteTransaction(transactionId)
				.then((response) => {
					sessionStorage.message = response.data.message
					if(process.env.REACT_APP_ROUTER === "Hash"){
						window.location = `?id=#/transactionList`
					}else{
						window.location = `/transactionList`
					}
				})
				.catch((err) => console.error(err))
		} else {
			setName("")
			setAddress("")
			setPhone("")
			setStateProducts([{ name: "", price: 0, amount: 0 }])
			localStorage.removeItem("customer")
			localStorage.removeItem("products")
		}
	}
	const setchange = () => {
		if (transactionId) {
			setChange(true)
		}
	}
	const setPrint = async (transactionId) => {
		if (transactionId) await setTransactionId(transactionId)
		setStatePrint(true)
	}
	React.useEffect(() => {
		window.onmessage = (event) => {
			if (event.data === "afterprint") {
				setStatePrint(false)
			}
		}
		getData()
		if (transactionId) {
			setTransactionId(transactionId)
		}
		document.title = "Transaksi"
	}, [])

	return (
		<div className='mb-3'>
			{(() => {
				if (print) {
					return (
						<iframe
							id='receiptOfPayment'
							src={`${
								process.env.PUBLIC_URL
							}/receiptOfPayment.html?id=${transactionId}&print=${
								process.env.NODE_ENV == "production"
							}`}
							style={{ display: "none" }}
							title='Receipt'
						/>
					)
				}
			})()}

			<Prompt
				when={change}
				message='Data Belum Di Simpan, Yakin Ingin Meninggalkan Halaman Ini?'
			/>
			<Navbar active='1' />
			<h3 className='text-bold text-info mt-2 ml-5'>Transaksi</h3>
			<div className='container'>
				{(() => {
					if (message != "") {
						return (
							<div className='container mt-2'>
								<div className='row'>
									<div className='col-6'>
										<div
											class='alert alert-primary alert-dismissible'
											role='alert'
										>
											{message}
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
								value={name}
								onChange={(ev) => setCustomer("name", ev.target.value)}
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
								value={address}
								onChange={(ev) => setCustomer("address", ev.target.value)}
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
								value={phone}
								onChange={(ev) => setCustomer("phone", ev.target.value)}
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
						{state_products.map((item, index) => (
							<tr>
								<td>
									<button
										className='btn btn-danger btn-sm p-1'
										onClick={() => {
											$("#confirmModal").modal("show")
											set_state_confirm_modal({
												message: "Apakah Anda Yakin Akan Menghapus Baris Ini?",
												action: () => {
													deleteProduct(index)
												},
											})
										}}
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
										change={(ev) => {
											setProducts(ev.target.value, "name", index)
										}}
										selectItem={(item) => selectItem(item, index)}
									/>
								</td>
								<td style={{ minHeight: "2rem", minWidth: "2rem" }}>
									<HiddenInput
										type='number'
										col='amount'
										value={item.amount == 0 ? "" : item.amount}
										change={(ev) =>
											setProducts(ev.target.value, "amount", index)
										}
										amountDecrement={() => amount("decrement", index)}
										amountIncrement={() => amount("increment", index)}
									/>
								</td>
								<td>
									<HiddenInput
										type='text'
										col='price'
										value={price(item.price.toString())}
										change={(ev) =>
											setProducts(price(ev.target.value, true), "price", index)
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
										onClick={() => addNewRow()}
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
								<strong>{price(totalPrice().toString())}</strong>
							</td>
						</tr>
					</tbody>
				</table>
				<div className='row justify-content-around mt-4'>
					<div className='col-3 d-flex justify-content-center'>
						<button
							type='button'
							class='btn btn-secondary'
							onClick={() => saveTransaction(false)}
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
								$("#confirmModal").modal("show")
								set_state_confirm_modal({
									message: "Apakah Anda Yakin Akan Menghapus Transaksi Ini?",
									action: () => {
										delTransaction()
									},
								})
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
							onClick={() => saveTransaction(true)}
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
			<ConfirmModal
				message={state_confirm_modal.message}
				action={state_confirm_modal.action}
			/>
		</div>
	)
}

export default Transaction
