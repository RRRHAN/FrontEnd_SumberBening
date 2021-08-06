import React, { Component } from "react"
import Suggestion from "./suggestion"
import { base_url } from "../js/config"
import axios from "axios"
// import "../style.css"

export class hiddenInput extends Component {
	constructor() {
		super()
		this.state = {
			change: false,
			hover: false,
			activeSuggestion: 0,
			products: [],
		}
	}
	getSuggestion = (ev) => {
		if (this.props.col === "name") {
			if (ev.code === "ArrowUp" || ev.code === "ArrowDown") {
				ev.preventDefault()
				let tempActiveSuggestion = this.state.activeSuggestion
				if (ev.code === "ArrowUp") {
					if (tempActiveSuggestion !== 0) {
						tempActiveSuggestion--
					} else {
						tempActiveSuggestion = this.state.products.length
					}
				} else {
					if (tempActiveSuggestion <= this.state.products.length) {
						tempActiveSuggestion++
					} else {
						tempActiveSuggestion = 1
					}
				}
				this.setState({ activeSuggestion: tempActiveSuggestion })
			}
		}
	}
	selectItem = (code) => {
		if (this.props.col === "name") {
			if (code === "Enter" || code === "click") {
				this.setState({ change: false })
				let index = --this.state.activeSuggestion,
					item = this.state.products[index]
				this.props.selectItem(item)
				this.setState({ change: false })
			}
		}
	}
	getProducts = async (value) => {
		if (this.props.col === "name" && value) {
			let url = base_url + "/product/" + value
			axios
				.get(url)
				.then((response) => {
					this.setState({ products: response.data.products })
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
	componentDidMount() {
		this.getProducts()
	}
	render() {
		if (this.state.change) {
			return (
				<div>
					<input
						style={{
							width: "100%",
						}}
						autoFocus
						type={this.props.type}
						value={this.props.value}
						onChange={this.props.change}
						onBlur={() => {
							if (!this.state.hover) {
								this.setState({ change: false })
							}
						}}
						onKeyDown={(ev) => this.getSuggestion(ev)}
						onKeyUp={(ev) => {
							this.getProducts(ev.target.value)
							this.selectItem(ev.code)
						}}
					/>
					{(() => {
						if (this.props.col == "name") {
							return (
								<div
									style={{
										minHeight: "2rem",
										minWidth: "2rem",
										position: "absolute",
										width: "50%",
										zIndex: 999,
									}}
									className='px-3'
								>
									{this.state.products.map((item, index) => (
										<Suggestion
											name={item.name}
											price={item.price}
											image={item.image[0] ? item.image[0] : "../no_data.svg"}
											active={
												++index == this.state.activeSuggestion ? true : false
											}
											mouseOver={() =>
												this.setState({ activeSuggestion: index, hover: true })
											}
											mouseOut={() =>
												this.setState({ activeSuggestion: 0, hover: false })
											}
											click={() => this.selectItem("click")}
										/>
									))}
								</div>
							)
						}
					})()}
				</div>
			)
		} else if (!this.state.change && this.props.col === "amount") {
			return (
				<div className='row justify-content-center'>
					<div className='col-3'>
						<button
							type='button'
							className='btn btn-danger px-2 btn-sm'
							onClick={this.props.amountDecrement}
						>
							-
						</button>
					</div>
					<div
						className='col-3 text-center'
						style={{ minHeight: "1rem", minWidth: "1rem" }}
						onClick={(ev) => {
							ev.preventDefault()
							this.setState({ change: true })
						}}
					>
						{this.props.value}
					</div>
					<div className='col-3'>
						<button
							type='button'
							className='btn btn-success px-2 btn-sm'
							onClick={this.props.amountIncrement}
						>
							+
						</button>
					</div>
				</div>
			)
		}
		return (
			<div
				style={{ minHeight: "2rem", minWidth: "2rem" }}
				onClick={(ev) => {
					ev.preventDefault()
					this.setState({ change: true })
				}}
			>
				{this.props.value}
			</div>
		)
	}
}

export default hiddenInput
