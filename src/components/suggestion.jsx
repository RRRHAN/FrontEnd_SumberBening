import React, { Component } from "react"
import { base_url } from "../js/config"
import price from "../js/price"

export class Suggestion extends Component {
	divClassName = () => {
		let className = "row border border-dark "
		if (this.props.active) {
			className += "bg-info"
		} else {
			className += "bg-light"
		}
		return className
	}
	render() {
		return (
			<div
				className={this.divClassName()}
				style={{ textAlign: "left", lineHeight: 1.2 }}
				onMouseOver={this.props.mouseOver}
				onMouseOut={this.props.mouseOut}
				onClick={this.props.click}
			>
				<div className='col-1'>
					<img
						src={base_url + "/images/products/" + this.props.image}
						alt='...'
						className='img rounded m-1 mr-2 border border-dark'
						width='50rem'
						height='40rem'
						style={{ objectFit: "contain" }}
					/>
				</div>
				<div className='col-10 ml-4'>
					<p className='d-block m-0'>{this.props.name}</p>
					<sub>Rp. {price(this.props.price.toString())}</sub>
				</div>
			</div>
		)
	}
}

export default Suggestion
