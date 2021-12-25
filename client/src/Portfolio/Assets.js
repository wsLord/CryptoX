import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import bitimg from "../shared/img/bit.jpg";
import AuthContext from "../store/authContext";
import Styles from "./Portfolio.module.css";

const Assets = ({ onAlert }) => {
	const ctx = useContext(AuthContext);
	const history = useHistory();

	const [coinsList, setCoinsList] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch id and amount of coins in assets from database
				let { data } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/user/assets`,
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setCoinsList(data);
			} catch (err) {
				console.log(err.response.data.message);
				// onAlert(err.response.data.message);
			}
		};

		fetchData();
	}, [ctx]); //, onAlert

	return (
		<div>
			<div className="card">
				<div className="card-header">
					<h3>Your assets</h3>
				</div>
				<div className="card-body">
					{coinsList.length > 0 && (
						<table className="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Asset</th>
									<th scope="col">Quantity</th>
									<th scope="col">Current Price</th>
									<th scope="col">Purchase Price</th>
									<th scope="col">Profit/Loss (%)</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								{coinsList.map((element) => {
									return (
										<tr key={element.sNo}>
											<th scope="row">{element.sNo}</th>
											<td>
												<span>
													<img src={element.image.small} alt="" />{" "}
													{element.name}
												</span>
											</td>
											<td>
												<p>
													{element.quantity} {element.symbol}
												</p>
											</td>
											<td>
												&#8377; {element.currentPrice.Rupees}.
												{element.currentPrice.Paise}
											</td>
											<td>
												&#8377; {element.purchasePrice.Rupees}.
												{element.purchasePrice.Paise}
											</td>
											{element.changePercentage < 0 && (
												<td className="text-danger">
													{element.changePercentage} %{" "}
													<i className="fa fa-caret-down"></i>
												</td>
											)}
											{element.changePercentage >= 0 && (
												<td className="text-success">
													{element.changePercentage} %{" "}
													<i className="fa fa-caret-up"></i>
												</td>
											)}
											<td>
												<button
													type="button"
													className="btn btn-success"
													onClick={() => {
														history.push(`/coins/${element.id}`);
													}}
												>
													Sell
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
					{coinsList.length === 0 && (
						<div className="d-flex flex-column justify-content-center align-items-center">
							<img src={bitimg} className={Styles.bitcoin} alt="" />
							<h4>Get started with crypto</h4>
							<h6 className="text-secondary">
								Your crypto assets will appear here.
							</h6>
							<a className="btn btn-success m-10" href="/list">
								Explore
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Assets;
