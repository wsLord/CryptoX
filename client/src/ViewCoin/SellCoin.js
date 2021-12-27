import React, { Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Styles from "./CoinDetail.module.css";
import AuthContext from "../store/authContext";

const SellCoin = ({ coinData, assetData, onError }) => {
	const ctx = useContext(AuthContext);
	const history = useHistory();

	const [sellMode, setSellMode] = useState({
		inrValue: "0",
		coinValue: "0",
		inr: true,
		coin: false,
	});

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

	const convertSell = () => {
		const price = coinData.market_data.current_price.inr;
		if (sellMode.inr) {
			const coinvalue = sellMode.inrValue / price;
			setSellMode((oldSellMode) => {
				return {
					inrValue: oldSellMode.inrValue,
					coinValue: coinvalue,
					inr: false,
					coin: true,
				};
			});
		} else {
			const inrvalue = sellMode.coinValue * price;
			setSellMode((oldSellMode) => {
				return {
					inrValue: inrvalue,
					coinValue: oldSellMode.coinValue,
					inr: true,
					coin: false,
				};
			});
		}
	};

	const sellCoinHandler = async (event) => {
		event.preventDefault();

		try {
			let data;
			if (sellMode.inr) {
				const res = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/transaction/sell/amount`,
					{
						amount: sellMode.inrValue,
						coinid: coinData.id,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				data = res.data;
			} else {
				const res = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/transaction/sell/quantity`,
					{
						quantity: sellMode.coinValue,
						coinid: coinData.id,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				data = res.data;
			}

			console.log(data);

			// Success
			return history.push({
				pathname: "/confirm/buysell",
				state: {
					...data,
				},
			});
		} catch (err) {
			console.log(err.response.data.message);
			onError(err.response.data.message);
		}
	};

	return (
		<Fragment>
			<p className="text-end text-primary">
				Available Quantity: {" " + assetData.quantity + " " + coinData.symbol.toUpperCase()}
			</p>
			<form
				className="d-flex flex-column"
				action=""
				method="get"
				id={Styles.sellform}
				onSubmit={sellCoinHandler}
			>
				<div class="input-group mb-3">
					{sellMode.inr && (
						<>
							<span class="input-group-text border-0 bg-white fs-3">&#x20B9;</span>
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
				<button type="submit" className="btn btn-success" id={Styles.submit}>
					Sell {coinData.symbol.toUpperCase()}
				</button>
			</form>
		</Fragment>
	);
};

export default SellCoin;
