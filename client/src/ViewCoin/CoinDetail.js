import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Order from "./Order"
import Styles from "./CoinDetail.module.css";
import Overview from "./Overview";
import Alert from "../shared/components/Alert";
import AuthContext from "../store/authContext";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const CoinDetail = () => {
	const ctx = useContext(AuthContext);

	const { coinid } = useParams();

	const [modes, setModes] = useState({
		buy: "nav-link active",
		sell: "nav-link",
		order: "nav-link",
	});
	const [visibility, setVisibility] = useState({
		buy: "d-block",
		sell: "d-none",
		order: "d-none",
	});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [coinData, setCoinData] = useState(null);
	const [walletBalance, setWalletBalance] = useState({
		Rupees: "...",
		Paise: "..",
	});
	const [isInWatchList, setIsInWatchList] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

			try {
				let { data: coinData } = await CoinGeckoClient.coins.fetch(coinid, {
					tickers: false,
					community_data: false,
					developer_data: false,
					sparkline: false,
				});

				let { data: userData } = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/user/data`,
					{
						balance: true,
						isInWatchList: coinid,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				setCoinData(coinData);
				setWalletBalance(userData.balance);
				setIsInWatchList(userData.isInWatchList);
			} catch (err) {
				console.log(err);
				setError("Something went wrong!");
			}
		};

		fetchData();
	}, [ctx, coinid]);

	const onClickBuy = () => {
		setModes({
			buy: "nav-link active",
			sell: "nav-link",
			order: "nav-link",
		});
		setVisibility({
			buy: "d-block",
			sell: "d-none",
			order: "d-none",
		});
	};

	const onClickSell = () => {
		setModes({
			buy: "nav-link",
			sell: "nav-link active",
			order: "nav-link",
		});
		setVisibility({
			buy: "d-none",
			sell: "d-block",
			order: "d-none",
		});
	};
	const onClickOrder = () => {
		setModes({
			buy: "nav-link",
			sell: "nav-link",
			order: "nav-link active",
		});
		setVisibility({
			buy: "d-none",
			sell: "d-none",
			order: "d-block",
		});
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div>
				<div className="card m-3">
					<div className="card-body d-flex justify-content-between">
						<div className="title d-flex align-items-center">
							<img
								className={Styles.logo}
								src="https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png"
								alt=""
							/>
							<h1>Bitcoin </h1>
							<p className="sym text-secondary h3"> (BTC)</p>
						</div>
						<button type="button" className="btn btn-outline-secondary">
							{isInWatchList && (
								<p className="fa fa-star-o h4"> Remove from Watchlist</p>
							)}
							{!isInWatchList && (
								<p className="fa fa-star-o h4"> Add to Watchlist</p>
							)}
						</button>
					</div>
				</div>
				<div className="main m-3 p-1 d-flex justify-content-between">
					<div className="card col-8" id={Styles.overview}>
						<div className="card-header h3 text-start">Overview</div>
						<div className="card-body">
							<Overview coin="bitcoin" />
						</div>
					</div>
					<div className="col-4 p-10">
						<div className="card">
							<div className="card-header h3 text-start">Assets</div>
							<div className="card-body">
								<p className="text-secondary h3">Total BTC:100</p>
								<p className="text-secondary h3">
									Total price :&#x20B9; 22939.1991
								</p>
								<p className="text-secondary h3">Profit/Loss :10%</p>
							</div>
						</div>
						<div className="card" id={Styles.options}>
							<div className="card-body">
								<ul className="nav nav-tabs d-flex" id={Styles.tabs}>
									<li className="nav-item h3">
										<button className={modes.buy} onClick={onClickBuy}>
											Buy
										</button>
									</li>
									<li className="nav-item h3">
										<button className={modes.sell} onClick={onClickSell}>
											Sell
										</button>
									</li>
									<li className="nav-item h3">
										<button className={modes.order} onClick={onClickOrder}>
											Order
										</button>
									</li>
								</ul>
								<div className={visibility.buy}>
									<p className="text-end text-primary">
										Wallet Balance: &#x20B9; {walletBalance.Rupees}.
										{walletBalance.Paise}
									</p>
									<form
										className="d-flex flex-column"
										action=""
										method="get"
										id={Styles.buyform}
									>
										<label htmlFor="amount" className="form-label h4 text-start">
											Pay(&#x20B9;)
										</label>
										<div className="input-group mb-3">
											<input
												type="number"
												className="form-control w-75"
												id="amount"
												min={0}
											/>
											<span className="input-group-text">
												<p className="h6">.</p>
											</span>
											<input
												type="number"
												className="form-control"
												id="decimal"
												min={0}
											/>
										</div>
										<label htmlFor="coin" className="form-label h4 text-start">
											Coins
										</label>
										<input
											type="number"
											className="form-control"
											id="coin"
											min={0}
										/>
										<button
											type="button"
											className="btn btn-success"
											id={Styles.submit}
										>
											Buy BTC
										</button>
									</form>
								</div>
								<div className={visibility.sell}>
									<p className="text-end text-primary">
										Available 100 BTC in Assets
									</p>
									<form
										className="d-flex flex-column"
										action=""
										method="get"
										id={Styles.sellform}
									>
										<label htmlFor="coin" className="form-label h4 text-start">
											Coins
										</label>
										<input
											type="number"
											className="form-control"
											id="coin"
											min={0}
										/>
										<label className="form-label h4 mt-3 text-start">
											Eqivalent currency amount
										</label>
										<div className="input-group mb-3">
											<span className="input-group-text">&#x20B9;</span>
											<input
												type="text"
												className="form-control"
												value={1233}
												readOnly
											/>
											<span className="input-group-text">.56</span>
										</div>
										<button
											type="button"
											className="btn btn-success"
											id={Styles.submit}
										>
											Sell BTC
										</button>
									</form>
								</div>
								<div className={visibility.order}>
									<Order />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default CoinDetail;
