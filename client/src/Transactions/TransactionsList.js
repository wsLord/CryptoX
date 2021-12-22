import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";

import img from "../shared/img/history.jpg";
import AuthContext from "../store/authContext";
import Alert from "../shared/components/Alert";
import Styles from "./Transaction.module.css";

const TransactionsList = () => {
	const ctx = useContext(AuthContext);

	const [error, setError] = useState(null);
	const [transactionList, setTransactionList] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/transaction/data`,
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setTransactionList(data);
			} catch (err) {
				console.log(err);
				setError("Something went wrong!");
			}
		};

		fetchData();
	}, [ctx]);

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div className="card m-5">
				<h2 className="card-header text-start bg-light.bg-gradient">
					<img src={img} alt="" id={Styles.img} /> Transaction History
				</h2>
				<div className="card-body">
					{transactionList.length === 0 && <h4>Very lonely here...</h4>}
					{transactionList.length > 0 && (
						<table className="table fs-5">
							<thead>
								<tr>
									<th scope="col">Type</th>
									<th scope="col">Date/Time</th>
									<th scope="col">Status</th>
									<th scope="col">Coin Type</th>
									<th scope="col">Amount (&#8377;)</th>
								</tr>
							</thead>
							<tbody>
								{transactionList.slice(0).reverse().map((element) => {
									let tType, tDate, isPlus, tAmount, isSuccess, tStatus, tCoinID;
									if (element.category === "add_money") {
										tType = "Add Money";
										tDate = element.addMoney.updatedAt;
										isPlus = true;
										isSuccess = element.addMoney.status === "SUCCESS";
										tStatus = element.addMoney.status;
										tAmount =
											"+ " +
											element.addMoney.amount.slice(0, -2) +
											"." +
											element.addMoney.amount.slice(-2);
										tCoinID = "-";
									} else if (element.category === "buy_coin") {
										tType = "Buy";
										tDate = element.buyCoin.updatedAt;
										isPlus = false;
										isSuccess = element.buyCoin.status === "SUCCESS";
										tStatus = element.buyCoin.status;
										tAmount =
											"- " +
											element.buyCoin.amount.slice(0, -2) +
											"." +
											element.buyCoin.amount.slice(-2);
										tCoinID = element.buyCoin.coinid;
									} else if (element.category === "sell_coin") {
										tType = "Sell";
										tDate = element.sellCoin.updatedAt;
										isPlus = true;
										isSuccess = element.sellCoin.status === "SUCCESS";
										tStatus = element.sellCoin.status;
										tAmount =
											"+ " +
											element.sellCoin.amount.slice(0, -2) +
											"." +
											element.sellCoin.amount.slice(-2);
										tCoinID = element.sellCoin.coinid;
									} else if (element.category === "buy_request") {
										tType = "Buy Request";
										tDate = element.buyRequest.updatedAt;
										isPlus = true;
										isSuccess = element.buyRequest.status === "SUCCESS";
										tStatus = element.buyRequest.status;
										tAmount = "-"; //"+ " + element.buyRequest.amount.slice(0, -2) + "." + element.buyRequest.amount.slice(-2);
										tCoinID = element.buyRequest.coinid;
									} else if (element.category === "sell_request") {
										tType = "Sell Request";
										tDate = element.sellRequest.updatedAt;
										isPlus = true;
										isSuccess = element.sellRequest.status === "SUCCESS";
										tStatus = element.sellRequest.status;
										tAmount = "-"; //"+ " + element.sellRequest.amount.slice(0, -2) + "." + element.sellRequest.amount.slice(-2);
										tCoinID = element.sellRequest.coinid;
									} else if (element.category === "withdraw_money") {
										tType = "Withdraw Money";
										tDate = element.withdrawMoney.updatedAt;
										isPlus = false;
										isSuccess = element.withdrawMoney.status === "SUCCESS";
										tStatus = element.withdrawMoney.status;
										tAmount =
											"- " +
											element.withdrawMoney.amount.slice(0, -2) +
											"." +
											element.withdrawMoney.amount.slice(-2);
										tCoinID = "-";
									}

									console.log(tDate);

									return (
										<tr>
											<td className="fw-bold">{tType}</td>
											<td>{new Date(tDate).toString().slice(0, -31)}</td>
											{isSuccess && (
												<td className="text-success fw-bold">Success</td>
											)}
											{!isSuccess && (
												<td className="text-danger fw-bold">
													{tStatus.charAt(0) + tStatus.toLowerCase().slice(1)}
												</td>
											)}
											<td>{tCoinID}</td>
											{tAmount === "-" ? (
												<td className="fw-bold">{tAmount}</td>
											) : isPlus ? (
												<td className="text-success fw-bold">{tAmount}</td>
											) : (
												<td className="text-danger fw-bold">{tAmount}</td>
											)}
											<td>
												<button
													type="button"
													className="btn btn-light bg-transparent"

												>
													<i className="fa fa-chevron-right"></i>
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default TransactionsList;
