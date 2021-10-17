// import { Fragment } from "react";

import Home from "./Home/pages/Home";
import "./App.css";
import { Switch, Route } from "react-router";
import { useContext } from "react";
import AuthContext from "./store/authContext";
import DashboardRouter from "./Dashboard/DashboardRouter";

const App = () => {
	const ctx = useContext(AuthContext);

	return (
		<div className="App">
			<Switch>
				<Route for="/">
					{!ctx.isLoggedIn && <Home />}
					{ctx.isLoggedIn && <DashboardRouter />}
				</Route>
			</Switch>
		</div>
	);
};

export default App;
