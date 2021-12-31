import React, { useState, useEffect } from "react"
import Navbar from "../components/navbar"
import Card from "../components/card"
import Modal_product from "../components/modal_product"
import price from "../js/price"
import { base_url } from "../js/config"
import axios from "axios"
import $ from "jquery"

const Price_list = () => {
	const [state_products, set_state_products] = useState([])
	const [state_message, set_state_message] = useState("")
	const [state_keyword, set_state_keyword] = useState("")
	const [state_name, set_state_name] = useState("")
	const [state_price, set_state_price] = useState(0)
	const [state_stock, set_state_stock] = useState(0)
	const [state_barcode, set_state_barcode] = useState("")
	const [state_image, set_state_image] = useState(null)

	const getMessage = () => {
		const message = sessionStorage.getItem("message")
		if (message) {
			set_state_message(message)
			sessionStorage.removeItem("message")
		}
	}
	const getProducts = async (keyword) => {
		let url
		if (!keyword) {
			url = base_url + "/product"
		} else if (keyword) {
			url = base_url + "/product/" + keyword
		}
		axios
			.get(url)
			.then((response) => {
				set_state_products(response.data.products)
			})
			.catch((error) => {
				console.log(error)
			})
	}
	const search = async (event) => {
		await set_state_keyword(event.target.value)
		getProducts(state_keyword)
	}
	const Add = () => {
		$("#modal_product").modal("show")
		$("input:file").val(null)
		set_state_name("")
		set_state_price(0)
		set_state_stock(0)
		set_state_barcode("")
	}
	const saveProduct = (event) => {
		event.preventDefault()
		$("#modal_product").modal("hide")
		let form = new FormData()
		form.append("name", state_name)
		form.append("price", state_price)
		if (state_stock != 0 && state_stock != "") {
			form.append("stock", state_stock)
		}
		if (state_barcode != "") {
			form.append("barcode", state_barcode)
		}
		if (state_image != null) {
			form.append("image", state_image)
		}
		console.log(form)

		let url = base_url + "/product"
		axios
			.post(url, form)
			.then((response) => {
				set_state_message(response.data.message)
				set_state_image(null)
				$("input:file").val(null)
				getProducts()
			})
			.catch((error) => console.log(error))
	}

	useEffect(() => {
		getProducts()
		getMessage()
		document.title = "List Produk"
	})
	return (
		<div>
			<Navbar active='0' />
			<div className='row justify-content-between align-items-center mt-3'>
				<div className='col-4 pl-3'>
					<h3 className='text-bold text-info ml-4'>Daftar Harga</h3>
				</div>
				<div className='col-2'>
					<button
						type='button'
						class='btn btn-success'
						onClick={(ev) => Add(ev)}
					>
						Tambah Data
					</button>
				</div>
				<div className='col-4 mr-3'>
					<div class='input-group'>
						<input
							autoFocus
							type='text'
							class='form-control'
							placeholder='Cari Produk ................'
							aria-label='Cari Produk ................'
							aria-describedby='button-addon2'
							onKeyUp={(ev) => search(ev)}
							id='search_form'
							style={{ ":focus": { outline: "none" } }}
						/>
						<div class='input-group-append'>
							<button
								class='btn btn-outline-secondary'
								type='button'
								id='button-addon2'
								style={{ height: "95%" }}
							>
								<img
									src={process.env.PUBLIC_URL + "/search.svg"}
									alt='search'
									style={{ objectFit: "cover" }}
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
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
			<div className='container p-3'>
				<div className='row'>
					{state_products.map((item) => (
						<div className='col-4'>
							<Card
								name={item.name}
								price={price(item.price.toString())}
								image={item.image[0] ? item.image[0] : "../no_data.svg"}
								details={() => {
									if (process.env.REACT_APP_ROUTER === "Hash") {
										window.location = `?id=${item._id}#/product`
									} else {
										window.location = `/product?id=${item._id}`
									}
								}}
							/>
						</div>
					))}
				</div>
			</div>
			<Modal_product
				onSubmit={(ev) => saveProduct(ev)}
				onChangeName={(ev) => set_state_name(ev.target.value)}
				onChangePrice={(ev) => set_state_price(ev.target.value)}
				onChangeStock={(ev) => set_state_stock(ev.target.value)}
				onChangeBarcode={(ev) => set_state_barcode(ev.target.value)}
				onChangeImage={(ev) => set_state_image(ev.target.files[0])}
				name={state_name}
				price={state_price}
				stock={state_stock}
				barcode={state_barcode}
				action={"insert"}
			/>
		</div>
	)
}

export default Price_list
