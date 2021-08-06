import React, { Component } from "react"
import Navbar from "../components/navbar"
import Card from "../components/card"
import Modal_product from "../components/modal_product"
import price from "../js/price"
import { base_url } from "../js/config"
import axios from "axios"
import $ from "jquery"

export class price_list extends Component {
	constructor() {
		super()
		this.state = {
			products: [],
			product: null,
			message: "",
			action: "insert",
			keyword: "",
			name: "",
			price: 0,
			stock: 0,
			barcode: "",
			image: null,
			images_name: [],
			// numberOfFiles: 1,
		}
	}
	getMessage = () => {
		const message = sessionStorage.getItem("message")
		if (message) {
			this.setState({ message })
			sessionStorage.removeItem("message")
		}
	}
	getProducts = async (keyword) => {
		let url
		if (!keyword) {
			url = base_url + "/product"
		} else if (keyword) {
			url = base_url + "/product/" + keyword
		}
		axios
			.get(url)
			.then((response) => {
				this.setState({ products: response.data.products })
			})
			.catch((error) => {
				console.log(error)
			})
	}
	search = async (event) => {
		await this.setState({ keyword: event.target.value })
		this.getProducts(this.state.keyword)
	}
	Add = () => {
		$("#modal_product").modal("show")
		$("input:file").val(null)
		this.setState({ name: "", price: 0, stock: 0, barcode: "" })
	}
	saveProduct = (event) => {
		event.preventDefault()
		$("#modal_product").modal("hide")
		let form = new FormData()
		form.append("name", this.state.name)
		form.append("price", this.state.price)
		if (this.state.stock != 0 && this.state.stock != "") {
			form.append("stock", this.state.stock)
		}
		if (this.state.barcode != "") {
			form.append("barcode", this.state.barcode)
		}
		if (this.state.image != null) {
			form.append("image", this.state.image)
		}
		console.log(form)

		let url = base_url + "/product"
		axios
			.post(url, form)
			.then((response) => {
				this.setState({ message: response.data.message, image: null })
				$("input:file").val(null)
				this.getProducts()
			})
			.catch((error) => console.log(error))
	}

	componentDidMount() {
		this.getProducts()
		this.getMessage()
	}
	render() {
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
							onClick={(ev) => this.Add(ev)}
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
								onKeyUp={(ev) => this.search(ev)}
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
				<div className='container p-3'>
					<div className='row'>
						{this.state.products.map((item) => (
							<div className='col-4'>
								<Card
									name={item.name}
									price={price(item.price)}
									image={item.image[0] ? item.image[0] : "../no_data.svg"}
									details={() => (window.location = "/product/" + item._id)}
								/>
							</div>
						))}
					</div>
				</div>
				<Modal_product
					onSubmit={(ev) => this.saveProduct(ev)}
					onChangeName={(ev) => this.setState({ name: ev.target.value })}
					onChangePrice={(ev) => this.setState({ price: ev.target.value })}
					onChangeStock={(ev) => this.setState({ stock: ev.target.value })}
					onChangeBarcode={(ev) => this.setState({ barcode: ev.target.value })}
					onChangeImage={(ev) => this.setState({ image: ev.target.files[0] })}
					name={this.state.name}
					price={this.state.price}
					stock={this.state.stock}
					barcode={this.state.barcode}
					action={this.state.action}
				/>
			</div>
		)
	}
}

export default price_list
