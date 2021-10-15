import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

import '../components/HomeHeaderBar.css';
import Img from "../../shared/img/img.jpg";
import DisplayCrypto from "../components/DisplayCrypto";

const HomeBody = () => {
	return (
		<Router>
			<div>
				<img src={Img} className="img-fluid" alt="" />
				<DisplayCrypto />
				<div className="d-flex justify-content-evenly">
					<div className="card">
						<div className="card-body">
							<i className="fa fa-bolt" aria-hidden="true"></i>
							<p>
								<h4>Fast & simple</h4>
								Start investing in under 10 minutes
							</p>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<i className="fa fa-credit-card-alt" aria-hidden="true"></i>
							<p>
								<h4>Easy deposit & withdrawals</h4>
								Quickly add & withdraw funds to your bank account
							</p>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<i className="fa fa-shield" aria-hidden="true"></i>
							<p>
								<h4>Safe & secure</h4>
								World className security features ensure your investments are in
								safe hands
							</p>
						</div>
					</div>
				</div>
				<h2>Get started in 3 steps</h2>
				<div className="d-flex justify-content-evenly align-items-center">
					<div className="card">
						<div className="card-body">
							<i className="fa fa-user-plus" aria-hidden="true"></i>
							<p>
								<h4>1. Create an account</h4>
								Sign up with your email and mobile in just 5 minutes
							</p>
						</div>
					</div>
					<h1>&#8594;</h1>
					<div className="card">
						<div className="card-body">
							<i className="fa fa-inr" aria-hidden="true"></i>
							<p>
								<h4>2. Add funds to wallet</h4>
								Quickly add money to your CryptoX investment wallet
							</p>
						</div>
					</div>
					<h1>&#8594;</h1>
					<div className="card">
						<div className="card-body">
							<i className="fa fa-btc" aria-hidden="true"></i>
							<p>
								<h4>3. Start investing in crypto</h4>
								Buy & Sell a variety of top coins at the best prices
							</p>
						</div>
					</div>
				</div>
				<div className="d-grid gap-2 col-6 mx-auto">
					<Link to="/signup" className="btn btn-success" id="getStarted">
						Get started
					</Link>
				</div>
			</div>
		</Router>
	);
}

export default HomeBody;