import React, { Fragment, useContext } from "react";
import axios from "axios";

import AuthContext from "../store/authContext";
import Styles from "./Portfolio.module.css";
import Logo from "../shared/img/icon.png";

const AddMoney = (props) => {
	const ctx = useContext(AuthContext);

	const inputRefAmount = useRef();

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const checkoutHandler = (response) => {
		if(response.error) {
			console.log("Payment Failed ", response.error.description);
			return;
		}

		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/payment/capture`,
				{
					data: response,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + ctx.token,
					},
				}
			);
		}
	catch (err) {
		// Something went wrong! 400/500 Response
		console.log(err);
	}
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
				handler: checkoutHandler,
				prefill: {
					name: data.userDetails.name,
					email: data.userDetails.email,
					contact: data.userDetails.mobile,
				},
				theme: {
					color: "#515967",
				},
			};

			console.log(responseData.message);
		} catch (err) {
			// Something went wrong! 400/500 Response
			console.log(err);
		}

		const API_URL = `http://localhost:5000/razorpay/`;
		const orderUrl = `${API_URL}order`;
		const response = await Axios.get(orderUrl);
		const { data } = response;
		console.log("App -> razorPayPaymentHandler -> data", data);

		const options = {
			key: "",
			name: "avdojo",
			description: "avodojo",
			order_id: data.id,
			handler: async (response) => {
				try {
					const paymentId = response.razorpay_payment_id;
					const url = `${API_URL}capture/${paymentId}`;
					const captureResponse = await Axios.post(url, {});
					const successObj = JSON.parse(captureResponse.data);
					const captured = successObj.captured;
					console.log("App -> razorPayPaymentHandler -> captured", successObj);
					if (captured) {
						console.log("success");
					}
				} catch (err) {
					console.log(err);
				}
			},
		};

		const rzpwindow = new window.Razorpay(options);
		rzpwindow.open();
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
						<label for="amount" className="form-label">
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
						{/* <div className="mb-3">
							<label for="upi" className="form-label">
								UPI ID
							</label>
							<input type="text" className="form-control" id="upi" required />
						</div> */}
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
