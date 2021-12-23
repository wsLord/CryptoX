import React from "react";
import { Link, useHistory } from "react-router-dom";
import Styles from "./WatchList.module.css";

const convertToInternationalCurrencySystem = (labelValue) => {
	// Twelve Zeroes for Trillions
	return Math.abs(Number(labelValue)) >= 1.0e12
		? (Math.abs(Number(labelValue)) / 1.0e12).toFixed(2) + "T"
		: // Nine Zeroes for Billions
		Math.abs(Number(labelValue)) >= 1.0e9
		? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
		: // Six Zeroes for Millions
		Math.abs(Number(labelValue)) >= 1.0e6
		? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
		: // Three Zeroes for Thousands
		Math.abs(Number(labelValue)) >= 1.0e3
		? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
		: Math.abs(Number(labelValue));
};

const WatchItem = ({ data, onRemove }) => {
	const history = useHistory();

	let newPath = `/coins/${data.id}`;
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
				<Link to={newPath} className="text-dark text-decoration-none">
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
				{convertToInternationalCurrencySystem(data.market_data.market_cap.inr)}
			</td>
			<td>
				<button
					type="button"
					className="btn btn-success"
					onClick={() => {
						history.push(newPath);
					}}
				>
					Buy
				</button>
			</td>
		</tr>
	);
};

export default WatchItem;
