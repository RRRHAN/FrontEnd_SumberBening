import React, { Component } from "react"
import { base_url } from "../js/config"
import $, { error } from "jquery"
import Modal_product from "../components/modal_product"
import axios from "axios"
import Navbar from "../components/navbar"
import getParameter from "../js/getParameter"
import price from "../js/price"
import { Redirect } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper-bundle.css"
import SwiperCore, { Navigation, Pagination } from "swiper"
SwiperCore.use([Navigation, Pagination])

export class product extends Component {
	constructor() {
		super()
		this.state = {
			product_id: getParameter('id'),
			name: "",
			price: 0,
			stock: 0,
			barcode: "",
			image_name: [],
			image: null,
			message: "",
		}
	}
	getProduct = async () => {
		let url = base_url + "/product/id/" + this.state.product_id
		axios
			.get(url)
			.then((response) => {
				this.setState({
					name: response.data.product.name,
					price: response.data.product.price,
					stock: response.data.product.stock,
					barcode: response.data.product.barcode,
				})
				if (response.data.product.image.length === 0) {
					this.setState({ image_name: ["../no_data.svg"] })
				} else if (response.data.product.image.length != 0) {
					this.setState({ image_name: response.data.product.image })
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}
	addImage = (ev) => {
		ev.preventDefault()
		const url = base_url + "/product/image"
		let form = new FormData()
		form.append("product_id", this.state.product_id)
		form.append("image", this.state.image)
		axios
			.post(url, form)
			.then((response) => {
				this.setState({ message: response.data.message })
				this.getProduct()
			})
			.catch((error) => console.error(error))
		$("#modal_image").modal("hide")
	}
	deleteImage = (item) => {
		if (window.confirm("apakah anda yakin akan menghapus foto ini?")) {
			const url = base_url + "/product/image",
				data = { product_id: this.state.product_id, image: item }
			axios
				.delete(url, { data })
				.then((response) => {
					this.setState({ message: response.data.message })
					this.getProduct()
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}
	deleteProduct = () => {
		if (window.confirm("Apakah Anda Yakin Ingin Menghapus Produk Ini?")) {
			const url = base_url + "/product"
			axios
				.delete(url, { data: { product_id: this.state.product_id } })
				.then((response) => {
					this.setState({ message: response.data.message })
				})
				.catch((error) => console.error(error))
		}
	}
	productDeleted = () => {
		sessionStorage.setItem("message", this.state.message)
		return <Redirect to='/' />
	}
	saveProduct = (event) => {
		event.preventDefault()
		$("#modal_product").modal("hide")
		let form = {
			product_id: this.state.product_id,
			name: this.state.name,
			price: this.state.price,
		}

		if (this.state.stock != 0 && this.state.stock != "") {
			form.stock = this.state.stock
		}
		if (this.state.barcode != "") {
			form.barcode = this.state.barcode
		}
		let url = base_url + "/product"
		axios
			.put(url, form)
			.then((response) => {
				this.setState({ message: response.data.message })
				this.getProduct()
			})
			.catch((error) => console.error(error))
	}
	componentDidMount() {
		this.getProduct()
		document.title = "produk"
	}
	render() {
		if (this.state.message == "Product has been deleted") {
			return this.productDeleted()
		}
		return (
			<div
				className='bg-light'
				style={{
					height: "100vh",
				}}
			>
				<Navbar />
				<div className='container'>
					{(() => {
						if (this.state.message != "") {
							return (
								<div className='container mt-3'>
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
					<div className='row mt-3'>
						{/* <h1>{this.state.name}</h1> */}
						<div className='col-4 p-2 border border-dark rounded'>
							<Swiper
								spaceBetween={1}
								slidesPerView={1}
								navigation
								pagination
								scrollbar={{ draggable: true }}
								centeredSlidesBounds={true}
								centeredSlides={true}
								// onSwiper={(swiper) => console.log(swiper)}
								// onSlideChange={() => console.log("slide change")}
							>
								{this.state.image_name.map((item, index) => (
									<div>
										<SwiperSlide className='d-flex align-content-center flex-wrap'>
											{/* <div
												className='d-flex align-content-center flex-wrap'
												style={{
													width: "100%",
													height: "100%",
												}}
											> */}
											<div className='align-self-center'>
												{(() => {
													if (this.state.image_name[0] != "../no_data.svg") {
														return (
															<button
																className='btn btn-danger position-absolute p-2'
																style={{
																	top: "1%",
																	left: "1%",
																}}
																onClick={() => this.deleteImage(item)}
																title='Hapus Foto Ini'
															>
																<img
																	src={process.env.PUBLIC_URL + "/trash.svg"}
																	alt='trash'
																	style={{ objectFit: "cover" }}
																/>
															</button>
														)
													}
												})()}

												<img
													key={index}
													src={base_url + "/images/products/" + item}
													alt='...'
													className='img rounded d-block'
													width='100%'
													height='100%'
													style={{
														objectFit: "cover",
													}}
												/>
											</div>
											{/* </div> */}
										</SwiperSlide>
									</div>
								))}
							</Swiper>
						</div>
						<div className='col-5 ml-3'>
							<h1
								className='mb-2'
								style={{
									fontSize: "4rem",
								}}
							>
								{this.state.name}
							</h1>
							<h4 className='mb-3'>Rp. {price(this.state.price)}</h4>
							<h6>
								Stok : {this.state.stock == undefined ? "-" : this.state.stock}
							</h6>
							<h6>
								Barcode :{" "}
								{this.state.barcode == undefined ? "-" : this.state.barcode}
							</h6>
							<button
								type='button'
								class='btn btn-primary mt-3 d-block'
								onClick={() => $("#modal_product").modal("show")}
							>
								Ubah Data{" "}
								<img
									src={process.env.PUBLIC_URL + "/file-text.svg"}
									alt='search'
									style={{ objectFit: "cover" }}
								/>
							</button>
							<button
								type='button'
								class='btn btn-success mt-3 d-block'
								onClick={() => $("#modal_image").modal("show")}
							>
								Tambah Foto{" "}
								<img
									src={process.env.PUBLIC_URL + "/image.svg"}
									alt='search'
									style={{ objectFit: "cover" }}
								/>
							</button>
							<button
								type='button'
								class='btn btn-danger mt-3 d-block'
								onClick={() => this.deleteProduct()}
							>
								Hapus Produk{" "}
								<img
									src={process.env.PUBLIC_URL + "/trash.svg"}
									alt='search'
									style={{ objectFit: "cover" }}
								/>
							</button>
						</div>
					</div>
				</div>
				<div
					class='modal fade'
					id='modal_image'
					tabindex='-1'
					role='dialog'
					aria-labelledby='exampleModalLabel'
					aria-hidden='true'
					data-backdrop='static'
					data-keyboard='false'
				>
					<div class='modal-dialog modal-dialog-centered' role='document'>
						<div class='modal-content'>
							<div class='modal-header'>
								<h5 class='modal-title' id='exampleModalLabel'>
									Form Tambah Gambar
								</h5>
								<button
									type='button'
									class='close'
									data-dismiss='modal'
									aria-label='Close'
								>
									<span aria-hidden='true'>&times;</span>
								</button>
							</div>
							<div class='modal-body'>
								<form onSubmit={(ev) => this.addImage(ev)}>
									Gambar
									<input
										type='file'
										multiple
										className='form-control mb-1'
										onChange={(ev) =>
											this.setState({ image: ev.target.files[0] })
										}
									/>
									<div class='modal-footer'>
										<button type='submit' className='btn btn-block btn-success'>
											Simpan
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<Modal_product
					onSubmit={(ev) => this.saveProduct(ev)}
					onChangeName={(ev) => this.setState({ name: ev.target.value })}
					onChangePrice={(ev) => this.setState({ price: ev.target.value })}
					onChangeStock={(ev) => this.setState({ stock: ev.target.value })}
					onChangeBarcode={(ev) => this.setState({ barcode: ev.target.value })}
					onChangeImage={(ev) => this.setState({ image: ev.target.files })}
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

export default product
