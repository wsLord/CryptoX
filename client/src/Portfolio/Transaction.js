import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import AuthContext from "../store/authContext";

const Transaction = ({ onAlert }) => {
	const ctx = useContext(AuthContext);
	const history = useHistory();

	const [transactionList, setTransactionList] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/transaction/data/list?count=5`,
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setTransactionList(data);
			} catch (err) {
				console.log(err);
				onAlert("Something went wrong!");
			}
		};

		fetchData();
	}, [ctx, onAlert]);

	return (
		<div>
			<div className="card w-100">
				<div className="card-header">
					<h3>Recent Transactions</h3>
				</div>
				<div className="card-body">
					{transactionList.length === 0 && <h4>Very lonely here...</h4>}
					{transactionList.length > 0 && (
						<dir>
							<table className="table fs-6">
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
									{transactionList.map((element) => {
										return (
											<tr>
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
														onClick={() => {
															let path = "/transactions/" + element.tNextPath;
															console.log(path);
															history.push({
																pathname: "/transactions/" + element.tNextPath,
																state: {
																	tid: element.tID,
																},
															});
														}}
													>
														<i className="fa fa-chevron-right"></i>
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							<Link className="btn btn-success d-inline" to="/transactions">
								View more <i className="fa fa-angle-double-right"></i>
							</Link>
						</dir>
					)}
				</div>
			</div>
			<br />
		</div>
	);
};

export default Transaction;
