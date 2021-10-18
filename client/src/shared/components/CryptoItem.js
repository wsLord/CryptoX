import React from "react";
import Styles from "./crypto.module.css";

const CryptoItem = (props) => {
	return (
		<div key={props.symbol}>
			<ul className="list-group list-group-horizontal" id={Styles.groups}>
				<li className="list-group-item" id={Styles.coins}>
					<button
						id="add"
						type="button"
						className="btn btn-light"
						data-bs-toggle="tooltip"
						data-bs-placement="left"
						title="Add to Watchlist"
					>
						<i className="fa fa-star-o" id={Styles.star}></i>
					</button>
					<div>
						<h5>
							{props.name} <img src={props.img} alt=""></img>
						</h5>
						<h6>({props.symbol})</h6>
					</div>
				</li>
				<li className="list-group-item" id={Styles.cryptoid}>
					<strong>&#8377; </strong>
					{props.price}
				</li>
				{props.change < 0 && (
					<li className="list-group-item text-danger" id={Styles.cryptoid}>
						{props.change}
						<strong> &#8595;</strong>
					</li>
				)}
				{props.change >= 0 && (
					<li className="list-group-item text-success" id={Styles.cryptoid}>
						{props.change}
						<strong> &#8593;</strong>
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
