import React, { useRef, useState, useContext } from "react";
import axios from "axios";

import AuthContext from "../store/authContext";

const CoinOrder = ({ onError, coinid }) => {
	const ctx = useContext(AuthContext);

	const [transactionMode, setTransactionMode] = useState("buy");
	const inputRefQuantity = useRef();
	const inputRefTriggerPrice = useRef();

	const transactionModeHandler = (event) => {
		setTransactionMode(event.target.value);
	};

	const orderHandler = async (event) => {
		event.preventDefault();

		try {
			let data;
			if (transactionMode === "buy") {
				const res = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/transaction/buyLimit`,
					{
						quantity: inputRefQuantity.current.value,
						coinid: coinid,
						maxPrice: inputRefTriggerPrice.current.value,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				data = res.data;
			} else if (transactionMode === "sell") {
				const res = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/transaction/sellLimit`,
					{
						quantity: inputRefQuantity.current.value,
						coinid: coinid,
						minPrice: inputRefTriggerPrice.current.value,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				data = res.data;
			}

			console.log(data);

			// Success
			onError("Limit Order succesfully created. Goto Orders section to view.")
		} catch (err) {
			console.log(err.response.data.message);
			onError(err.response.data.message);
		}
	};

	return (
		<div className="m-4">
			<form className="d-flex flex-column" action="" onSubmit={orderHandler}>
				<label htmlFor="type" className="form-label h4 text-start mt-2">
					Transaction type
				</label>
				<div className="d-flex justify-content-evenly">
					<div className="form-check form-check-inline fs-4">
						<input
							className="form-check-input"
							type="radio"
							name="type"
							id="buy"
							value="buy"
							onChange={transactionModeHandler}
							defaultChecked
						/>
						<label className="form-check-label" for="buy">
							Buy
						</label>
					</div>
					<div className="form-check form-check-inline  fs-4">
						<input
							className="form-check-input"
							type="radio"
							name="type"
							id="sell"
							value="sell"
							onChange={transactionModeHandler}
						/>
						<label className="form-check-label" for="sell">
							Sell
						</label>
					</div>
				</div>

				<label htmlFor="coin" className="form-label h4 text-start mt-2">
					Quantity
				</label>
				<input
					type="number"
					className="form-control mt-2"
					id="coin"
					min={0}
					ref={inputRefQuantity}
					required
				/>
				<label htmlFor="price" className="form-label h4 text-start mt-2">
					Trigger Price
				</label>
				<div className="input-group">
					<span className="input-group-text fs-5 mt-2">&#8377;</span>
					<input
						type="number"
						className="form-control mt-2"
						id="price"
						min={0}
						ref={inputRefTriggerPrice}
						required
					/>
				</div>
				<button type="submit" className="btn btn-success mt-4 fs-5">
					Place Order
				</button>
			</form>
		</div>
	);
};

export default CoinOrder;
