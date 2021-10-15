import { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

import Footer from "../../shared/components/Footer";
import HeaderBar from "../components/HomeHeaderBar";
import HomeBody from "./HomeBody";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";

const Home = () => {
	return (
		<Fragment>
			<HeaderBar />
			<Switch>
				<Route exact path="/">
					<HomeBody />
				</Route>
				<Route exact path="/login">
					<Login ismsg={false} msg={""} />
				</Route>
				<Route exact path="/signup">
					<SignUp ismsg={false} msg={""} />
				</Route>
			</Switch>
			<Footer />
		</Fragment>
	);
};

export default Home;
