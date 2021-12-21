import React from "react";
import { Link } from "react-router-dom";
import Styles from "./WatchList.module.css";

const WatchItem = ({ data, onRemove }) => {
	let change_1h = data.market_data.price_change_percentage_1h_in_currency.inr;
	let change_24h = data.market_data.price_change_percentage_24h;

	const removeFromWatchList = (event) => {
		event.preventDefault();
		onRemove(data.id);
	};

	return (
		<tr>
			<td>
				<button
					id="add"
					type="button"
					className="btn btn-light bg-white"
					data-bs-toggle="tooltip"
					data-bs-placement="left"
					title="Remove from Watchlist"
					onClick={removeFromWatchList}
				>
					<i className="fa fa-star"></i>
				</button>
			</td>
			<td>
				<Link to="/" className="text-dark text-decoration-none">
					<h5>
						{data.name}
						<img className={Styles.coins} src={data.image.small} alt=""></img>
					</h5>
					<h6>({data.symbol})</h6>
				</Link>
			</td>
			<td>
				<strong>&#8377; </strong>
				{parseFloat(data.market_data.current_price.inr).toFixed(2)}
			</td>
			<td>
				{change_1h < 0 && (
					<p className="text-danger">
						{change_1h}
						<strong> %</strong>
					</p>
				)}
				{change_1h >= 0 && (
					<p className="text-success">
						{change_1h}
						<strong> %</strong>
					</p>
				)}
			</td>
			<td>
				{change_24h < 0 && (
					<p className="text-danger">
						{change_24h}
						<strong> %</strong>
					</p>
				)}
				{change_24h >= 0 && (
					<p className="text-success">
						{change_24h}
						<strong> %</strong>
					</p>
				)}
			</td>
			<td>
				<strong>&#8377; </strong>
				{data.market_data.market_cap.inr}
			</td>
			<td>
				<button type="button" className="btn btn-success">
					Buy
				</button>
			</td>
		</tr>
	);
};

export default WatchItem;