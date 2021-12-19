import React, { Fragment, useContext, useEffect, useRef } from "react";
import axios from "axios";

import AuthContext from "../store/authContext";
import Styles from "./Portfolio.module.css";
import Logo from "../shared/img/icon.png";

const AddMoney = (props) => {
	const ctx = useContext(AuthContext);

	const inputRefAmount = useRef();

	useEffect(() => {
		// Loading RazorPay SDK
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const checkoutHandler = async (response, transactionID) => {
		console.log("TID: "+ transactionID);
		if (response.error) {
			console.log("Payment Failed ", response.error.description);

			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/payment/failed`,
					{
						transaction_id: transactionID,
						razorpay_payment_id: response.error.metadata.payment_id,
						razorpay_order_id: response.error.metadata.order_id,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				// Show error and others
				console.log(data);
			} catch (err) {
				// Unable to log info
				console.log(err);
			}

			// show message also
			return;
		}

		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/payment/capture`,
				{
					...response,
					transaction_id: transactionID,
				},
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			// Show new payment page with deatils
			console.log(data);

		} catch (err) {
			// Something went wrong! 400/500 Response
			console.log(err.response);
		}

		// console.log(response);
		alert(response.razorpay_payment_id);
		alert(response.razorpay_order_id);
		alert(response.razorpay_signature);
	};

	const razorpayPaymentHandler = async (event) => {
		event.preventDefault();

		const enteredAmount = inputRefAmount.current.value;

		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/payment/order`,
				{
					amount: enteredAmount,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			const options = {
				key: process.env.REACT_APP_RAZORPAY_KEY_ID,
				currency: data.currency,
				amount: data.amount,
				name: "CryptoX",
				description: "Adding money to Wallet",
				image: Logo,
				order_id: data.id,
				handler: (response) => {checkoutHandler(response, data.receipt)},
				prefill: {
					name: data.userDetails.name,
					email: data.userDetails.email,
					contact: data.userDetails.mobile,
				},
				theme: {
					color: "#515967",
				},
			};

			const rzpwindow = new window.Razorpay(options);
			rzpwindow.open();
		} catch (err) {
			// Something went wrong! 400/500 Response
			console.log(err);
		}
	};

	return (
		<Fragment>
			<div className="card">
				<div className="card-header">
					<h3>Add Money</h3>
				</div>
				<div className="card-body d-flex justify-content-center">
					<form
						className="card shadow p-3 mb-5 bg-body rounded"
						id={Styles.addMoney}
						onSubmit={razorpayPaymentHandler}
					>
						<label htmlFor="amount" className="form-label">
							Amount
						</label>
						<div className="input-group mb-3">
							<span className="input-group-text">&#8377;</span>
							<input
								type="number"
								className="form-control"
								defaultValue="100"
								id="amount"
								min="100"
								max="100000"
								ref={inputRefAmount}
								required
							/>
							<span className="input-group-text">.00</span>
						</div>
						<button type="submit" className="btn btn-success">
							<strong>ADD</strong>
						</button>
					</form>
				</div>
			</div>
			<br />
		</Fragment>
	);
};

export default AddMoney;
