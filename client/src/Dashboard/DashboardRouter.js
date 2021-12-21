import React, { Fragment } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Header from "../shared/components/Header";
import Footer from '../shared/components/Footer'
import Dashboard from "./Dashboard";
import CoinDetail from "../ViewCoin/CoinDetail";
import CryptoList from "../Trade/CryptoList";
import Portfolio from "../Portfolio/Portfolio";
import Watchlist from "../WatchList/WatchList";
import Transactions from "../Transactions/TransactionsList";
import Referral from "../ViewCoin/CoinDetail";  // Change it back to referral

const DashboardRouter = () => {
	return (
		<Fragment>
			<Header />
			<Switch>
				<Route exact path="/">
					<Dashboard />
				</Route>
				<Route exact path="/list">
					<CryptoList />
				</Route>
				<Route exact path="/portfolio">
					<Portfolio />
				</Route>
				<Route exact path="/watchlist">
					<Watchlist />
				</Route>
				<Route exact path="/transactions">
					<Transactions />
				</Route>
				<Route exact path="/referral">
					<Referral />
				</Route>
				<Route path="/coins/:coinid">
					<CoinDetail />
				</Route>
				<Route path='*'>
					<Redirect to="/" />
				</Route>
			</Switch>
			<Footer/>
		</Fragment>
	);
}

export default DashboardRouter;