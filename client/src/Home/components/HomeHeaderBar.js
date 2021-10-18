import { Link } from "react-router-dom";
import Logo from "../../shared/img/icon.png";
import Styles from './HomeHeaderBar.module.css';

const HeaderBar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
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
				<Link className="navbar-brand" id={Styles.brand} to="/">
					CryptoX
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
					<ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
					<ul className="nav navbar-nav navbar-right" id={Styles.links}>
						<li className="nav-item">
							<Link className="nav-link active" id={Styles.toplink} to="/login">
								Login
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link active" id={Styles.toplink} to="/signup">
								Sign Up
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default HeaderBar;
