import React, { Fragment } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Header from "./Header";
import Dashboard from "./Dashboard";
import CryptoList from "../Trade/CryptoList";
import Portfolio from "../Portfolio/Portfolio";
import Watchlist from "../Watchlist/Watchlist";

const DashboardRouter = () => {
	return (
		<Fragment>
			<Header />
			<Switch>
				<Route exact path="/">
					<Dashboard username="Sanskar Jain" isverify={false}/>
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