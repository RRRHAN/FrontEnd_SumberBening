import React, { Component } from "react"
import { base_url } from "../js/config"

export class card extends Component {
	render() {
		return (
			<div class='card mb-3 border'>
				<div class='row no-gutters'>
					<div class='col-md-4 p-3'>
						<img
							src={base_url + "/images/products/" + this.props.image}
							alt='...'
							className='img rounded'
							width='100'
							height='100'
							style={{ objectFit: "contain" }}
						/>
					</div>
					<div class='col-md-8'>
						<div class='card-body'>
							<h5 class='card-title'>{this.props.name}</h5>
							<p class='card-text'>Rp. {this.props.price}</p>
							<div class='row'>
								<div className='col d-flex justify-content-end'>
									<button
										className='btn btn-sm btn-info m-1 text-light'
										onClick={this.props.details}
									>
										Detail
										<img
											src={process.env.PUBLIC_URL + "/chevrons-right.svg"}
											alt='search'
											style={{ objectFit: "cover" }}
										/>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default card
