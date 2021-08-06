import React, { Component } from "react"
import price from "../js/price"
import deleteTransaction from "../js/deleteTransaction"

export class modalDetailTransaction extends Component {
	convertTime = (time) => {
		let date = new Date(time),
			day = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
		return ` ${day[date.getDay() - 1]} ${date.getDate()}/${
			Number(date.getMonth()) + 1
		}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
	}
	totalPrice = () => {
		let total = 0
		this.props.transaction.products.forEach((item) => {
			total += item.amount * item.price
		})
		return total
	}
	deleteTransaction = async (id) => {
		deleteTransaction(id)
			.then((response) => {
				this.props.deleteTransaction(response.data.message)
			})
			.catch((err) => console.error(err))
	}
	render() {
		return (
			<div className='modal fade' id='modalDetail'>
				<div className='modal-dialog modal-lg'>
					<div className='modal-content'>
						<div className='modal-header bg-success text-white'>
							<h5>Detail Transaksi</h5>
						</div>
						<div className='modal-body'>
							<div className='row justify-content-between'>
								<div className='col-6'>
									<table className='mb-3'>
										<tr>
											<h5 className='text-info mb-1'>Pelanggan</h5>
										</tr>
										<tr>
											<td>
												<small className='text-dark'>Nama</small>
											</td>
											<td colSpan='3'>
												<small className='text-dark'>
													: {this.props.transaction.customer.name}
												</small>
											</td>
										</tr>
										<tr>
											<td>
												<small className='text-dark'>Nomer</small>
											</td>
											<td colSpan='3'>
												<small className='text-dark'>
													: {this.props.transaction.customer.phone}
												</small>
											</td>
										</tr>
										<tr>
											<td>
												<small className='text-dark'>Alamat</small>
											</td>
											<td colSpan='3'>
												<small className='text-dark'>
													: {this.props.transaction.customer.address}
												</small>
											</td>
										</tr>
									</table>
								</div>
								<div className='col-6 align-self-end row'>
									<div className='col-6'>
										<button
											type='button'
											class='btn btn-danger'
											onClick={() => {
												if (
													window.confirm(
														"apakah anda yakin akan Menghapus Transaksi ini?"
													)
												)
													this.deleteTransaction(this.props.transaction._id)
											}}
										>
											Hapus Data{" "}
											<img
												src={process.env.PUBLIC_URL + "/trash.svg"}
												alt='search'
												style={{ objectFit: "cover" }}
											/>
										</button>
									</div>
									<div className='col-6'>
										<button
											type='button'
											class='btn btn-info'
											onClick={() =>
												(window.location = `/transaction/${this.props.transaction._id}`)
											}
										>
											Ubah Data{" "}
											<img
												src={process.env.PUBLIC_URL + "/file-text.svg"}
												alt='search'
												style={{ objectFit: "cover" }}
											/>
										</button>
									</div>
								</div>
							</div>
							<h6>{this.convertTime(this.props.transaction.date)}</h6>
							<table className='table table-bordered'>
								<thead>
									<tr>
										<th>#</th>
										<th>Nama Barang</th>
										<th>Harga Satuan</th>
										<th>Jumlah</th>
										<th>Total</th>
									</tr>
								</thead>

								<tbody>
									{this.props.transaction.products.map((item, index) => (
										<tr>
											<td>{`${index + 1}`}</td>
											<td>{item.name}</td>
											<td>Rp {item.price}</td>
											<td>{item.amount}</td>
											<td className='text-right'>
												Rp {item.price * item.amount}
											</td>
										</tr>
									))}
									<tr>
										<td colSpan='4' className='text-danger text-bold'>
											<h4>Total</h4>
										</td>
										<td className='text-right text-danger text-bold'>
											<h4>Rp {price(this.totalPrice())}</h4>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default modalDetailTransaction
