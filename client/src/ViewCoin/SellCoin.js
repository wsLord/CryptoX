import React, { Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Styles from "./CoinDetail.module.css";
import AuthContext from "../store/authContext";

const BuyCoin = ({ coinData, walletBalance, onError }) => {
	const ctx = useContext(AuthContext);
	const history = useHistory();

	const [buyMode, setBuyMode] = useState({
		inrValue: "0",
		coinValue: "0",
		inr: true,
		coin: false,
	});

	const onClickBuyValue = (event) => {
		if (buyMode.inr) {
			setBuyMode({
				inrValue: event.target.value,
				coinValue: "",
				inr: true,
				coin: false,
			});
		} else {
			setBuyMode({
				inrValue: "",
				coinValue: event.target.value,
				inr: false,
				coin: true,
			});
		}
	};

	const convertBuy = () => {
		const price = coinData.market_data.current_price.inr;
		if (buyMode.inr) {
			const coinvalue = buyMode.inrValue / price;
			setBuyMode((oldBuyMode) => {
				return {
					inrValue: oldBuyMode.inrValue,
					coinValue: coinvalue,
					inr: false,
					coin: true,
				};
			});
		} else {
			const inrvalue = buyMode.coinValue * price;
			setBuyMode((oldBuyMode) => {
				return {
					inrValue: inrvalue,
					coinValue: oldBuyMode.coinValue,
					inr: true,
					coin: false,
				};
			});
		}
	};

	const buyCoinHandler = async (event) => {
		event.preventDefault();
		try {
			let data;
			if (buyMode.inr) {
				const res = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/transaction/buy/amount`,
					{
						amount: buyMode.inrValue,
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
					`${process.env.REACT_APP_SERVER_URL}/transaction/buy/quantity`,
					{
						quantity: buyMode.coinValue,
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
				Wallet Balance: &#x20B9; {walletBalance.Rupees}.{walletBalance.Paise}
			</p>
			<form
				className="d-flex flex-column"
				action=""
				method="get"
				id={Styles.buyform}
				onSubmit={buyCoinHandler}
			>
				<div class="input-group mb-3">
					{buyMode.inr && (
						<>
							<span class="input-group-text border-0 bg-white fs-3">
								&#x20B9;
							</span>
							<input
								type="text"
								class="form-control border-0 fs-3"
								placeholder="INR"
								value={buyMode.inrValue}
								onChange={onClickBuyValue}
							/>
						</>
					)}
					{buyMode.coin && (
						<>
							<input
								type="text"
								class="form-control border-0 fs-3"
								placeholder={coinData.name}
								value={buyMode.coinValue}
								onChange={onClickBuyValue}
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
						onClick={convertBuy}
					>
						<i class="fa fa-exchange fs-4"></i>
					</button>
				</div>
				<button
					type="submit"
					className="btn btn-success"
					id={Styles.submit}
				>
					Buy {coinData.symbol.toUpperCase()}
				</button>
			</form>
		</Fragment>
	);
};

export default BuyCoin;
