import React, { Component } from "react"
import { Link } from "react-router-dom"
import $ from "jquery"

export class navbar extends Component {
	componentDidMount() {
		$(`.nav-link:eq(${this.props.active})`).addClass("active")
	}
	render() {
		return (
			<nav class='navbar navbar-dark bg-dark navbar-expand-lg'>
				<a class='navbar-brand' href='#'>
					<img
						src={process.env.PUBLIC_URL + "/SumberBeningWhiteLogo.svg"}
						width='30'
						height='30'
						class='d-inline-block align-top mr-3'
						alt=''
					/>
					{/* Sumber Bening */}
				</a>
				<div id='menu' className='navbar-collapse collpase'>
					<ul className='navbar-nav mr-auto'>
						<li className='nav-item'>
							<Link to='/' className='nav-link'>
								Daftar Harga
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/transaction' className='nav-link'>
								Transaksi
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/transactionList' className='nav-link'>
								Daftar Transaksi
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		)
	}
}

export default navbar
