import React, { Component } from "react"
import price from "../js/price"

export class transactionsList extends Component {
	loop = (a) => {
		a++
		let array = []
		for (let i = 1; i < a; i++) {
			array.push(i)
		}
		return array
	}
	productsLooping = (row) => {
		let length = 4,
			i,
			products = this.props.products
		if (row === 1) {
			i = products.length > length ? length : products.length
			return this.loop(i).map((item, i) => (
				<div className='col-12 row'>
					<div className='col-8'>{products[i].name}</div>
					<div className='col-4'>x {products[i].amount}</div>
				</div>
			))
		} else if (row === 2) {
			i = products.length > length * 2 ? length : products.length - length
			return this.loop(i).map((item, i) => (
				<div className='col-12 row'>
					<div className='col-8'>{products[i].name}</div>
					<div className='col-4'>x 5</div>
				</div>
			))
		}
	}
	totalPrice = () => {
		let total = 0
		this.props.products.forEach((item) => {
			total += item.amount * item.price
		})
		return total
	}

	convertTime = (time) => {
		let date = new Date(time)
		return `${date.getDate()}/${
			Number(date.getMonth()) + 1
		}/${date.getFullYear()}`
	}
	render() {
		return (
			<div>
				{/* list */}
				<div className='card my-1'>
					<div className='card-body row'>
						<div className='col-3'>
							{/* <small className='text-info'>Customer</small>
							<h6>{this.props.customer_name}</h6> */}
							<table>
								<tr>
									<h5 className='text-info mb-1'>Pelanggan</h5>
								</tr>
								<tr>
									<td>
										<small className='text-dark'>Nama</small>
									</td>
									<td colSpan='3'>
										<small className='text-dark'>{this.props.name}</small>
									</td>
								</tr>
								<tr>
									<td>
										<small className='text-dark'>Nomer</small>
									</td>
									<td colSpan='3'>
										<small className='text-dark'>{this.props.phone}</small>
									</td>
								</tr>
								<tr>
									<td>
										<small className='text-dark'>Alamat</small>
									</td>
									<td colSpan='3'>
										<small className='text-dark'>{this.props.address}</small>
									</td>
								</tr>
							</table>
						</div>
						<div className='col-7'>
							<h5 className='text-info mb-1'>Products</h5>
							<div className='row'>
								<div className='col-6 row'>{this.productsLooping(1)}</div>
								<div className='col-6 row align-self-start'>
									{this.productsLooping(2)}
								</div>
							</div>
						</div>

						<div className='col-2'>
							<div>
								<small className='text-bold text-info'>
									Time: {this.convertTime(this.props.date)}
								</small>
								<button
									className='btn btn-sm btn-block btn-success'
									onClick={this.props.detail}
								>
									Details
								</button>
							</div>
							<div className='mt-2'>
								<small className='text-info'>Total Amount</small>
								<h6 className='text-danger'>
									Rp {price(this.totalPrice().toString())}
								</h6>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default transactionsList
