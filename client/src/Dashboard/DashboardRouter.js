import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import CryptoList from "../Trade/CryptoList";
import Portfolio from "../Portfolio/Portfolio";
import Watchlist from "../Watchlist/Watchlist";

const DashboardRouter = () => {
	return (
		<Router>
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
			</Switch>
		</Router>
	);
}

export default DashboardRouter;