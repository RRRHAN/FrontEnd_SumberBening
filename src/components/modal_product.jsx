import React, { Component } from "react"

export class modal_product extends Component {
	render() {
		return (
			<div
				class='modal fade'
				id='modal_product'
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
								{this.props.action == "insert"
									? "Form Tambah data"
									: "Form Edit data"}
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
							<form onSubmit={this.props.onSubmit}>
								Nama
								<input
									type='text'
									className='form-control mb-1'
									value={this.props.name}
									onChange={this.props.onChangeName}
									required
									autoFocus
								/>
								Harga
								<input
									type='number'
									className='form-control mb-1'
									value={this.props.price}
									onChange={this.props.onChangePrice}
									required
								/>
								Stok
								<input
									type='number'
									className='form-control mb-1'
									value={this.props.stock}
									onChange={this.props.onChangeStock}
								/>
								Barcode
								<input
									type='text'
									className='form-control mb-1'
									value={this.props.barcode}
									onChange={this.props.onChangeBarcode}
								/>
								{(() => {
									if (this.props.action == "insert") {
										return (
											<div>
												Gambar
												<input
													type='file'
													multiple
													className='form-control mb-1'
													onChange={this.props.onChangeImage}
												/>
											</div>
										)
									}
								})()}
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
		)
	}
}

export default modal_product
