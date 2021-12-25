import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Order from "./Order";
import Styles from "./CoinDetail.module.css";
import Overview from "./Overview";
import Alert from "../shared/components/Alert";
import AuthContext from "../store/authContext";
import Logo from "../shared/img/icon.png";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

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
	const [coinData, setCoinData] = useState({
		coinName: "Coin",
		coinSymbol: "CPX",
		coinIcon: Logo,
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

	const [buyMode, setbuyMode] = useState({
		inrValue: "",
		coinValue: "",
		inr: true,
		coin: false
	})
	const handlebuyValue = (event) => {
		if (buyMode.inr) {
			setbuyMode({
				inrValue: event.target.value,
				coinValue: "",
				inr: true,
				coin: false
			});
		}
		else {
			setbuyMode({
				inrValue: "",
				coinValue: event.target.value,
				inr: false,
				coin: true
			});
		}
	}

	const convertBuy = () => {
		const price = 12;   // set real price here peleanshu bhai
		if (buyMode.inr) {
			const coinvalue = buyMode.inrValue / price;
			setbuyMode({
				inrValue: "",
				coinValue: coinvalue,
				inr: false,
				coin: true
			});
		}
		else {
			const inrvalue = buyMode.coinValue * price;
			setbuyMode({
				inrValue: inrvalue,
				coinValue: "",
				inr: true,
				coin: false
			});
		}
	}

	const [sellMode, setsellMode] = useState({
		inrValue: "",
		coinValue: "",
		inr: true,
		coin: false
	})
	const handlesellValue = (event) => {
		if (sellMode.inr) {
			setsellMode({
				inrValue: event.target.value,
				coinValue: "",
				inr: true,
				coin: false
			});
		}
		else {
			setsellMode({
				inrValue: "",
				coinValue: event.target.value,
				inr: false,
				coin: true
			});
		}
	}

	const convertSell = () => {
		const price = 12;   // set real price here peleanshu bhai
		if (sellMode.inr) {
			const coinvalue = sellMode.inrValue / price;
			setsellMode({
				inrValue: "",
				coinValue: coinvalue,
				inr: false,
				coin: true
			});
		}
		else {
			const inrvalue = sellMode.coinValue * price;
			setsellMode({
				inrValue: inrvalue,
				coinValue: "",
				inr: true,
				coin: false
			});
		}
	}

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

				setAssetData(assetData);
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
	const setCoinDetails = (data) => {
		setCoinData(data);
	}

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

	const buyCoinHandler = async () => { };

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
							<img className={Styles.logo} src={coinData.Icon} alt="" />
							<h1>{coinData.name}</h1>
							<p className="sym text-secondary h3">{coinData.symbol}</p>
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
							<Overview coin={coinid} setCoinDetails={setCoinDetails} />
						</div>
					</div>
					<div className="col-4 p-10">
						<div className="card">
							<div className="card-header h3 text-start">Assets</div>
							{assetData.isAvailable && (
								<div className="card-body m-3">
									<div className="d-flex justify-content-between">
										<h4>Quantity Available:</h4>
										<p className="text-secondary fs-4">{assetData.quantity} {coinData.symbol}</p>
									</div>
									<div className="d-flex justify-content-between">
										<h4>Purchase Price:</h4>
										<p className="text-secondary fs-4">&#x20B9; {assetData.purchasePrice}</p>
									</div>
									<div className="d-flex justify-content-between">
										<h4>Profit/Loss:</h4>
										<p className="text-secondary fs-4">{assetData.changePercentage}%</p>
									</div>
								</div>
							)}
							{!assetData.isAvailable && (
								<div className="card-body text-start">
									<p className="text-dark h4">No Assets</p>

									<p className="text-secondary fs-5">
										Looks like there isn't any <b>{coinData.symbol}</b> in your
										account yet.
									</p>
									<p className="text-secondary fs-5">
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
									<p className="text-end text-primary">
										Wallet Balance: &#x20B9; {walletBalance.Rupees}.
										{walletBalance.Paise}
									</p>
									<form className="d-flex flex-column" action="" method="get" id={Styles.buyform} >
										<div class="input-group mb-3">
											{buyMode.inr &&
												<>
													<span class="input-group-text border-0 bg-white fs-3">&#x20B9;</span>
													<input type="text" class="form-control border-0 fs-3" placeholder="INR" value={buyMode.inrValue} onChange={handlebuyValue} />
												</>
											}
											{buyMode.coin &&
												<>
													<input type="text" class="form-control border-0 fs-3" placeholder={coinData.name} value={buyMode.coinValue} onChange={handlebuyValue} />
													<span class="input-group-text border-0 bg-white fs-3">{coinData.symbol}</span>
												</>
											}
											<button class="btn btn-outline-white" type="button" id="button-addon2" onClick={convertBuy}><i class="fa fa-exchange fs-4"></i></button>
										</div>
										<button type="submit" className="btn btn-success" id={Styles.submit} onClick={buyCoinHandler}>
											Buy {coinData.symbol}
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
										<div class="input-group mb-3">
											{sellMode.inr &&
												<>
													<span class="input-group-text border-0 bg-white fs-3">&#x20B9;</span>
													<input type="text" class="form-control border-0 fs-3" placeholder="INR" value={sellMode.inrValue} onChange={handlesellValue} />
												</>
											}
											{sellMode.coin &&
												<>
													<input type="text" class="form-control border-0 fs-3" placeholder={coinData.name} value={sellMode.coinValue} onChange={handlesellValue} />
													<span class="input-group-text border-0 bg-white fs-3">{coinData.symbol}</span>
												</>
											}
											<button class="btn btn-outline-white" type="button" id="button-addon2" onClick={convertSell}><i class="fa fa-exchange fs-4"></i></button>
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
