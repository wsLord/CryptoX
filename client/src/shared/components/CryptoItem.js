import React, { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Styles from "./crypto.module.css";
import AuthContext from "../../store/authContext";

const CryptoItem = (props) => {
	const ctx = useContext(AuthContext);

	const addToWatchList = async () => {
		const coinID = props.symbol;

		try {
			const res = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/user/watchlist/add/${coinID}`,
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			props.onAlert(res.data.message);
		} catch (err) {
			console.log(err.response.data.message);
			props.onAlert(err.response.data.message);
		}
	};

	return (
		<div key={props.symbol}>
			<ul className="list-group list-group-horizontal" id={Styles.groups}>
				<li className="list-group-item" id={Styles.coins}>
					<button
						id="add"
						type="button"
						className="btn btn-light bg-white"
						data-bs-toggle="tooltip"
						data-bs-placement="left"
						title="Add to Watchlist"
						onClick={addToWatchList}
					>
						<i className="fa fa-star-o" id={Styles.star}></i>
					</button>
					<Link to="/viewdetails" className="text-dark text-decoration-none">
						<h5>
							{props.name} <img src={props.img} alt=""></img>
						</h5>
						<h6>({props.symbol})</h6>
					</Link>
				</li>
				<li className="list-group-item" id={Styles.cryptoid}>
					<strong>&#8377; </strong>
					{props.price}
				</li>
				{props.change < 0 && (
					<li className="list-group-item text-danger" id={Styles.cryptoid}>
						{props.change}
						<strong>
							{" "}
							<i className="fa fa-caret-down"></i>
						</strong>
					</li>
				)}
				{props.change >= 0 && (
					<li className="list-group-item text-success" id={Styles.cryptoid}>
						{props.change}
						<strong>
							{" "}
							<i className="fa fa-caret-up"></i>
						</strong>
					</li>
				)}
				<li className="list-group-item" id={Styles.cryptoid}>
					<button type="button" className="btn btn-success">
						Buy
					</button>
				</li>
			</ul>
		</div>
	);
};

export default CryptoItem;
