import React, { Component } from "react";

import CryptoItem from "../../shared/components/CryptoItem";
import Styles from "../../shared/components/crypto.module.css";

export default class DisplayCrypto extends Component {
	constructor() {
		super();
		this.state = {
			articles: [],
		};
	}
	async componentDidMount() {
		let url =
			"https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h";
		let date = await fetch(url);
		let parseDate = await date.json();
		this.setState({ articles: parseDate });
	}
	render() {
		return (
			<div className="d-flex flex-column align-items-center" id={Styles.crypto}>
				<h1>
					Trending
					<img
						src="https://s2.coinmarketcap.com/static/cloud/img/TrendingIcon.png?_=6d1bb23"
						alt=""
					/>
				</h1>
				<ul className="list-group list-group-horizontal" id={Styles.groups}>
					<li className="list-group-item" id={Styles.cryptoid1}>
						Name
					</li>
					<li className="list-group-item" id={Styles.cryptoid1}>
						Price
					</li>
					<li className="list-group-item" id={Styles.cryptoid1}>
						Change(%)
					</li>
					<li className="list-group-item" id={Styles.cryptoid1}>
						Trade
					</li>
				</ul>
				{this.state.articles.map((element) => {
					return (
						<CryptoItem
							name={element.name}
							img={element.image}
							key={element.symbol}
							price={element.current_price}
							symbol={element.symbol}
							change={element.price_change_percentage_24h}
						/>
					);
				})}
			</div>
		);
	}
}
