import React, { Fragment } from "react";
import Header from "./Header";
import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "./dashboard";
import CryptoList from "../Trade/CryptoList";
import Portfolio from "../Portfolio/Portfolio";
import Watchlist from "../Watchlist/Watchlist";

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
				<Route path='*'>
					<Redirect to="/" />
				</Route>
			</Switch>
		</Fragment>
	);
}

export default DashboardRouter;