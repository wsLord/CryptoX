import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Styles from "./Transaction.module.css";
import success from "../shared/img/success.png";
import failed from "../shared/img/failed.png";
import Alert from "../shared/components/Alert";
import AuthContext from "../store/authContext";

const AddMoneyDetails = (props) => {
	const ctx = useContext(AuthContext);
	const tid = props.location.state.tid;

	const [error, setError] = useState(null);
	const [transaction, setTransaction] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/transaction/data`,
					{
						tid,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setTransaction(data);
			} catch (err) {
				console.log(err.response.data);
				setError("Something went wrong!");
			}
		};

		fetchData();
	}, [ctx, tid]);

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div class="card m-5 shadow p-3 mb-5 bg-body rounded">
				<div class="card-body">
					{transaction.isSuccess && (
						<div>
							<img src={success} alt="" id={Styles.simg} />
							{transaction.category === "add_money" && (
								<p className="text-primary h5">Added Amount</p>
							)}
							{transaction.category === "withdraw_money" && (
								<p className="text-primary h5">Withdrawal Amount</p>
							)}
							<p className="h3">&#8377; {transaction.amount}</p>
							<p className="mx-auto h5" id={Styles.tid}>
								Transaction ID:{" "}
								<span className="text-secondary">{transaction.id}</span>
							</p>
							<p className="text-secondary h6">
								{new Date(transaction.updatedAt).toString().slice(0, -31)}
							</p>
							<div class="card" id={Styles.details}>
								<div class="card-body d-flex flex-column align-items-start">
									<p className="h5">Status: </p>
									<p className="fs-6 text-secondary">{transaction.status}</p>
									<p className="h5">RazorPay Order ID: </p>
									<p className="fs-6 text-secondary">
										{transaction.razorpay_order_id}
									</p>
									<p className="h5">Verified Payment: </p>
									<p className="fs-6 text-secondary">
										{transaction.verified_payment} <i class="fa fa-check text-success"></i>
									</p>
								</div>
							</div>
							<Link className="btn btn-success mt-2 fs-5" to="/transactions">Back to Transactions</Link>
						</div>
					)}
					{!transaction.isSuccess && (
						<div>
							<img src={failed} alt="" id={Styles.simg} />
							{transaction.category === "add_money" && (
								<p className="text-primary h5">Added Amount</p>
							)}
							{transaction.category === "withdraw_money" && (
								<p className="text-primary h5">Withdrawal Amount</p>
							)}
							<p className="h3">&#8377; {transaction.amount}</p>
							<p className="mx-auto h5" id={Styles.tid}>
								Transaction ID:{" "}
								<span className="text-secondary">
									{transaction.id}
								</span>
							</p>
							<p className="text-secondary h6">
							{new Date(transaction.updatedAt).toString().slice(0, -31)}
							</p>
							<div class="card" id={Styles.details}>
								<div class="card-body d-flex flex-column align-items-start">
								<p className="h5">Status: </p>
									<p className="fs-6 text-secondary">{transaction.status}</p>
									<p className="h5">RazorPay Order ID: </p>
									<p className="fs-6 text-secondary">
										{transaction.razorpay_order_id}
									</p>
									<p className="h5">Other Info: </p>
									<p className="fs-6 text-secondary">
										{transaction.statusMessage}
									</p>
								</div>
							</div>
							<Link className="btn btn-danger mt-2 fs-5" to="/transactions">Back to Transactions</Link>
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default AddMoneyDetails;
