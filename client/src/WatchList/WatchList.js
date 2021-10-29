import React, { useState, useEffect, useContext } from "react";
import bitimg from "../shared/img/bit.jpg";
import Styles from "./Watchlist.module.css";
import WatchItem from "./WatchItem";
import AuthContext from "../store/authContext";

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const Watchlist = () => {
	const ctx = useContext(AuthContext);

	const [coins, setCoins] = useState([]);
	const [totalCoins, setTotalCoins] = useState(0);

	useEffect(() => {
		const initialize = async () => {
			let watchlist = [];

			// Adding id of coins in watchlist from database
			try {
				const res = await fetch(
					`${process.env.REACT_APP_SERVER_URL}/user/watchlist`,
					{
						method: "GET",
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				const responseData = await res.json();

				if (res.ok) {
					watchlist = responseData.data;
				} else {
					// Error fetching watchlist array
					console.log(responseData.message);
					console.log("Error fetching watchlist array");
				}
			} catch (err) {
				console.log(err);
			}

			// watchlist = [
			// 	"bitcoin",
			// 	"ethereum",
			// 	"tether",
			// 	"binancecoin",
			// 	"solana",
			// ];
			for (var coinid of watchlist) {
				let { data } = await CoinGeckoClient.coins.fetch(coinid, {
					tickers: false,
					community_data: false,
					developer_data: false,
					sparkline: false,
				});

				console.log(data);

				setCoins((oldList) => {
					return [...oldList, data];
				});
				setTotalCoins((oldCount) => {
					return oldCount + 1;
				});
			}
		};

		initialize();

		return () => {
      setCoins([]);
			setTotalCoins(0);
    };
	}, [ctx]);

	return (
		<div>
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
