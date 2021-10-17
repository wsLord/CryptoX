import { Fragment, useContext } from "react";
import { Switch, Route } from "react-router-dom";

import Footer from "../../shared/components/Footer";
import HeaderBar from "../components/HomeHeaderBar";
import HomeBody from "./HomeBody";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";
import ForgotPassword from "../../pages/ForgotPassword";
import AuthContext from "../../store/authContext";
import Portfolio from "../../Portfolio/Portfolio";

const Home = () => {
	const ctx = useContext(AuthContext);

	return (
		<Fragment>
			<HeaderBar />
			<Switch>
				<Route exact path="/">
					{!ctx.isLoggedIn && <HomeBody />}
					{ctx.isLoggedIn && <Portfolio />}
				</Route>
				{!ctx.isLoggedIn && (
					<Route exact path="/login">
						<Login ismsg={false} msg={""} />
					</Route>
				)}
				{!ctx.isLoggedIn && (
					<Route exact path="/signup">
						<SignUp ismsg={false} msg={""} />
					</Route>
				)}
				{!ctx.isLoggedIn && (
					<Route exact path="/forgotpassword">
						<ForgotPassword />
					</Route>
				)}
			</Switch>
			<Footer />
		</Fragment>
	);
};

export default Home;
