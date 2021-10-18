import React from "react";
import Logo from "../shared/img/icon.png";
import { Link } from "react-router-dom";
import Styles from "./header.module.css"

export default function Header() {
	return (
		<div className="top">
			<nav className="navbar navbar-expand-lg navbar-light bg-light" id={Styles.links}>
				<div className="container-fluid">
					<Link className="navbar-brand" to="/">
						<img
							src={Logo}
							alt=""
							width="50"
							height="50"
							className="d-inline-block align-text-top"
						/>
					</Link>
					<Link className="navbar-brand" to="/">
						<h3>CryptoX</h3>
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0" id={Styles.links}>
							<li className="nav-item">
								<Link className="nav-link active" id={Styles.toplink} to="/portfolio">
									Portfolio
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link active" id={Styles.toplink} to="/watchlist">
									Watchlist
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link active" id={Styles.toplink} to="/list">
									Trade
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link active" id={Styles.toplink} to="/">
									Exchange
								</Link>
							</li>
						</ul>
						<ul className="nav navbar-nav navbar-right">
							<button type="button" id={Styles.profile} className="btn btn-light">
								<i className="fa fa-user-circle-o"></i>
							</button>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
}
