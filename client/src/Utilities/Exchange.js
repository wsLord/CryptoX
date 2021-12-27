import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import AuthContext from "../store/authContext";

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const Exchange = ({ coinAssetList: assetList, onError }) => {
	const history = useHistory();

	const ctx = useContext(AuthContext);

	const [rate, setRate] = useState(null);
	const [coinAssetList, setCoinAssetList] = useState([]);
	const [maxQuantityLimit, setMaxQuantityLimit] = useState(0);
	const [fromCoin, setFromCoin] = useState({
		name: "",
		id: "",
	});
	const [toCoin, setToCoin] = useState({
		name: "",
		id: "",
	});
	const inputRefQuantity = useRef();

	const [searchInput, setSearchInput] = useState("");

	const [allCoins, setAllCoins] = useState([]);

	const [searchData, setSearchData] = useState([]);

	useEffect(() => {
		const fetchdata = async () => {
			try {
				let { data } = await CoinGeckoClient.coins.list();

				data.splice(200);

				// console.log(data);
				setAllCoins(data);
			} catch (err) {
				console.log(err);
				// onError;
			}
		};

		fetchdata();
	}, []);

	// Updating state of asset list on change
	useEffect(() => {
		if (assetList) {
			console.log(assetList);
			setCoinAssetList(assetList);
		}
	}, [assetList]);

	// Updating rate if both coins are choosen
	useEffect(() => {
		if (toCoin.name !== "" && fromCoin.name !== "") {
			let trate = (parseFloat(toCoin.price) / parseFloat(fromCoin.price)).toFixed(7);

			setRate(trate);
		}
	}, [toCoin, fromCoin]);

	const handleFromCoin = (event) => {
		const coinid = event.target.value;

		coinAssetList.forEach((element) => {
			if (element.id === coinid) {
				setFromCoin({
					id: coinid,
					name: element.name,
					price: element.currentPriceString,
					symbol: element.symbol.toUpperCase(),
				});
				setMaxQuantityLimit(element.quantity);
			}
		});
	};

	const handleToCoin = async (event) => {
		const coinid = event.target.value;

		try {
			const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/coin/data`, {
				id: coinid,
				name: true,
				price: true,
				symbol: true,
			});

			console.log(data);

			setToCoin(data);
			setSearchInput(data.name);
		} catch (err) {
			console.log(err.response.data.message);
			onError(err.response.data.message);
		}
		setSearchData([]);
	};

	const searchHandler = (event) => {
		const value = event.target.value;
		setSearchInput(value);

		let temp = [];
		if (value !== "") {
			let regex = new RegExp(`${value}`, "i");
			for (let i in allCoins) {
				if (regex.test(allCoins[i].name)) {
					temp.push(allCoins[i]);
				}
			}
		}

		setSearchData(temp);
	};

	const exchangeCoinHandler = async (event) => {
		event.preventDefault();

		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/transaction/exchange`,
				{
					coinid1: fromCoin.id,
					coinid2: toCoin.id,
					quantity: inputRefQuantity.current.value,
				},
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			console.log(data);

			// Success
			return history.push({
				pathname: "/confirm/exchange",
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
		<div>
			<form
				className="m-5 d-flex flex-column align-items-start"
				action=""
				onSubmit={exchangeCoinHandler}
			>
				<div className="d-flex justify-content-between w-100">
					<label HtmlFor="fromAmount" class="form-label h5">
						From
					</label>
					{fromCoin.name !== "" && (
						<p className="text-primary text-end">
							Available : <span className="h5">{maxQuantityLimit}</span> {fromCoin.name} in Assets
						</p>
					)}
				</div>
				<div class="input-group mb-3">
					<select class="form-select" onChange={handleFromCoin}>
						<option className="fs-6" value="" selected>
							Select Coin
						</option>
						{coinAssetList.map((element) => {
							return (
								<option className="fs-6" key={element.id} value={element.id}>
									{element.name}
								</option>
							);
						})}
					</select>
					<input
						type="number"
						class="form-control w-50"
						id="fromAmount"
						placeholder="Quantity"
						min="0"
						max={maxQuantityLimit}
						ref={inputRefQuantity}
						required
					/>
				</div>

				<label HtmlFor="toAmount" class="form-label h5">
					To
				</label>
				<input
					type="search"
					class="form-control"
					placeholder="Search"
					value={searchInput}
					onChange={searchHandler}
				/>
				{searchData.length > 0 && (
					<select
						class="form-select"
						size="3"
						aria-label="size 3 select example"
						onChange={handleToCoin}
					>
						{searchData.map((element) => {
							return (
								<option className="fs-6" key={element.id} value={element.id}>
									{element.name}
								</option>
							);
						})}
					</select>
				)}
				{rate && (
					<div className="w-100">
						<div className="mt-3 d-flex justify-content-between">
							<p className="h4">Rate </p>
							<p className="fs-5 text-secondary">
								1 {fromCoin.symbol} &asymp; {rate} {toCoin.symbol}
							</p>
						</div>
						<p className="text-primary">*May change at time of transaction</p>
					</div>
				)}
				<button type="submit" className="btn btn-success fs-5 mt-3 w-100" disabled={!rate}>
					Exchange
				</button>
			</form>
		</div>
	);
};

export default Exchange;
