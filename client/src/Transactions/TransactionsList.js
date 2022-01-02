import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";

import img from "../shared/img/history.jpg";
import AuthContext from "../store/authContext";
import Alert from "../shared/components/Alert";
import Styles from "./Transaction.module.css";
import { useHistory } from "react-router-dom";

const TransactionsList = () => {
	const ctx = useContext(AuthContext);
	const history = useHistory();

	const [error, setError] = useState(null);
	const [transactionList, setTransactionList] = useState([]);
	const [filter, setFilter] = useState("all");

	const filterHandler = (event) => {
		setFilter(event.target.value);
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/transaction/data/list`,
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
					<div className="d-flex flex-row my-3">
						<i class="fa fa-filter fs-2 text-secondary p-1 border-secondary border border-end-0 rounded-start"></i>
						<select class="form-select fs-5 border-secondary w-25 rounded-0 border-start-0 rounded-end" onChange={filterHandler} id={Styles.cursor} aria-label="Default select example">
							<option value="all" selected>ALL</option>
							<option value="Add Money">Add Money</option>
							<option value="Sell">Sell</option>
							<option value="Buy">Buy</option>
							<option value="Send/Receive">Send/Receive</option>
							<option value="Sell Limit">Sell Limit</option>
							<option value="Buy Limit">Buy Limit</option>
							<option value="Exchange">Exchange</option>
						</select>
					</div>
					{transactionList.length === 0 && <h4>Very lonely here...</h4>}
					{transactionList.length > 0 && (
						<table className="table fs-5">
							<thead>
								<tr>
									<th scope="col">Type</th>
									<th scope="col">Date/Time</th>
									<th scope="col">Status</th>
									<th scope="col">Coin ID</th>
									<th scope="col">Amount (&#8377;)</th>
								</tr>
							</thead>
							<tbody>
								{filter === "all" && transactionList.map((element) => {
									return (
										<tr class={Styles.pointer} onClick={() => {
											let path = "/transactions/" + element.tNextPath;
											console.log(path);
											history.push({
												pathname: "/transactions/" + element.tNextPath,
												state: {
													tid: element.tID,
												},
											});
										}}>
											<td className="fw-bold">{element.tType}</td>
											<td>
												{new Date(element.tDate).toString().slice(0, -31)}
											</td>
											{element.isSuccess && (
												<td className="text-success fw-bold">
													{element.tStatus}
												</td>
											)}
											{!element.isSuccess && (
												<td className="text-danger fw-bold">
													{element.tStatus}
												</td>
											)}
											<td className="text-center">{element.tCoinID}</td>
											{element.tAmount === "-" || !element.isSuccess ? (
												<td className="fw-bold">&#8377; {element.tAmount}</td>
											) : element.isPlus ? (
												<td className="text-success fw-bold">
													+ &#8377; {element.tAmount}
												</td>
											) : (
												<td className="text-danger fw-bold">
													- &#8377; {element.tAmount}
												</td>
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
								{filter !== "all" && transactionList.map((element) => {
									if (filter === element.tType) {
										return (
											<tr class={Styles.pointer} onClick={() => {
												let path = "/transactions/" + element.tNextPath;
												console.log(path);
												history.push({
													pathname: "/transactions/" + element.tNextPath,
													state: {
														tid: element.tID,
													},
												});
											}}>
												<td className="fw-bold">{element.tType}</td>
												<td>
													{new Date(element.tDate).toString().slice(0, -31)}
												</td>
												{element.isSuccess && (
													<td className="text-success fw-bold">
														{element.tStatus}
													</td>
												)}
												{!element.isSuccess && (
													<td className="text-danger fw-bold">
														{element.tStatus}
													</td>
												)}
												<td className="text-center">{element.tCoinID}</td>
												{element.tAmount === "-" || !element.isSuccess ? (
													<td className="fw-bold">&#8377; {element.tAmount}</td>
												) : element.isPlus ? (
													<td className="text-success fw-bold">
														+ &#8377; {element.tAmount}
													</td>
												) : (
													<td className="text-danger fw-bold">
														- &#8377; {element.tAmount}
													</td>
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
										)
									}
									return (<></>)
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
