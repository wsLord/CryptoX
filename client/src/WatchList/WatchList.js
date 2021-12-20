import React, { useState, useEffect, useContext, Fragment } from "react";
import axios from "axios";

import bitimg from "../shared/img/bit.jpg";
import Styles from "./Watchlist.module.css";
import WatchItem from "./WatchItem";
import Alert from "../shared/components/Alert";
import AuthContext from "../store/authContext";

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const Watchlist = () => {
	const ctx = useContext(AuthContext);

	const [error, setError] = useState(null);
	const [coins, setCoins] = useState([]);
	const [totalCoins, setTotalCoins] = useState(0);

	useEffect(() => {
		const initialize = async () => {
			// Adding id of coins in watchlist from database
			try {
				const {
					data: { watchList: watchlist },
				} = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/user/data`,
					{
						watchList: true,
					},
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				console.log(watchlist);

				for (let coinid of watchlist) {
					let { data } = await CoinGeckoClient.coins.fetch(coinid, {
						tickers: false,
						community_data: false,
						developer_data: false,
						sparkline: false,
					});

					console.log(coinid, data);

					setCoins((oldList) => {
						return [...oldList, data];
					});
					setTotalCoins((oldCount) => {
						return oldCount + 1;
					});
				}
			} catch (err) {
				console.log(err);
				// console.log(err.response.data.message);
				setError("Error fetching watchlist array");
			}
		};

		initialize();

		return () => {
			setCoins([]);
			setTotalCoins(0);
		};
	}, [ctx]);

	const removeFromWatchList = async (id) => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/user/watchlist/remove/${id}`,
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			setError(res.data.message);
			setCoins((currentList) => {
				return currentList.filter((element) => element.id !== id);
			});
		} catch (err) {
			console.log(err.response.data.message);
			setError(err.response.data.message);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<Fragment>
			{error && <Alert msg={error} onClose={clearError} />}
			<div className="card shadow p-3 mb-5 bg-body rounded" id={Styles.watch}>
				<div className="card-header ">
					<h3>Watchlist</h3>
				</div>
				<div className="card-body">
					{totalCoins === 0 && (
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
					{totalCoins > 0 && (
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
								{coins.map((element) => {
									return (
										<WatchItem
											data={element}
											key={element.symbol}
											onRemove={removeFromWatchList}
										/>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default Watchlist;
