import React, { useState, useEffect } from "react"
import { base_url } from "../js/config"
import $, { error } from "jquery"
import Modal_product from "../components/modal_product"
import axios from "axios"
import Navbar from "../components/navbar"
import ConfirmModal from "../components/ConfirmModal"
import getParameter from "../js/getParameter"
import price from "../js/price"
import { Redirect } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper-bundle.css"
import SwiperCore, { Navigation, Pagination } from "swiper"
SwiperCore.use([Navigation, Pagination])

const Product = () => {
	const [state_product_id, set_state_product_id] = useState(getParameter("id"))
	const [state_name, set_state_name] = useState("")
	const [state_price, set_state_price] = useState(0)
	const [state_stock, set_state_stock] = useState(0)
	const [state_barcode, set_state_barcode] = useState("")
	const [state_image_name, set_state_image_name] = useState([])
	const [state_image, set_state_image] = useState(null)
	const [state_message, set_state_message] = useState("")
	const [state_confirm_modal, set_state_confirm_modal] = useState({})

	const getProduct = async () => {
		let url = base_url + "/product/id/" + state_product_id
		axios
			.get(url)
			.then((response) => {
				set_state_name(response.data.product.name)
				set_state_price(response.data.product.price)
				set_state_stock(response.data.product.stock)
				set_state_barcode(response.data.product.barcode)
				if (response.data.product.image.length === 0) {
					set_state_image_name(["../no_data.svg"])
				} else if (response.data.product.image.length != 0) {
					set_state_image_name(response.data.product.image)
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}
	const addImage = (ev) => {
		ev.preventDefault()
		const url = base_url + "/product/image"
		let form = new FormData()
		form.append("product_id", state_product_id)
		form.append("image", state_image)
		axios
			.post(url, form)
			.then((response) => {
				set_state_message(response.data.message)
				getProduct()
			})
			.catch((error) => console.error(error))
		$("#modal_image").modal("hide")
	}
	const deleteImage = (item) => {
		const url = base_url + "/product/image",
			data = { product_id: state_product_id, image: item }
		axios
			.delete(url, { data })
			.then((response) => {
				set_state_message(response.data.message)
				getProduct()
			})
			.catch((error) => {
				console.error(error)
			})
	}
	const deleteProduct = () => {
		const url = base_url + "/product"
		axios
			.delete(url, { data: { product_id: state_product_id } })
			.then((response) => {
				set_state_message(response.data.message)
			})
			.catch((error) => console.error(error))
	}
	const productDeleted = () => {
		sessionStorage.setItem("message", state_message)
		return <Redirect to={()=>{
			if(process.env.REACT_APP_ROUTER === "Hash"){
				window.location = `?id=#/`
			}else{
				window.location = `/`
			}
		}} />
	}
	const saveProduct = (event) => {
		event.preventDefault()
		$("#modal_product").modal("hide")
		let form = {
			product_id: state_product_id,
			name: state_name,
			price: state_price,
		}

		if (state_stock != 0 && state_stock != "") {
			form.stock = state_stock
		}
		if (state_barcode != "") {
			form.barcode = state_barcode
		}
		let url = base_url + "/product"
		axios
			.put(url, form)
			.then((response) => {
				set_state_message(response.data.message)
				getProduct()
			})
			.catch((error) => console.error(error))
	}
	useEffect(() => {
		getProduct()
		document.title = "produk"
	}, [])

	return (
		<>
			{(() => {
				if (state_message == "Product has been deleted") {
					return productDeleted()
				}
			})()}
			<div
				className='bg-light'
				style={{
					height: "100vh",
				}}
			>
				<Navbar />
				<div className='container'>
					{(() => {
						if (state_message != "") {
							return (
								<div className='container mt-3'>
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
					<div className='row mt-3'>
						{/* <h1>{state_name}</h1> */}
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
								{state_image_name.map((item, index) => (
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
													if (state_image_name[0] != "../no_data.svg") {
														return (
															<button
																className='btn btn-danger position-absolute p-2'
																style={{
																	top: "1%",
																	left: "1%",
																}}
																onClick={() => {
																	$("#confirmModal").modal("show")
																	set_state_confirm_modal({
																		message:
																			"apakah anda yakin akan menghapus foto ini?",
																		action: () => deleteImage(item),
																	})
																}}
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
								{state_name}
							</h1>
							<h4 className='mb-3'>Rp. {price(state_price.toString())}</h4>
							<h6>Stok : {state_stock == undefined ? "-" : state_stock}</h6>
							<h6>
								Barcode : {state_barcode == undefined ? "-" : state_barcode}
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
								onClick={() => {
									$("#confirmModal").modal("show")
									set_state_confirm_modal({
										message: "Apakah Anda Yakin Ingin Menghapus Produk Ini?",
										action: () => deleteProduct(),
									})
								}}
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
								<form onSubmit={(ev) => addImage(ev)}>
									Gambar
									<input
										type='file'
										multiple
										className='form-control mb-1'
										onChange={(ev) => set_state_image(ev.target.files[0])}
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
					onSubmit={(ev) => saveProduct(ev)}
					onChangeName={(ev) => set_state_name(ev.target.value)}
					onChangePrice={(ev) => set_state_price(ev.target.value)}
					onChangeStock={(ev) => set_state_stock(ev.target.value)}
					onChangeBarcode={(ev) => set_state_barcode(ev.target.value)}
					onChangeImage={(ev) => set_state_image(ev.target.files)}
					name={state_name}
					price={state_price}
					stock={state_stock}
					barcode={state_barcode}
				/>
				<ConfirmModal
					message={state_confirm_modal.message}
					action={state_confirm_modal.action}
				/>
			</div>
		</>
	)
}

export default Product
