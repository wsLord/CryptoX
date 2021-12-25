import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import OrderCoin from "./OrderCoin";
import Styles from "./CoinDetail.module.css";
import Overview from "./Overview";
import Alert from "../shared/components/Alert";
import AuthContext from "../store/authContext";
import Logo from "../shared/img/icon.png";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import BuyCoin from "./BuyCoin";

const CoinDetail = () => {
	const ctx = useContext(AuthContext);

	const { coinid } = useParams();

	// View States Defined
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

	const [sellMode, setSellMode] = useState({
		inrValue: "",
		coinValue: "",
		inr: true,
		coin: false,
	});
	const [isLoading, setIsLoading] = useState(false);

	// Data States Defined
	const [error, setError] = useState(null);
	const [isCoinDataLoaded, setIsCoinDataLoaded] = useState(false);
	const [coinData, setCoinData] = useState({
		name: "Coin",
		symbol: "CPX",
		market_data: {
			current_price: { inr: 100 },
			price_change_percentage_24h: 0,
		},
		image: { large: Logo },
	});
	const [assetData, setAssetData] = useState({
		isAvailable: false,
		quantity: "0.00",
	});
	const [walletBalance, setWalletBalance] = useState({
		Rupees: "...",
		Paise: "..",
	});
	const [isInWatchList, setIsInWatchList] = useState(true);

	// UI Functions
	const onClickSellValue = (event) => {
		if (sellMode.inr) {
			setSellMode({
				inrValue: event.target.value,
				coinValue: "",
				inr: true,
				coin: false,
			});
		} else {
			setSellMode({
				inrValue: "",
				coinValue: event.target.value,
				inr: false,
				coin: true,
			});
		}
	};
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

	// Load on first time page render
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

			try {
				let { data: assetData } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/user/assets/${coinid}`,
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

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

				console.log(assetData, userData);

				setCoinData(assetData.coinData);
				setIsCoinDataLoaded(true);
				setAssetData(assetData);
				setWalletBalance(userData.balance);
				setIsInWatchList(userData.isInWatchList);
			} catch (err) {
				console.log(err.response);
				setError("Something went wrong!");
			}
		};

		fetchData();
	}, [ctx, coinid]);

	// Data Handling Functions

	const convertSell = () => {
		const price = coinData.market_data.current_price.inr;
		if (sellMode.inr) {
			const coinvalue = sellMode.inrValue / price;
			setSellMode({
				inrValue: "",
				coinValue: coinvalue,
				inr: false,
				coin: true,
			});
		} else {
			const inrvalue = sellMode.coinValue * price;
			setSellMode({
				inrValue: inrvalue,
				coinValue: "",
				inr: true,
				coin: false,
			});
		}
	};

	const addToWatchList = async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/user/watchlist/add/${coinid}`,
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			setIsInWatchList(true);
		} catch (err) {
			console.log(err.response.data.message);
			setError(err.response.data.message);
		}
	};
	const removeFromWatchList = async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/user/watchlist/remove/${coinid}`,
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			setIsInWatchList(false);
		} catch (err) {
			console.log(err.response.data.message);
			setError(err.response.data.message);
		}
	};

	const onError = (msg) => {
		setError(msg);
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
							<img className={Styles.logo} src={coinData.image.large} alt="" />
							<h1>{coinData.name} </h1>
							<p className="sym text-secondary h3">
								{coinData.symbol.toUpperCase()}
							</p>
						</div>
						{isInWatchList && (
							<button
								type="button"
								className="btn btn-secondary"
								onClick={removeFromWatchList}
							>
								<p className="fa fa-star h4"> Remove from Watchlist</p>
							</button>
						)}
						{!isInWatchList && (
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={addToWatchList}
							>
								<p className="fa fa-star-o h4"> Add to Watchlist</p>
							</button>
						)}
					</div>
				</div>
				<div className="main m-3 p-1 d-flex justify-content-between">
					<div className="card col-8" id={Styles.overview}>
						<div className="card-header h3 text-start">Overview</div>
						<div className="card-body">
							<Overview
								id={coinid}
								coinData={isCoinDataLoaded ? coinData : null}
							/>
						</div>
					</div>
					<div className="col-4 p-10">
						<div className="card">
							<div className="card-header h3 text-start">Assets</div>
							{assetData.isAvailable && (
								<div className="card-body m-3">
									<div className="d-flex justify-content-between">
										<h4>Quantity Available:</h4>
										<p className="text-secondary fs-4">
											{assetData.quantity} {coinData.symbol.toUpperCase()}
										</p>
									</div>
									<div className="d-flex justify-content-between">
										<h4>Purchase Price:</h4>
										<p className="text-secondary fs-4">
											&#x20B9; {assetData.purchasePrice}
										</p>
									</div>
									<div className="d-flex justify-content-between">
										<h4>Profit/Loss:</h4>
										<p className="text-secondary fs-4">
											{assetData.changePercentage}%
										</p>
									</div>
								</div>
							)}
							{!assetData.isAvailable && (
								<div className="card-body text-start">
									<p className="text-dark h4">No Assets</p>

									<p className="text-secondary fs-5">
										Looks like there isn't any{" "}
										<b>{coinData.symbol.toUpperCase()}</b> in your account yet.
										<br />
										CryptoX is the easiest place to get started.
									</p>
								</div>
							)}
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
									<BuyCoin
										walletBalance={walletBalance}
										coinData={coinData}
										onError={onError}
									/>
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
										<div class="input-group mb-3">
											{sellMode.inr && (
												<>
													<span class="input-group-text border-0 bg-white fs-3">
														&#x20B9;
													</span>
													<input
														type="text"
														class="form-control border-0 fs-3"
														placeholder="INR"
														value={sellMode.inrValue}
														onChange={onClickSellValue}
													/>
												</>
											)}
											{sellMode.coin && (
												<>
													<input
														type="text"
														class="form-control border-0 fs-3"
														placeholder={coinData.name}
														value={sellMode.coinValue}
														onChange={onClickSellValue}
													/>
													<span class="input-group-text border-0 bg-white fs-3">
														{coinData.symbol.toUpperCase()}
													</span>
												</>
											)}
											<button
												class="btn btn-outline-white"
												type="button"
												id="button-addon2"
												onClick={convertSell}
											>
												<i class="fa fa-exchange fs-4"></i>
											</button>
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
									<OrderCoin />
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
