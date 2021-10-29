import React, { useState, useEffect } from "react";
import bitimg from "../shared/img/bit.jpg";
import Styles from "./Watchlist.module.css";
import WatchItem from "./WatchItem";

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const Watchlist = () => {
	const [currencies, setCurrencies] = useState([]);
	const [totalCurrencies, setTotalCurrencies] = useState(0);

	useEffect(() => {
		const initialize = async () => {
			const watchlist = ["bitcoin", "ethereum", "tether", "binancecoin", "solana"]; //Add id of coins in watchlist from database
			for (var coinid of watchlist) {
				let { data } = await CoinGeckoClient.coins.fetch(coinid, {
					tickers: false,
					community_data: false,
					developer_data: false,
					sparkline: false
				});

				console.log(data);

				setCurrencies(oldList => {
					return [...oldList, data];
				});
				setTotalCurrencies(oldCount => {
					return (oldCount + 1);
				});
			}
		};

		initialize();
	}, []);

	return (
		<div>
			<div className="card shadow p-3 mb-5 bg-body rounded" id={Styles.watch}>
				<div className="card-header ">
					<h3>Watchlist</h3>
				</div>
				<div className="card-body">
					{totalCurrencies === 0 && (
						<div className="d-flex flex-column justify-content-center align-items-center">
							<img src={bitimg} className={Styles.bitcoin} alt="" />
							<h4>Start building your watchlist!</h4>
							<h6 className="text-secondary">
								Wherever you see the star icon, you can use it to add assets
								here.
							</h6>
							<a className="btn btn-success m-10" href="/list">
								Explore
							</a>
						</div>
					)}
					{totalCurrencies > 0 && (
						<table className="table">
							<thead>
								<tr>
									<th scope="col">*</th>
									<th scope="col">Name</th>
									<th scope="col">Price</th>
									<th scope="col">Change % (1h)</th>
									<th scope="col">Change % (24h)</th>
									<th scope="col">Market Cap</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								{currencies.map((element) => {
									return <WatchItem data={element} key={element.symbol} />;
								})}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default Watchlist;
